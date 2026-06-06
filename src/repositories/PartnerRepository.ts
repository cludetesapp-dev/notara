import { db } from '@/db/database'
import type { Partner } from '@/types/partner'
import { DatabaseError } from '@/core/errors'

export const PartnerRepository = {
  async findActive(): Promise<Partner[]> {
    try {
      return await db.partners
        .filter(p => !p.isArchived && !p.deletedAt)
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat daftar mitra', e)
    }
  },

  async findByType(type: Partner['type']): Promise<Partner[]> {
    try {
      return await db.partners
        .where('type')
        .equals(type)
        .and(p => !p.isArchived && !p.deletedAt)
        .toArray()
    } catch (e) {
      throw new DatabaseError('Gagal memuat daftar mitra', e)
    }
  },

  async findById(id: string): Promise<Partner | undefined> {
    try {
      return await db.partners.get(id)
    } catch (e) {
      throw new DatabaseError('Gagal memuat mitra', e)
    }
  },

  async create(partner: Partner): Promise<void> {
    try {
      await db.partners.add(partner)
    } catch (e) {
      throw new DatabaseError('Gagal menyimpan mitra', e)
    }
  },

  async update(id: string, changes: Partial<Partner>): Promise<void> {
    try {
      await db.partners.update(id, changes)
    } catch (e) {
      throw new DatabaseError('Gagal memperbarui mitra', e)
    }
  },

  async hasTransactions(partnerId: string): Promise<boolean> {
    try {
      const count = await db.transactions
        .where('partnerId')
        .equals(partnerId)
        .count()

      return count > 0
    } catch (e) {
      throw new DatabaseError('Gagal memeriksa riwayat transaksi', e)
    }
  },

  async hardDelete(id: string): Promise<void> {
    try {
      await db.partners.delete(id)
    } catch (e) {
      throw new DatabaseError('Gagal menghapus mitra', e)
    }
  },
}
