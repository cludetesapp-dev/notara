// ═══════════════════════════════════════════════════
// services/partnerService.ts
// Business logic untuk manajemen mitra (Customer/Supplier)
// ═══════════════════════════════════════════════════

import { PartnerRepository }  from '@/repositories/PartnerRepository'
import { activityLogService } from './activityLogService'
import { enqueue }            from './syncService'
import { ValidationError }    from '@/core/errors'
import type { Partner }       from '@/types/partner'

function now(): string { return new Date().toISOString() }

function validate(data: Partial<Partner>): void {
  if (!data.name || data.name.trim().length < 2)
    throw new ValidationError('Nama mitra minimal 2 karakter')
  if (data.name.trim().length > 100)
    throw new ValidationError('Nama mitra maksimal 100 karakter')
  if (!data.type)
    throw new ValidationError('Tipe mitra wajib dipilih')
}

export const partnerService = {
  async getAll(): Promise<Partner[]> {
    return PartnerRepository.findActive()
  },

  async getByType(type: Partner['type']): Promise<Partner[]> {
    return PartnerRepository.findByType(type)
  },

  async create(
    data: Omit<Partner, 'id' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'isArchived'>,
  ): Promise<Partner> {
    validate(data)
    const ts = now()
    const partner: Partner = {
      ...data,
      id:         crypto.randomUUID(),
      isArchived: false,
      syncStatus: 'pending',
      createdAt:  ts,
      updatedAt:  ts,
    }
    await PartnerRepository.create(partner)
    await activityLogService.log('Partner', partner.id, 'CREATE', partner.name)
    await enqueue('partners', partner.id, 'upsert', partner)
    return partner
  },

  async update(id: string, data: Partial<Omit<Partner, 'id' | 'createdAt'>>): Promise<void> {
    validate(data)
    await PartnerRepository.update(id, { ...data, updatedAt: now(), syncStatus: 'pending' })
    await activityLogService.log('Partner', id, 'UPDATE')
    const updated = await PartnerRepository.findById(id)
    if (updated) await enqueue('partners', id, 'upsert', updated)
  },

  async updateBank(
    id: string,
    bank: Pick<Partner, 'bankName' | 'accountNo' | 'accountName'>,
  ): Promise<void> {
    await PartnerRepository.update(id, { ...bank, updatedAt: now(), syncStatus: 'pending' })
    const updated = await PartnerRepository.findById(id)
    if (updated) await enqueue('partners', id, 'upsert', updated)
  },

  async archive(id: string): Promise<void> {
    await PartnerRepository.update(id, { isArchived: true, updatedAt: now(), syncStatus: 'pending' })
    await activityLogService.log('Partner', id, 'ARCHIVE')
    const updated = await PartnerRepository.findById(id)
    if (updated) await enqueue('partners', id, 'upsert', updated)
  },

  async restore(id: string): Promise<void> {
    await PartnerRepository.update(id, { isArchived: false, updatedAt: now(), syncStatus: 'pending' })
    await activityLogService.log('Partner', id, 'RESTORE')
    const updated = await PartnerRepository.findById(id)
    if (updated) await enqueue('partners', id, 'upsert', updated)
  },

  async delete(id: string): Promise<'archived' | 'deleted'> {
    const hasTx = await PartnerRepository.hasTransactions(id)
    if (hasTx) {
      await this.archive(id)
      return 'archived'
    }
    await PartnerRepository.hardDelete(id)
    await activityLogService.log('Partner', id, 'DELETE')
    await enqueue('partners', id, 'delete', { id })
    return 'deleted'
  },
}
