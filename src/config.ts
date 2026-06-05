// ═══════════════════════════════════════════════
// config.ts — Konstanta aplikasi NOTARA
// ═══════════════════════════════════════════════

// Versi selalu baca dari version.ts — jangan hardcode di sini
export { APP_VERSION } from './core/version'

export const APP_NAME    = 'NOTARA'
export const APP_TAGLINE = 'Nota & Arsip Digital'

// Naik HANYA jika schema Dexie berubah
export const DB_SCHEMA_VERSION = 1

// Prefix nomor nota/invoice
// Ubah dari NOT → INV agar lebih universal & profesional
export const NOTE_PREFIX = 'INV'

// Supabase — diisi saat Task Auth
export const SUPA_URL = import.meta.env.VITE_SUPA_URL ?? ''
export const SUPA_KEY = import.meta.env.VITE_SUPA_KEY ?? ''

// Months & days (Indonesia)
export const BLN  = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'] as const
export const BLNP = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'] as const
export const HR   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'] as const
