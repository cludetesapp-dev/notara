import { SyncStatus } from './common'

export type PartnerType = 'CUSTOMER' | 'SUPPLIER' | 'BOTH'

export interface Partner {
  id:           string
  name:         string
  type:         PartnerType
  phone?:       string
  address?:     string
  // Rekening bank — untuk nota & transfer
  bankName?:    string   // 'BRI', 'BCA', 'Mandiri', dll
  accountNo?:   string   // nomor rekening
  accountName?: string   // nama pemilik rekening
  isArchived:   boolean
  syncStatus:   SyncStatus
  createdAt:    string
  updatedAt:    string
  deletedAt?:   string
}
