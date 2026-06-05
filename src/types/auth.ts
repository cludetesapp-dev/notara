// ═══════════════════════════════════════════════════
// types/auth.ts — Auth types NOTARA
// ═══════════════════════════════════════════════════

export interface AuthUser {
  id:        string
  email:     string
  name?:     string
  avatarUrl?: string
}

export type AuthStatus =
  | 'loading'      // sedang cek session saat startup
  | 'authenticated'
  | 'unauthenticated'

export interface AuthState {
  status: AuthStatus
  user:   AuthUser | null
}
