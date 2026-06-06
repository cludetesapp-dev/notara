import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import { isoToday, startOfMonth } from '@/utils/format'

// ─── Shape yang dikembalikan hook ────────────────────────────
export interface DailyStats {
  omset:       number   // total SALE hari ini
  profit:      number   // laba kotor hari ini
  txCount:     number   // jumlah transaksi SALE hari ini
  purchase:    number   // total PURCHASE hari ini
}

export interface MonthlyStats {
  omset:   number
  profit:  number
  txCount: number
}

export interface TrendPoint {
  label: string    // 'Sen', 'Sel', dst — 7 hari terakhir
  omset: number
  profit: number
}

export interface TopProduct {
  productId:   string
  productName: string
  unit:        string
  qty:         number
  omset:       number
}

export interface RecentTx {
  id:          string
  code:        string
  type:        'SALE' | 'PURCHASE'
  partnerName: string
  date:        string
  total:       number
  status:      string
}

export interface ReceivablePayable {
  totalPiutang: number   // SALE belum lunas (customer utang ke kita)
  totalUtang:   number   // PURCHASE belum lunas (kita utang ke supplier)
  countPiutang: number
  countUtang:   number
}

export interface DashboardData {
  today:        DailyStats
  month:        MonthlyStats
  trend:        TrendPoint[]
  topProducts:  TopProduct[]
  recentTx:     RecentTx[]
  rp:           ReceivablePayable
  loading:      boolean
}

// ─── Helpers ─────────────────────────────────────────────────
const DAY_LABELS = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

function datesLast7(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().slice(0, 10)
  })
}

// ─── Hook ────────────────────────────────────────────────────
export function useDashboardData(): DashboardData {
  const today      = isoToday()
  const monthStart = startOfMonth()
  const last7      = datesLast7()

  // Semua transaksi SALE aktif (tidak deleted)
  const sales = useLiveQuery(
    () => db.transactions
      .where('type').equals('SALE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE')
      .toArray(),
    [],
  )

  // Semua transaksi PURCHASE aktif
  const purchases = useLiveQuery(
    () => db.transactions
      .where('type').equals('PURCHASE')
      .and(tx => !tx.deletedAt && tx.status === 'DONE')
      .toArray(),
    [],
  )

  // Semua transaction items
  const items = useLiveQuery(() => db.transactionItems.toArray(), [])

  // Partners untuk nama
  const partners = useLiveQuery(() => db.partners.toArray(), [])

  const loading = sales === undefined || purchases === undefined
    || items === undefined || partners === undefined

  if (loading) {
    return {
      today:       { omset: 0, profit: 0, txCount: 0, purchase: 0 },
      month:       { omset: 0, profit: 0, txCount: 0 },
      trend:       [],
      topProducts: [],
      recentTx:    [],
      rp:          { totalPiutang: 0, totalUtang: 0, countPiutang: 0, countUtang: 0 },
      loading:     true,
    }
  }

  const partnerMap = new Map(partners!.map(p => [p.id, p.name]))

  // ── Today stats ──────────────────────────────────────────
  const todaySales     = sales!.filter(tx => tx.date === today)
  const todayPurchases = purchases!.filter(tx => tx.date === today)

  const todaySaleIds = new Set(todaySales.map(tx => tx.id))
  const todayItems   = items!.filter(it => todaySaleIds.has(it.transactionId))

  const todayStats: DailyStats = {
    omset:    todaySales.reduce((s, tx) => s + tx.total, 0),
    profit:   todayItems.reduce((s, it) => s + it.profit, 0),
    txCount:  todaySales.length,
    purchase: todayPurchases.reduce((s, tx) => s + tx.total, 0),
  }

  // ── Month stats ──────────────────────────────────────────
  const monthSales   = sales!.filter(tx => tx.date >= monthStart)
  const monthSaleIds = new Set(monthSales.map(tx => tx.id))
  const monthItems   = items!.filter(it => monthSaleIds.has(it.transactionId))

  const monthStats: MonthlyStats = {
    omset:   monthSales.reduce((s, tx) => s + tx.total, 0),
    profit:  monthItems.reduce((s, it) => s + it.profit, 0),
    txCount: monthSales.length,
  }

  // ── 7-day trend ───────────────────────────────────────────
  const trend: TrendPoint[] = last7.map(date => {
    const daySales   = sales!.filter(tx => tx.date === date)
    const daySaleIds = new Set(daySales.map(tx => tx.id))
    const dayItems   = items!.filter(it => daySaleIds.has(it.transactionId))
    const d          = new Date(date)
    return {
      label:  DAY_LABELS[d.getDay()],
      omset:  daySales.reduce((s, tx) => s + tx.total, 0),
      profit: dayItems.reduce((s, it) => s + it.profit, 0),
    }
  })

  // ── Top products bulan ini ────────────────────────────────
  const monthItemsAll = items!.filter(it => monthSaleIds.has(it.transactionId))
  const prodMap = new Map<string, TopProduct>()
  for (const it of monthItemsAll) {
    const existing = prodMap.get(it.productId)
    if (existing) {
      existing.qty   += it.qty
      existing.omset += it.subtotal
    } else {
      prodMap.set(it.productId, {
        productId:   it.productId,
        productName: it.productName,
        unit:        it.unit,
        qty:         it.qty,
        omset:       it.subtotal,
      })
    }
  }
  const topProducts = Array.from(prodMap.values())
    .sort((a, b) => b.omset - a.omset)
    .slice(0, 5)

  // ── Recent transactions (10 terbaru, sale + purchase) ────
  const allTx = [...sales!, ...purchases!]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10)

  const recentTx: RecentTx[] = allTx.map(tx => ({
    id:          tx.id,
    code:        tx.code,
    type:        tx.type as 'SALE' | 'PURCHASE',
    partnerName: partnerMap.get(tx.partnerId) ?? '—',
    date:        tx.date,
    total:       tx.total,
    status:      tx.status,
  }))

  // ── Piutang (SALE DP belum lunas) ────────────────────────
  // SALE dengan payMethod === 'DP': sisa = total - dpAmount
  const dpSales = sales!.filter(tx => tx.payMethod === 'DP' && tx.dpAmount < tx.total)
  const totalPiutang = dpSales.reduce((s, tx) => s + (tx.total - tx.dpAmount), 0)

  // ── Utang (PURCHASE DP belum lunas) ──────────────────────
  const dpPurchases = purchases!.filter(tx => tx.payMethod === 'DP' && tx.dpAmount < tx.total)
  const totalUtang  = dpPurchases.reduce((s, tx) => s + (tx.total - tx.dpAmount), 0)

  const rp: ReceivablePayable = {
    totalPiutang,
    totalUtang,
    countPiutang: dpSales.length,
    countUtang:   dpPurchases.length,
  }

  return { today: todayStats, month: monthStats, trend, topProducts, recentTx, rp, loading: false }
}
