// ═══════════════════════════════════════════════════
// state/productStore.ts
// Zustand store — cache produk di memori
// ═══════════════════════════════════════════════════

import { create } from 'zustand'
import { productService } from '@/services/productService'
import type { Product } from '@/types/product'

interface ProductState {
  products:  Product[]
  loading:   boolean
  error:     string | null

  load:    () => Promise<void>
  create:  (data: Omit<Product, 'id' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'isArchived'>) => Promise<void>
  update:  (id: string, data: Partial<Product>) => Promise<void>
  delete:  (id: string) => Promise<'archived' | 'deleted'>
  archive: (id: string) => Promise<void>
  restore: (id: string) => Promise<void>
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading:  false,
  error:    null,

  async load() {
    set({ loading: true, error: null })
    try {
      const products = await productService.getAll()
      set({ products, loading: false })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal memuat barang'
      set({ error: msg, loading: false })
    }
  },

  async create(data) {
    await productService.create(data)
    await get().load()
  },

  async update(id, data) {
    await productService.update(id, data)
    await get().load()
  },

  async delete(id) {
    const result = await productService.delete(id)
    await get().load()
    return result
  },

  async archive(id) {
    await productService.archive(id)
    await get().load()
  },

  async restore(id) {
    await productService.restore(id)
    await get().load()
  },
}))
