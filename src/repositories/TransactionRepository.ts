// ═══════════════════════════════════════════════════
// repositories/TransactionRepository.ts
// ═══════════════════════════════════════════════════

import { db } from '@/db/database'
import type { Transaction, TransactionItem } from '@/types/transaction'
import { DatabaseError } from '@/core/errors'
import { ProductRepository } from './ProductRepository'

export interface SaveTransactionPayload {
  transaction:  Transaction
  items:        TransactionItem[]
}

export const TransactionRepository = {
  async findById(id: string): Promise<Transaction | undefined> {
    try {
      return await db.transactions.get(id)
    } catch (e) {
      throw new DatabaseError('Gagal memuat transaksi', e)
    }
  },

  async findItemsByTransactionId(transactionId: string): Promise<TransactionItem[]> {
    try {
      return await db.transactionItems
        .where('transactionId').equals(transactionId)
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat item transaksi', e)
    }
  },

  async findActive(): Promise<Transaction[]> {
    try {
      return await db.transactions
        .filter(tx => !tx.deletedAt)
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat transaksi', e)
    }
  },

  /**
   * Simpan transaksi baru + terapkan stok dalam satu db.transaction.
   * SALE  → stok BERKURANG
   * PURCHASE → stok BERTAMBAH
   */
  async save(payload: SaveTransactionPayload): Promise<void> {
    const { transaction, items } = payload
    const now = transaction.createdAt

    try {
      await db.transaction(
        'rw',
        [db.transactions, db.transactionItems, db.products],
        async () => {
          // Simpan transaksi & items
          await db.transactions.add(transaction)
          await db.transactionItems.bulkAdd(items)

          // Terapkan stok
          const delta = transaction.type === 'SALE' ? -1 : 1
          for (const item of items) {
            await ProductRepository.adjustStock(item.productId, delta * item.qty, now)
          }
        },
      )
    } catch (e) {
      if (e instanceof DatabaseError) throw e
      throw new DatabaseError('Gagal menyimpan transaksi', e)
    }
  },

  /**
   * Edit transaksi:
   * 1. Rollback stok dari items LAMA
   * 2. Hapus items lama
   * 3. Simpan transaksi + items BARU
   * 4. Terapkan stok BARU
   */
  async update(
    oldItems: TransactionItem[],
    newTransaction: Transaction,
    newItems: TransactionItem[],
  ): Promise<void> {
    const now = newTransaction.updatedAt

    try {
      await db.transaction(
        'rw',
        [db.transactions, db.transactionItems, db.products],
        async () => {
          // 1. Rollback stok lama
          const rollbackDelta = newTransaction.type === 'SALE' ? 1 : -1
          for (const item of oldItems) {
            await ProductRepository.adjustStock(item.productId, rollbackDelta * item.qty, now)
          }

          // 2. Hapus items lama
          const oldItemIds = oldItems.map(it => it.id)
          await db.transactionItems.bulkDelete(oldItemIds)

          // 3. Simpan transaksi yang diupdate
          await db.transactions.put(newTransaction)

          // 4. Simpan items baru + terapkan stok baru
          await db.transactionItems.bulkAdd(newItems)
          const newDelta = newTransaction.type === 'SALE' ? -1 : 1
          for (const item of newItems) {
            await ProductRepository.adjustStock(item.productId, newDelta * item.qty, now)
          }
        },
      )
    } catch (e) {
      if (e instanceof DatabaseError) throw e
      throw new DatabaseError('Gagal memperbarui transaksi', e)
    }
  },

  /**
   * Soft delete transaksi + rollback stok.
   */
  async softDelete(transactionId: string): Promise<void> {
    const now = new Date().toISOString()

    try {
      await db.transaction(
        'rw',
        [db.transactions, db.transactionItems, db.products],
        async () => {
          const tx = await db.transactions.get(transactionId)
          if (!tx) throw new DatabaseError('Transaksi tidak ditemukan')

          const items = await db.transactionItems
            .where('transactionId').equals(transactionId)
            .toArray()

          // Rollback stok
          const delta = tx.type === 'SALE' ? 1 : -1
          for (const item of items) {
            await ProductRepository.adjustStock(item.productId, delta * item.qty, now)
          }

          // Soft delete
          await db.transactions.update(transactionId, {
            deletedAt:  now,
            updatedAt:  now,
            syncStatus: 'pending',
          })
        },
      )
    } catch (e) {
      if (e instanceof DatabaseError) throw e
      throw new DatabaseError('Gagal menghapus transaksi', e)
    }
  },

  async countByDatePrefix(datePrefix: string): Promise<number> {
    try {
      const prefix = `${datePrefix}`
      return await db.transactions
        .filter(tx => tx.code.includes(prefix))
        .count()
    } catch (e) {
      throw new DatabaseError('Gagal menghitung nomor nota', e)
    }
  },
}
