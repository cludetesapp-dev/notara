import Dexie, { type Table } from 'dexie'
import type { Product }                          from '../types/product'
import type { Partner }                          from '../types/partner'
import type { Transaction, TransactionItem }     from '../types/transaction'
import type { Setting, ActivityLog, SyncQueueItem } from '../types/common'

const DB_SCHEMA_VERSION = 1

export class NotaraDB extends Dexie {
  products!:         Table<Product>
  partners!:         Table<Partner>
  transactions!:     Table<Transaction>
  transactionItems!: Table<TransactionItem>
  settings!:         Table<Setting>
  activityLogs!:     Table<ActivityLog>
  syncQueue!:        Table<SyncQueueItem>

  constructor() {
    super('NotaraDB')

    this.version(DB_SCHEMA_VERSION).stores({
      products:         '&id, name, category, isArchived, syncStatus',
      partners:         '&id, name, type, isArchived, syncStatus',
      transactions:     '&id, type, partnerId, date, status, deletedAt, syncStatus',
      transactionItems: '&id, transactionId, productId',
      settings:         '&key',
      activityLogs:     '&id, entity, action, createdAt',
      syncQueue:        '&id, table, action, createdAt',
    })
  }
}

// Singleton — import `db` di seluruh aplikasi
export const db = new NotaraDB()
