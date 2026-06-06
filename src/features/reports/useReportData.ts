// ═══════════════════════════════════════════════════
// features/reports/useReportData.ts
// Hook data untuk laporan Harian, Bulanan, Tahunan
// ═══════════════════════════════════════════════════

import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import type { TransactionItem } from '@/types/transaction'

// ─── Shape output ────────────────────────────────────────────

export interface TxRow {
  id:          string
  code:        string
  type:        'SALE' | 'PURCHASE'
  partnerName: string
  total:       number
  profit:      number   // hanya relevan untuk SALE
  payMethod:   string
  date:        string
}

export interface ProductBreakdown {
  productId:   string
  productName: string
  unit:        string
  qty:         number
  omset:       number
  profit:      number
}

export interface DailyReportData {
  date:         string
  omset:        number
  profit:       number
  purchase:     number
  txCount:      number
  transactions: TxRow[]
  loading:      boolean
}

export interface MonthlyReportData {
  year:       number
  month:      number
  omset:      number
  profit:     number
  purchase:   number
  txCount:    number
  topProducts: ProductBreakdown[]
  dailySummary: { date: string; omset: number; profit: number }[]
  loading:    boolean
}

export interface YearlyMonthRow {
  month:    number    // 1-12
  label:    string    // 'Jan', 'Feb', dst
  omset:    number
  profit:   number
  purchase: number
  txCount:  number
}

export interface YearlyReportData {
  year:     number
  omset:    number
  profit:   number
  purchase: number
  txCount:  number
  months:   YearlyMonthRow[]
  loading:  boolean
}

// ─── Helpers ─────────────────────────────────────────────────

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

function pad(n: number) { return String(n).padStart(2, '0') }

/** Buat prefix YYYY-MM untuk query bulan */
export function monthPrefix(year: number, month: number): string {
  return `${year}-${pad(month)}`
}

/** Semua tanggal dalam satu bulan: '2026-06-01' ... '2026-06-30' */
function daysInMonth(year: number, month: number): string[] {
  const count = new Date(year, month, 0).getDate()
  return Array.from({ length: count }, (_, i) => `${year}-${pad(month)}-${pad(i + 1)}`)
}

// ─── Hook Harian ─────────────────────────────────────────────

export function useDailyReport(date: string): DailyReportData {
  const sales = useLiveQuery(
    () => db.transactions.where('type').equals('SALE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE' && tx.date === date)
      .toArray(),
    [date],
  )

  const purchases = useLiveQuery(
    () => db.transactions.where('type').equals('PURCHASE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE' && tx.date === date)
      .toArray(),
    [date],
  )

  const items = useLiveQuery(
    () => db.transactionItems.toArray(),
    [],
  )

  const partners = useLiveQuery(() => db.partners.toArray(), [])

  const loading = sales === undefined || purchases === undefined
    || items === undefined || partners === undefined

  if (loading) return { date, omset:0, profit:0, purchase:0, txCount:0, transactions:[], loading:true }

  const partnerMap = new Map(partners!.map(p => [p.id, p.name]))
  const itemsMap   = new Map<string, TransactionItem[]>()
  for (const it of items!) {
    const arr = itemsMap.get(it.transactionId) ?? []
    arr.push(it)
    itemsMap.set(it.transactionId, arr)
  }

  const saleTxRows: TxRow[] = sales!.map(tx => {
    const txItems = itemsMap.get(tx.id) ?? []
    const profit  = txItems.reduce((s, it) => s + it.profit, 0)
    return {
      id:          tx.id,
      code:        tx.code,
      type:        'SALE',
      partnerName: partnerMap.get(tx.partnerId) ?? '—',
      total:       tx.total,
      profit,
      payMethod:   tx.payMethod,
      date:        tx.date,
    }
  })

  const purchaseTxRows: TxRow[] = purchases!.map(tx => ({
    id:          tx.id,
    code:        tx.code,
    type:        'PURCHASE',
    partnerName: partnerMap.get(tx.partnerId) ?? '—',
    total:       tx.total,
    profit:      0,
    payMethod:   tx.payMethod,
    date:        tx.date,
  }))

  const transactions = [...saleTxRows, ...purchaseTxRows]
    .sort((a, b) => a.code.localeCompare(b.code))

  const omset    = sales!.reduce((s, tx) => s + tx.total, 0)
  const purchase = purchases!.reduce((s, tx) => s + tx.total, 0)
  const profit   = saleTxRows.reduce((s, r) => s + r.profit, 0)

  return { date, omset, profit, purchase, txCount: sales!.length, transactions, loading: false }
}

// ─── Hook Bulanan ─────────────────────────────────────────────

export function useMonthlyReport(year: number, month: number): MonthlyReportData {
  const prefix = monthPrefix(year, month)

  const sales = useLiveQuery(
    () => db.transactions.where('type').equals('SALE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE' && tx.date.startsWith(prefix))
      .toArray(),
    [prefix],
  )

  const purchases = useLiveQuery(
    () => db.transactions.where('type').equals('PURCHASE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE' && tx.date.startsWith(prefix))
      .toArray(),
    [prefix],
  )

  const items = useLiveQuery(() => db.transactionItems.toArray(), [])

  const loading = sales === undefined || purchases === undefined || items === undefined

  if (loading) {
    return { year, month, omset:0, profit:0, purchase:0, txCount:0, topProducts:[], dailySummary:[], loading:true }
  }

  const saleIds  = new Set(sales!.map(tx => tx.id))
  const saleItems = items!.filter(it => saleIds.has(it.transactionId))

  // Agregat per produk
  const prodMap = new Map<string, ProductBreakdown>()
  for (const it of saleItems) {
    const ex = prodMap.get(it.productId)
    if (ex) {
      ex.qty    += it.qty
      ex.omset  += it.subtotal
      ex.profit += it.profit
    } else {
      prodMap.set(it.productId, {
        productId:   it.productId,
        productName: it.productName,
        unit:        it.unit,
        qty:         it.qty,
        omset:       it.subtotal,
        profit:      it.profit,
      })
    }
  }
  const topProducts = Array.from(prodMap.values())
    .sort((a, b) => b.omset - a.omset)
    .slice(0, 10)

  // Ringkasan per hari
  const days = daysInMonth(year, month)
  const dailySummary = days.map(date => {
    const daySales   = sales!.filter(tx => tx.date === date)
    const daySaleIds = new Set(daySales.map(tx => tx.id))
    const dayItems   = items!.filter(it => daySaleIds.has(it.transactionId))
    return {
      date,
      omset:  daySales.reduce((s, tx) => s + tx.total, 0),
      profit: dayItems.reduce((s, it) => s + it.profit, 0),
    }
  })

  const omset    = sales!.reduce((s, tx) => s + tx.total, 0)
  const purchase = purchases!.reduce((s, tx) => s + tx.total, 0)
  const profit   = saleItems.reduce((s, it) => s + it.profit, 0)

  return { year, month, omset, profit, purchase, txCount: sales!.length, topProducts, dailySummary, loading: false }
}

// ─── Hook Tahunan ─────────────────────────────────────────────

export function useYearlyReport(year: number): YearlyReportData {
  const prefix = String(year)

  const sales = useLiveQuery(
    () => db.transactions.where('type').equals('SALE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE' && tx.date.startsWith(prefix))
      .toArray(),
    [prefix],
  )

  const purchases = useLiveQuery(
    () => db.transactions.where('type').equals('PURCHASE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE' && tx.date.startsWith(prefix))
      .toArray(),
    [prefix],
  )

  const items = useLiveQuery(() => db.transactionItems.toArray(), [])

  const loading = sales === undefined || purchases === undefined || items === undefined

  if (loading) {
    return { year, omset:0, profit:0, purchase:0, txCount:0, months:[], loading:true }
  }

  const saleIds   = new Set(sales!.map(tx => tx.id))
  const saleItems = items!.filter(it => saleIds.has(it.transactionId))

  const months: YearlyMonthRow[] = MONTH_LABELS.map((label, i) => {
    const m   = i + 1
    const pre = `${year}-${pad(m)}`
    const ms  = sales!.filter(tx => tx.date.startsWith(pre))
    const mp  = purchases!.filter(tx => tx.date.startsWith(pre))
    const msIds  = new Set(ms.map(tx => tx.id))
    const mitems = saleItems.filter(it => msIds.has(it.transactionId))
    return {
      month:    m,
      label,
      omset:    ms.reduce((s, tx) => s + tx.total, 0),
      profit:   mitems.reduce((s, it) => s + it.profit, 0),
      purchase: mp.reduce((s, tx) => s + tx.total, 0),
      txCount:  ms.length,
    }
  })

  const omset    = sales!.reduce((s, tx) => s + tx.total, 0)
  const purchase = purchases!.reduce((s, tx) => s + tx.total, 0)
  const profit   = saleItems.reduce((s, it) => s + it.profit, 0)

  return { year, omset, profit, purchase, txCount: sales!.length, months, loading: false }
}
