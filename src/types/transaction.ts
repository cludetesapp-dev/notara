import { SyncStatus } from './common'

export type TransactionType   = 'SALE' | 'PURCHASE'
export type TransactionStatus = 'DONE' | 'CANCELLED'
export type PayMethod         = 'CASH' | 'TRANSFER' | 'DP'

export interface Transaction {
  id:            string           // crypto.randomUUID()
  code:          string           // INV-YYYYMMDD-NNN
  type:          TransactionType
  status:        TransactionStatus
  partnerId:     string
  date:          string           // YYYY-MM-DD
  notes?:        string
  discountType:  'nominal' | 'percent'
  discountValue: number
  discount:      number           // hasil hitung diskon dalam Rp
  subtotal:      number           // total sebelum diskon
  total:         number           // subtotal - discount
  payMethod:     PayMethod        // CASH | TRANSFER | DP
  dpAmount:      number           // 0 jika bukan DP
  dueDate?:      string           // YYYY-MM-DD — tanggal rencana pelunasan
  syncStatus:    SyncStatus
  createdAt:     string           // ISO 8601
  updatedAt:     string           // ISO 8601
  deletedAt?:    string           // ISO 8601 — soft delete
}

export interface TransactionItem {
  id:            string   // crypto.randomUUID()
  transactionId: string
  productId:     string
  productName:   string   // SNAPSHOT nama produk saat transaksi
  unit:          string   // SNAPSHOT satuan produk saat transaksi
  qty:           number
  buyPrice:      number   // SNAPSHOT harga beli saat transaksi
  sellPrice:     number   // SNAPSHOT harga jual (bisa di-override)
  subtotal:      number   // sellPrice × qty
  profit:        number   // (sellPrice - buyPrice) × qty
}
