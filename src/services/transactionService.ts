// ═══════════════════════════════════════════════════
// services/transactionService.ts
// Business logic transaksi — stok, validasi, kode nota
// ═══════════════════════════════════════════════════

import { db } from '@/db/database'
import { TransactionRepository } from '@/repositories/TransactionRepository'
import { ProductRepository } from '@/repositories/ProductRepository'
import { PartnerRepository } from '@/repositories/PartnerRepository'
import { activityLogService } from './activityLogService'
import { enqueue }            from './syncService'
import { ValidationError, StockError } from '@/core/errors'
import type { Transaction, TransactionItem, TransactionType, PayMethod } from '@/types/transaction'
import { NOTE_PREFIX } from '@/config'

// ─── Validasi konstanta ──────────────────────────────────────
// Lihat CLAUDE.md § Validation Rules
export const QTY_MAX        = 999_999
export const PRICE_MAX      = 999_999_999_999
export const PRICE_HIGH_QTY_MAX = 9_999   // berlaku saat harga ≥ PRICE_HIGH threshold
export const PRICE_HIGH_THRESHOLD = 100_000_000  // Rp 100 jt → batasi qty

// ─── Tipe input form ─────────────────────────────────────────

export interface CartItemInput {
  productId:   string
  productName: string
  unit:        string
  qty:         number
  buyPrice:    number
  sellPrice:   number
}

export interface CreateTransactionInput {
  type:          TransactionType
  partnerId:     string
  date:          string
  notes?:        string
  discountType:  'nominal' | 'percent'
  discountValue: number
  cart:          CartItemInput[]
  payMethod:     PayMethod
  dpAmount:      number
  dueDate?:      string
  bankName?:     string
  accountNo?:    string
  accountName?:  string
}

export type UpdateTransactionInput = CreateTransactionInput & { id: string }

// ─── Helpers ─────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString()
}

export function hitungDiskon(
  subtotal: number,
  type: 'nominal' | 'percent',
  value: number,
): number {
  if (type === 'percent') return Math.round(subtotal * value / 100)
  return value
}

/** Generate kode nota: INV-YYYYMMDD-NNN */
async function generateCode(date: string): Promise<string> {
  const datePart = date.replace(/-/g, '')
  const prefix   = `${NOTE_PREFIX}-${datePart}-`

  const existing = await db.transactions
    .filter(tx => tx.code.startsWith(prefix))
    .count()

  const seq = String(existing + 1).padStart(3, '0')
  return `${prefix}${seq}`
}

// ─── Validasi ────────────────────────────────────────────────

async function validateStock(
  cart: CartItemInput[],
  type: TransactionType,
  excludeTransactionId?: string,
): Promise<void> {
  if (type !== 'SALE') return

  for (const item of cart) {
    const product = await ProductRepository.findById(item.productId)
    if (!product) {
      throw new ValidationError(`Barang "${item.productName}" tidak ditemukan`)
    }

    let available = product.stock
    if (excludeTransactionId) {
      const oldItems = await TransactionRepository.findItemsByTransactionId(excludeTransactionId)
      const oldItem  = oldItems.find(i => i.productId === item.productId)
      if (oldItem) available += oldItem.qty
    }

    if (available < item.qty) {
      throw new StockError(
        `Stok ${product.name} tidak mencukupi. Stok tersedia: ${available}`,
      )
    }
  }
}

function buildItemsFromCart(txId: string, cart: CartItemInput[]): TransactionItem[] {
  return cart.map(it => ({
    id:            crypto.randomUUID(),
    transactionId: txId,
    productId:     it.productId,
    productName:   it.productName,
    unit:          it.unit,
    qty:           it.qty,
    buyPrice:      it.buyPrice,
    sellPrice:     it.sellPrice,
    subtotal:      it.sellPrice * it.qty,
    profit:        (it.sellPrice - it.buyPrice) * it.qty,
  }))
}

// ─── Service ─────────────────────────────────────────────────

export const transactionService = {

  async create(input: CreateTransactionInput): Promise<Transaction> {
    if (!input.partnerId)   throw new ValidationError('Pilih mitra terlebih dahulu')
    if (!input.cart.length) throw new ValidationError('Tambahkan minimal 1 item')
    if (!input.date)        throw new ValidationError('Tanggal wajib diisi')

    await validateStock(input.cart, input.type)

    const ts   = now()
    const code = await generateCode(input.date)
    const txId = crypto.randomUUID()

    const subtotal = input.cart.reduce((s, it) => s + it.sellPrice * it.qty, 0)
    const discount = hitungDiskon(subtotal, input.discountType, input.discountValue)
    const total    = Math.max(0, subtotal - discount)

    const transaction: Transaction = {
      id:            txId,
      code,
      type:          input.type,
      status:        'DONE',
      partnerId:     input.partnerId,
      date:          input.date,
      notes:         input.notes,
      discountType:  input.discountType,
      discountValue: input.discountValue,
      discount,
      subtotal,
      total,
      payMethod:     input.payMethod,
      dpAmount:      input.dpAmount ?? 0,
      dueDate:       input.dueDate,
      syncStatus:    'pending',
      createdAt:     ts,
      updatedAt:     ts,
    }

    const items = buildItemsFromCart(txId, input.cart)
    await TransactionRepository.save({ transaction, items })

    if (input.accountNo) {
      const partner = await PartnerRepository.findById(input.partnerId)
      if (partner && !partner.accountNo) {
        await PartnerRepository.update(input.partnerId, {
          bankName:    input.bankName    || undefined,
          accountNo:   input.accountNo,
          accountName: input.accountName || undefined,
          updatedAt:   ts,
          syncStatus:  'pending',
        })
      }
    }

    await activityLogService.log('Transaction', txId, 'CREATE', code)
    await enqueue('transactions', txId, 'upsert', transaction)
    for (const item of items) {
      await enqueue('transactionItems', item.id, 'upsert', item)
    }
    return transaction
  },

  /** Edit transaksi: rollback stok lama → terapkan stok baru */
  async update(input: UpdateTransactionInput): Promise<Transaction> {
    if (!input.partnerId)   throw new ValidationError('Pilih mitra terlebih dahulu')
    if (!input.cart.length) throw new ValidationError('Tambahkan minimal 1 item')
    if (!input.date)        throw new ValidationError('Tanggal wajib diisi')

    const existing = await TransactionRepository.findById(input.id)
    if (!existing) throw new ValidationError('Transaksi tidak ditemukan')

    await validateStock(input.cart, input.type, input.id)

    const oldItems = await TransactionRepository.findItemsByTransactionId(input.id)
    const ts       = now()

    const subtotal = input.cart.reduce((s, it) => s + it.sellPrice * it.qty, 0)
    const discount = hitungDiskon(subtotal, input.discountType, input.discountValue)
    const total    = Math.max(0, subtotal - discount)

    const updated: Transaction = {
      ...existing,
      partnerId:     input.partnerId,
      date:          input.date,
      notes:         input.notes,
      discountType:  input.discountType,
      discountValue: input.discountValue,
      discount,
      subtotal,
      total,
      payMethod:     input.payMethod,
      dpAmount:      input.dpAmount ?? 0,
      dueDate:       input.dueDate,
      syncStatus:    'pending',
      updatedAt:     ts,
    }

    const newItems = buildItemsFromCart(input.id, input.cart)
    await TransactionRepository.update(oldItems, updated, newItems)
    await activityLogService.log('Transaction', input.id, 'UPDATE', existing.code)
    await enqueue('transactions', input.id, 'upsert', updated)
    for (const item of newItems) {
      await enqueue('transactionItems', item.id, 'upsert', item)
    }
    return updated
  },

  async delete(transactionId: string): Promise<void> {
    await TransactionRepository.softDelete(transactionId)
    await activityLogService.log('Transaction', transactionId, 'DELETE')
    await enqueue('transactions', transactionId, 'upsert', { id: transactionId, deletedAt: new Date().toISOString() })
  },

  async getById(id: string): Promise<Transaction | undefined> {
    return TransactionRepository.findById(id)
  },

  async getItems(transactionId: string): Promise<TransactionItem[]> {
    return TransactionRepository.findItemsByTransactionId(transactionId)
  },

  async getAll(): Promise<Transaction[]> {
    return TransactionRepository.findActive()
  },
}
