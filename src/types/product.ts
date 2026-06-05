import { SyncStatus } from './common'

export interface Product {
  id:          string    // crypto.randomUUID()
  name:        string
  category?:   string
  unit:        string
  buyPrice:    number
  sellPrice:   number
  stock:       number
  isArchived:  boolean
  syncStatus:  SyncStatus
  createdAt:   string   // ISO 8601
  updatedAt:   string   // ISO 8601
  deletedAt?:  string   // ISO 8601 — soft delete
}
