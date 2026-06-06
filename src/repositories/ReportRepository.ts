// ═══════════════════════════════════════════════════
// repositories/ReportRepository.ts
// Query agregat untuk Dashboard & Laporan
// ═══════════════════════════════════════════════════

import { db } from '@/db/database'
import type { Transaction, TransactionItem } from '@/types/transaction'
import { DatabaseError } from '@/core/errors'

export interface DailyAggregate {
  omset:    number
  profit:   number
  txCount:  number
  purchase: number
}

export interface TxWithItems {
  transactions:  Transaction[]
  items:         TransactionItem[]
}

export const ReportRepository = {
  /** Semua SALE aktif */
  async findSales(): Promise<Transaction[]> {
    try {
      return await db.transactions
        .where('type').equals('SALE')
        .and(tx => !tx.deletedAt && tx.status === 'DONE')
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat data penjualan', e)
    }
  },

  /** Semua PURCHASE aktif */
  async findPurchases(): Promise<Transaction[]> {
    try {
      return await db.transactions
        .where('type').equals('PURCHASE')
        .and(tx => !tx.deletedAt && tx.status === 'DONE')
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat data pembelian', e)
    }
  },

  /** Semua transaction items */
  async findAllItems(): Promise<TransactionItem[]> {
    try {
      return await db.transactionItems.toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat item transaksi', e)
    }
  },

  /** Transaksi dalam rentang tanggal (inklusif) */
  async findByDateRange(
    type: 'SALE' | 'PURCHASE',
    from: string,
    to: string,
  ): Promise<Transaction[]> {
    try {
      return await db.transactions
        .where('type').equals(type)
        .and(tx => !tx.deletedAt && tx.status === 'DONE' && tx.date >= from && tx.date <= to)
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat laporan', e)
    }
  },
}
