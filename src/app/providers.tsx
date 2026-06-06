// ═══════════════════════════════════════════════════
// app/providers.tsx — App-level providers + Auth init
// ═══════════════════════════════════════════════════

import React, { useEffect } from 'react'
import { restoreSession, onAuthChange } from '@/services/authService'
import { useAuthStore }                 from '@/state/authStore'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const setAuthenticated   = useAuthStore(s => s.setAuthenticated)
  const setUnauthenticated = useAuthStore(s => s.setUnauthenticated)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    async function init() {
      // 1) Coba restore session dari localStorage (bekerja offline)
      const user = await restoreSession()
      if (user) {
        setAuthenticated(user)
      } else {
        setUnauthenticated()
      }

      // 2) Subscribe ke perubahan auth state (session expired, logout di tab lain)
      unsubscribe = await onAuthChange((changedUser) => {
        if (changedUser) setAuthenticated(changedUser)
        else setUnauthenticated()
      })
    }

    init()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [setAuthenticated, setUnauthenticated])

  return <>{children}</>
}
