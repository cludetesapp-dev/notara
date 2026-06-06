import { db } from '@/db/database'
import type { Product } from '@/types/product'
import { DatabaseError } from '@/core/errors'

export const ProductRepository = {
  async findActive(): Promise<Product[]> {
    try {
      return await db.products
        .filter(p => !p.isArchived && !p.deletedAt)
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat daftar barang', e)
    }
  },

  async findAll(): Promise<Product[]> {
    try {
      return await db.products
        .filter(p => !p.deletedAt)
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat daftar barang', e)
    }
  },

  async findById(id: string): Promise<Product | undefined> {
    try {
      return await db.products.get(id)
    } catch (e) {
      throw new DatabaseError('Gagal memuat barang', e)
    }
  },

  async create(product: Product): Promise<void> {
    try {
      await db.products.add(product)
    } catch (e) {
      throw new DatabaseError('Gagal menyimpan barang', e)
    }
  },

  async update(id: string, changes: Partial<Product>): Promise<void> {
    try {
      await db.products.update(id, changes)
    } catch (e) {
      throw new DatabaseError('Gagal memperbarui barang', e)
    }
  },

  async hasTransactions(productId: string): Promise<boolean> {
    try {
      const count = await db.transactionItems
        .where('productId').equals(productId)
        .count()
      return count > 0
    } catch (e) {
      throw new DatabaseError('Gagal memeriksa riwayat transaksi', e)
    }
  },

  async hardDelete(id: string): Promise<void> {
    try {
      await db.products.delete(id)
    } catch (e) {
      throw new DatabaseError('Gagal menghapus barang', e)
    }
  },

  async adjustStock(id: string, delta: number, now: string): Promise<void> {
    const product = await db.products.get(id)
    if (!product) throw new DatabaseError(`Barang tidak ditemukan: ${id}`)

    await db.products.update(id, {
      stock: product.stock + delta,
      updatedAt: now,
      syncStatus: 'pending',
    })
  },
}
