// ═══════════════════════════════════════════════════
// features/transactions/useTransactionForm.ts
// Hook form transaksi — create + edit
// ═══════════════════════════════════════════════════

import { useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import { transactionService } from '@/services/transactionService'
import { ValidationError, StockError } from '@/core/errors'
import type { Product }          from '@/types/product'
import type { Partner }          from '@/types/partner'
import type { Transaction, TransactionType, PayMethod } from '@/types/transaction'
import { isoToday } from '@/utils/format'

// ─── Tipe internal form ──────────────────────────────────────

export interface CartItem {
  productId:   string
  productName: string
  unit:        string
  qty:         number
  buyPrice:    number
  sellPrice:   number
  subtotal:    number
  profit:      number
}

export interface TransactionFormState {
  type:          TransactionType
  partnerId:     string
  partnerName:   string
  date:          string
  notes:         string
  discountType:  'nominal' | 'percent'
  discountValue: number
  dpAmount:      number
  payMethod:     PayMethod
  dueDate:       string
  bankName:      string
  accountNo:     string
  accountName:   string
}

const EMPTY_FORM: TransactionFormState = {
  type:          'SALE',
  partnerId:     '',
  partnerName:   '',
  date:          isoToday(),
  notes:         '',
  discountType:  'nominal',
  discountValue: 0,
  dpAmount:      0,
  payMethod:     'CASH',
  dueDate:       '',
  bankName:      '',
  accountNo:     '',
  accountName:   '',
}

// ─── Kalkulasi ───────────────────────────────────────────────

function calcTotals(
  cart: CartItem[],
  discountType: 'nominal' | 'percent',
  discountValue: number,
) {
  const subtotal = cart.reduce((s, it) => s + it.subtotal, 0)
  const discount = discountType === 'percent'
    ? Math.round(subtotal * discountValue / 100)
    : discountValue
  const total  = Math.max(0, subtotal - discount)
  const profit = cart.reduce((s, it) => s + it.profit, 0) - discount
  return { subtotal, discount, total, profit }
}

// ─── Hook ────────────────────────────────────────────────────

export function useTransactionForm(onSaved: () => void) {
  const [open,       setOpen]       = useState(false)
  const [editId,     setEditId]     = useState<string | null>(null)
  const [form,       setForm]       = useState<TransactionFormState>(EMPTY_FORM)
  const [cart,       setCart]       = useState<CartItem[]>([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const products = useLiveQuery(
    () => db.products.where('isArchived').equals(0 as unknown as boolean).toArray(),
    [],
  ) ?? []

  const partners = useLiveQuery(
    () => db.partners.where('isArchived').equals(0 as unknown as boolean).toArray(),
    [],
  ) ?? []

  // Computed
  const { subtotal, discount, total, profit } = calcTotals(cart, form.discountType, form.discountValue)
  const sisa = Math.max(0, total - form.dpAmount)

  const selectedPartner = partners.find(p => p.id === form.partnerId) ?? null
  const partnerHasBank  = !!(selectedPartner?.accountNo)
  const isEditMode      = editId !== null

  // ── Actions ────────────────────────────────────────────────

  const openForm = useCallback((type: TransactionType = 'SALE') => {
    setEditId(null)
    setForm({ ...EMPTY_FORM, type, date: isoToday() })
    setCart([])
    setError(null)
    setOpen(true)
  }, [])

  /** Buka form dalam mode edit — isi dari data transaksi yang ada */
  const openEditForm = useCallback(async (tx: Transaction) => {
    setLoading(true)
    setError(null)
    try {
      const items = await transactionService.getItems(tx.id)
      const partner = await db.partners.get(tx.partnerId)

      const cartItems: CartItem[] = items.map(it => ({
        productId:   it.productId,
        productName: it.productName,
        unit:        it.unit,
        qty:         it.qty,
        buyPrice:    it.buyPrice,
        sellPrice:   it.sellPrice,
        subtotal:    it.subtotal,
        profit:      it.profit,
      }))

      setEditId(tx.id)
      setForm({
        type:          tx.type,
        partnerId:     tx.partnerId,
        partnerName:   partner?.name ?? '',
        date:          tx.date,
        notes:         tx.notes ?? '',
        discountType:  tx.discountType,
        discountValue: tx.discountValue,
        dpAmount:      tx.dpAmount ?? 0,
        payMethod:     tx.payMethod ?? 'CASH',
        dueDate:       tx.dueDate ?? '',
        bankName:      partner?.bankName    ?? '',
        accountNo:     partner?.accountNo   ?? '',
        accountName:   partner?.accountName ?? '',
      })
      setCart(cartItems)
      setOpen(true)
    } catch {
      setError('Gagal memuat data transaksi')
    } finally {
      setLoading(false)
    }
  }, [])

  const closeForm = useCallback(() => {
    setOpen(false)
    setEditId(null)
    setCart([])
    setForm(EMPTY_FORM)
    setError(null)
  }, [])

  const setField = useCallback(<K extends keyof TransactionFormState>(
    key: K, val: TransactionFormState[K],
  ) => {
    setForm(f => ({ ...f, [key]: val }))
  }, [])

  const selectPartner = useCallback((partner: Partner) => {
    setForm(f => ({
      ...f,
      partnerId:   partner.id,
      partnerName: partner.name,
      bankName:    partner.bankName    ?? '',
      accountNo:   partner.accountNo   ?? '',
      accountName: partner.accountName ?? '',
    }))
  }, [])

  const addToCart = useCallback((
    product: Product,
    qty: number,
    overridePrice?: number,
  ) => {
    const sellPrice = overridePrice ?? product.sellPrice
    const buyPrice  = product.buyPrice

    setCart(prev => {
      const idx = prev.findIndex(it => it.productId === product.id)
      if (idx >= 0) {
        const updated = [...prev]
        const cur     = updated[idx]
        updated[idx]  = {
          ...cur,
          qty,
          subtotal: sellPrice * qty,
          profit:   (sellPrice - buyPrice) * qty,
        }
        return updated
      }
      return [...prev, {
        productId:   product.id,
        productName: product.name,
        unit:        product.unit,
        qty,
        buyPrice,
        sellPrice,
        subtotal:    sellPrice * qty,
        profit:      (sellPrice - buyPrice) * qty,
      }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(it => it.productId !== productId))
  }, [])

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return }
    setCart(prev => prev.map(it => {
      if (it.productId !== productId) return it
      return {
        ...it,
        qty,
        subtotal: it.sellPrice * qty,
        profit:   (it.sellPrice - it.buyPrice) * qty,
      }
    }))
  }, [removeFromCart])

  // ── Save ───────────────────────────────────────────────────

  const saveTransaction = useCallback(async () => {
    setLoading(true)
    setError(null)

    const payload = {
      type:          form.type,
      partnerId:     form.partnerId,
      date:          form.date,
      notes:         form.notes || undefined,
      discountType:  form.discountType,
      discountValue: form.discountValue,
      cart,
      payMethod:     form.payMethod,
      dpAmount:      form.dpAmount,
      dueDate:       form.dueDate || undefined,
      bankName:      form.bankName    || undefined,
      accountNo:     form.accountNo   || undefined,
      accountName:   form.accountName || undefined,
    }

    try {
      if (editId) {
        await transactionService.update({ ...payload, id: editId })
      } else {
        await transactionService.create(payload)
      }
      closeForm()
      onSaved()
    } catch (e) {
      if (e instanceof ValidationError || e instanceof StockError) {
        setError(e.message)
      } else {
        setError('Gagal menyimpan nota. Coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }, [form, cart, editId, closeForm, onSaved])

  return {
    open, form, cart, loading, error, isEditMode,
    subtotal, discount, total, profit, sisa,
    selectedPartner, partnerHasBank,
    products: products as Product[],
    partners: partners as Partner[],
    openForm, openEditForm, closeForm, setField, selectPartner,
    addToCart, removeFromCart, updateCartQty,
    saveTransaction,
  }
}
