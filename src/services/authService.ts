// ═══════════════════════════════════════════════════
// services/authService.ts — Auth flow NOTARA (KRITIS)
// Login · Logout · Session Restore · Forgot Password
// ═══════════════════════════════════════════════════

import { AuthError } from '@/core/errors'
import type { AuthUser } from '@/types/auth'

// ── Dev mode: bypass auth jika env kosong ──────────
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const SUPABASE_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const IS_DEV_MODE = !SUPABASE_URL || !SUPABASE_KEY

// Demo user untuk dev mode
const DEV_USER: AuthUser = {
  id:    'dev-user-001',
  email: 'demo@notara.app',
  name:  'Demo User',
}

// ── Supabase client (lazy — hanya dibuat jika bukan dev mode) ──
let _supabase: SupabaseClient | null = null

interface SupabaseClient {
  auth: {
    signInWithPassword: (opts: { email: string; password: string }) => Promise<SupabaseAuthResponse>
    signOut: () => Promise<{ error: SupabaseError | null }>
    getSession: () => Promise<{ data: { session: SupabaseSession | null }; error: SupabaseError | null }>
    resetPasswordForEmail: (email: string, opts: { redirectTo: string }) => Promise<{ error: SupabaseError | null }>
    updateUser: (attrs: { password: string }) => Promise<{ error: SupabaseError | null }>
    onAuthStateChange: (cb: (event: string, session: SupabaseSession | null) => void) => { data: { subscription: { unsubscribe: () => void } } }
  }
}

interface SupabaseSession {
  user: {
    id:             string
    email?:         string
    user_metadata?: { full_name?: string; name?: string; avatar_url?: string }
  }
}

interface SupabaseError {
  message: string
}

interface SupabaseAuthResponse {
  data:  { session: SupabaseSession | null }
  error: SupabaseError | null
}

async function getSupabase(): Promise<SupabaseClient> {
  if (_supabase) return _supabase

  // Dynamic import — hanya dijalankan saat Supabase tersedia
  const { createClient } = await import('@supabase/supabase-js')
  _supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!) as unknown as SupabaseClient
  return _supabase
}

// ── Map Supabase session → AuthUser ───────────────
function sessionToUser(session: SupabaseSession): AuthUser {
  const meta = session.user.user_metadata ?? {}
  return {
    id:        session.user.id,
    email:     session.user.email ?? '',
    name:      meta.full_name ?? meta.name,
    avatarUrl: meta.avatar_url,
  }
}

// ── Terjemahkan pesan error Supabase → Bahasa Indonesia ──
function translateError(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid email or password'))
    return 'Email atau password salah. Periksa kembali.'
  if (m.includes('email not confirmed'))
    return 'Email belum dikonfirmasi. Cek kotak masuk email kamu.'
  if (m.includes('too many requests'))
    return 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.'
  if (m.includes('user not found'))
    return 'Akun dengan email ini tidak ditemukan.'
  if (m.includes('network') || m.includes('fetch'))
    return 'Tidak ada koneksi internet. Periksa jaringan kamu.'
  if (m.includes('password should be at least'))
    return 'Password baru minimal 6 karakter.'
  return 'Terjadi kesalahan. Silakan coba lagi.'
}

// ═══════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════

/**
 * Cek session saat startup (sync dari localStorage Supabase).
 * Bekerja offline — Supabase menyimpan session di localStorage.
 * Dev mode → langsung kembalikan DEV_USER.
 */
export async function restoreSession(): Promise<AuthUser | null> {
  if (IS_DEV_MODE) return DEV_USER

  try {
    const sb = await getSupabase()
    const { data, error } = await sb.auth.getSession()
    if (error || !data.session) return null
    return sessionToUser(data.session)
  } catch {
    // Jika Supabase tidak tersedia (offline + belum ada session) → null
    return null
  }
}

/**
 * Login dengan email + password.
 * Melempar AuthError dengan pesan Bahasa Indonesia jika gagal.
 */
export async function login(email: string, password: string): Promise<AuthUser> {
  if (IS_DEV_MODE) {
    // Simulasi delay login di dev mode
    await new Promise(r => setTimeout(r, 600))
    return DEV_USER
  }

  let sb: SupabaseClient
  try {
    sb = await getSupabase()
  } catch {
    throw new AuthError('Tidak ada koneksi internet. Periksa jaringan kamu.')
  }

  const { data, error } = await sb.auth.signInWithPassword({ email, password })

  if (error) throw new AuthError(translateError(error.message))
  if (!data.session) throw new AuthError('Login gagal. Coba lagi.')

  return sessionToUser(data.session)
}

/**
 * Logout — hapus session Supabase.
 */
export async function logout(): Promise<void> {
  if (IS_DEV_MODE) return

  try {
    const sb = await getSupabase()
    await sb.auth.signOut()
  } catch {
    // Abaikan error saat logout — tetap lanjut clear state lokal
  }
}

/**
 * Kirim email reset password.
 * redirectTo harus mengarah ke /reset-password di app ini.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  if (IS_DEV_MODE) {
    await new Promise(r => setTimeout(r, 600))
    return
  }

  let sb: SupabaseClient
  try {
    sb = await getSupabase()
  } catch {
    throw new AuthError('Tidak ada koneksi internet. Periksa jaringan kamu.')
  }

  const redirectTo = `${window.location.origin}/reset-password`
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo })

  if (error) throw new AuthError(translateError(error.message))
}

/**
 * Update password baru setelah user klik link reset di email.
 * Dipanggil di ResetPasswordPage setelah Supabase redirect.
 */
export async function updatePassword(newPassword: string): Promise<void> {
  if (IS_DEV_MODE) {
    await new Promise(r => setTimeout(r, 600))
    return
  }

  let sb: SupabaseClient
  try {
    sb = await getSupabase()
  } catch {
    throw new AuthError('Tidak ada koneksi internet. Periksa jaringan kamu.')
  }

  const { error } = await sb.auth.updateUser({ password: newPassword })
  if (error) throw new AuthError(translateError(error.message))
}

/**
 * Subscribe ke perubahan auth state (session expired, dll).
 * Return unsubscribe function.
 */
export async function onAuthChange(
  cb: (user: AuthUser | null) => void
): Promise<() => void> {
  if (IS_DEV_MODE) return () => {}

  try {
    const sb = await getSupabase()
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      cb(session ? sessionToUser(session) : null)
    })
    return () => data.subscription.unsubscribe()
  } catch {
    return () => {}
  }
}
