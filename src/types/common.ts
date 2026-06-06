// Tipe-tipe umum yang digunakan lintas modul.

export type SyncStatus = 'pending' | 'synced' | 'failed'

export interface Setting {
  key:   string
  value: string
}

export interface ActivityLog {
  id:        string   // crypto.randomUUID()
  entity:    string   // 'Product' | 'Partner' | 'Transaction'
  entityId:  string
  action:    'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'ARCHIVE'
  detail?:   string
  createdAt: string   // ISO 8601
}

export interface SyncQueueItem {
  id:        string   // crypto.randomUUID()
  table:     string   // nama tabel Dexie / Supabase
  recordId:  string
  action:    'upsert' | 'delete'
  payload:   string   // JSON string dari record
  createdAt: string   // ISO 8601
  attempts:  number   // jumlah percobaan upload, mulai dari 0
}
