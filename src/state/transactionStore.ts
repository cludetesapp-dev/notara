// ═══════════════════════════════════════════════════
// state/transactionStore.ts
// ═══════════════════════════════════════════════════

import { create } from 'zustand'
import {
  transactionService,
  type CreateTransactionInput,
  type UpdateTransactionInput,
} from '@/services/transactionService'
import type { Transaction } from '@/types/transaction'

interface TransactionState {
  transactions: Transaction[]
  loading:      boolean
  error:        string | null

  load:   () => Promise<void>
  create: (input: CreateTransactionInput) => Promise<Transaction>
  update: (input: UpdateTransactionInput) => Promise<Transaction>
  remove: (id: string) => Promise<void>
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading:      false,
  error:        null,

  async load() {
    set({ loading: true, error: null })
    try {
      const transactions = await transactionService.getAll()
      transactions.sort((a, b) => {
        // Urutkan: tanggal terbaru dulu, lalu createdAt
        const d = b.date.localeCompare(a.date)
        return d !== 0 ? d : b.createdAt.localeCompare(a.createdAt)
      })
      set({ transactions, loading: false })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal memuat transaksi'
      set({ error: msg, loading: false })
    }
  },

  async create(input) {
    const tx = await transactionService.create(input)
    await get().load()
    return tx
  },

  async update(input) {
    const tx = await transactionService.update(input)
    await get().load()
    return tx
  },

  async remove(id) {
    await transactionService.delete(id)
    await get().load()
  },
}))
