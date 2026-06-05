import { db } from '@/db/database'
import { NOTE_PREFIX, BLN } from '@/config'

/**
 * Generate kode invoice unik: INV-YYYYMMDD-NNN
 * NNN = urutan per hari, auto-increment
 */
export async function generateInvoiceCode(date: string): Promise<string> {
  const datePart = date.replace(/-/g, '')           // '20260605'
  const prefix   = `${NOTE_PREFIX}-${datePart}-`    // 'INV-20260605-'

  const existing = await db.transactions
    .where('code').startsWith(prefix)
    .count()

  const seq = String(existing + 1).padStart(3, '0') // '001', '002'
  return `${prefix}${seq}`
}

/** Format tanggal untuk tampilan: '05 Jun 2026' */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d} ${BLN[parseInt(m, 10) - 1]} ${y}`
}
