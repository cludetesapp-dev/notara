// ═══════════════════════════════════════════════════
// state/partnerStore.ts
// ═══════════════════════════════════════════════════

import { create } from 'zustand'
import { partnerService } from '@/services/partnerService'
import type { Partner } from '@/types/partner'

interface PartnerState {
  partners: Partner[]
  loading:  boolean
  error:    string | null

  load:    () => Promise<void>
  create:  (data: Omit<Partner, 'id' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'isArchived'>) => Promise<void>
  update:  (id: string, data: Partial<Partner>) => Promise<void>
  delete:  (id: string) => Promise<'archived' | 'deleted'>
  archive: (id: string) => Promise<void>
  restore: (id: string) => Promise<void>
}

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partners: [],
  loading:  false,
  error:    null,

  async load() {
    set({ loading: true, error: null })
    try {
      const partners = await partnerService.getAll()
      set({ partners, loading: false })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Gagal memuat mitra'
      set({ error: msg, loading: false })
    }
  },

  async create(data) {
    await partnerService.create(data)
    await get().load()
  },

  async update(id, data) {
    await partnerService.update(id, data)
    await get().load()
  },

  async delete(id) {
    const result = await partnerService.delete(id)
    await get().load()
    return result
  },

  async archive(id) {
    await partnerService.archive(id)
    await get().load()
  },

  async restore(id) {
    await partnerService.restore(id)
    await get().load()
  },
}))
