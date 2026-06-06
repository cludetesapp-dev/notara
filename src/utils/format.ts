const CURRENCY_SYMBOL = 'Rp'

/** formatRupiah(50000) → 'Rp 50.000' */
export function formatRupiah(amount: number): string {
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString('id-ID')}`
}

/** formatRupiahCompact(1500000) → 'Rp 1,5jt' */
export function formatRupiahCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `${CURRENCY_SYMBOL} ${(amount / 1_000_000_000).toFixed(1)}M`
  if (amount >= 1_000_000)     return `${CURRENCY_SYMBOL} ${(amount / 1_000_000).toFixed(1)}jt`
  if (amount >= 1_000)         return `${CURRENCY_SYMBOL} ${(amount / 1_000).toFixed(0)}rb`
  return formatRupiah(amount)
}

/** formatDate('2026-06-04') → '04 Jun 2026' */
export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** formatTime('2026-06-04T14:30:00Z') → '14:30' */
export function formatTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

/** formatDateTime → '04 Jun 2026, 14:30' */
export function formatDateTime(dateInput: string | Date): string {
  return `${formatDate(dateInput)}, ${formatTime(dateInput)}`
}

/** isoToday → '2026-06-04' */
export function isoToday(): string {
  return new Date().toISOString().slice(0, 10)
}

/** startOfMonth → '2026-06-01' */
export function startOfMonth(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
}
