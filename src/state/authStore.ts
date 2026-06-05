// ═══════════════════════════════════════════════════
// state/authStore.ts — Zustand auth state
// ═══════════════════════════════════════════════════

import { create } from 'zustand'
import type { AuthUser, AuthStatus } from '@/types/auth'

interface AuthStore {
  status: AuthStatus
  user:   AuthUser | null

  setLoading:         () => void
  setAuthenticated:   (user: AuthUser) => void
  setUnauthenticated: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: 'loading',
  user:   null,

  setLoading:         () => set({ status: 'loading',         user: null }),
  setAuthenticated:   (user) => set({ status: 'authenticated',   user }),
  setUnauthenticated: () => set({ status: 'unauthenticated', user: null }),
}))
