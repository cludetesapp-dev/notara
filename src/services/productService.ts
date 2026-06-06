// ═══════════════════════════════════════════════════
// services/productService.ts
// Business logic untuk manajemen produk
// ═══════════════════════════════════════════════════

import { ProductRepository }  from '@/repositories/ProductRepository'
import { activityLogService } from './activityLogService'
import { enqueue }            from './syncService'
import { ValidationError }    from '@/core/errors'
import type { Product }       from '@/types/product'

function now(): string {
  return new Date().toISOString()
}

function validate(data: Partial<Product>): void {
  if (!data.name || data.name.trim().length < 2)
    throw new ValidationError('Nama barang minimal 2 karakter')
  if (data.name.trim().length > 100)
    throw new ValidationError('Nama barang maksimal 100 karakter')
  if (!data.unit || data.unit.trim().length === 0)
    throw new ValidationError('Satuan wajib diisi')
  if (data.buyPrice !== undefined && data.buyPrice < 0)
    throw new ValidationError('Harga beli tidak boleh minus')
  if (data.sellPrice !== undefined && data.sellPrice < 0)
    throw new ValidationError('Harga jual tidak boleh minus')
  if (data.stock !== undefined && data.stock < 0)
    throw new ValidationError('Stok tidak boleh minus')
}

export const productService = {
  async getAll(): Promise<Product[]> {
    return ProductRepository.findActive()
  },

  async getAllIncludingArchived(): Promise<Product[]> {
    return ProductRepository.findAll()
  },

  async create(data: Omit<Product, 'id' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'isArchived'>): Promise<Product> {
    validate(data)
    const ts = now()
    const product: Product = {
      ...data,
      id:         crypto.randomUUID(),
      isArchived: false,
      syncStatus: 'pending',
      createdAt:  ts,
      updatedAt:  ts,
    }
    await ProductRepository.create(product)
    await activityLogService.log('Product', product.id, 'CREATE', product.name)
    await enqueue('products', product.id, 'upsert', product)
    return product
  },

  async update(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> {
    validate(data)
    const changes: Partial<Product> = { ...data, updatedAt: now(), syncStatus: 'pending' }
    await ProductRepository.update(id, changes)
    await activityLogService.log('Product', id, 'UPDATE')
    const updated = await ProductRepository.findById(id)
    if (updated) await enqueue('products', id, 'upsert', updated)
  },

  async archive(id: string): Promise<void> {
    await ProductRepository.update(id, { isArchived: true, updatedAt: now(), syncStatus: 'pending' })
    await activityLogService.log('Product', id, 'ARCHIVE')
    const updated = await ProductRepository.findById(id)
    if (updated) await enqueue('products', id, 'upsert', updated)
  },

  async restore(id: string): Promise<void> {
    await ProductRepository.update(id, { isArchived: false, updatedAt: now(), syncStatus: 'pending' })
    await activityLogService.log('Product', id, 'RESTORE')
    const updated = await ProductRepository.findById(id)
    if (updated) await enqueue('products', id, 'upsert', updated)
  },

  async delete(id: string): Promise<'archived' | 'deleted'> {
    const hasTx = await ProductRepository.hasTransactions(id)
    if (hasTx) {
      await this.archive(id)
      return 'archived'
    }
    await ProductRepository.hardDelete(id)
    await activityLogService.log('Product', id, 'DELETE')
    await enqueue('products', id, 'delete', { id })
    return 'deleted'
  },
}
