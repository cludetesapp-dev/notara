// ═══════════════════════════════════════════════════
// hooks/useSync.ts
// Trigger sync saat kembali online, expose sync state
// ═══════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react'
import { runSync, SYNC_ENABLED }  from '@/services/syncService'
import { useAuthStore }           from '@/state/authStore'
import { useOnlineStatus }        from './useOnlineStatus'

export interface SyncState {
  isSyncing:    boolean
  lastSyncedAt: Date | null
  hasFailed:    boolean
  triggerSync:  () => void
}

export function useSync(): SyncState {
  const isOnline      = useOnlineStatus()
  const user          = useAuthStore(s => s.user)
  const status        = useAuthStore(s => s.status)

  const [isSyncing,    setIsSyncing]    = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)
  const [hasFailed,    setHasFailed]    = useState(false)

  // Cegah concurrent sync
  const syncingRef   = useRef(false)
  // Simpan apakah ada pending sync saat sedang syncing
  const pendingRef   = useRef(false)

  const doSync = useCallback(async () => {
    if (!SYNC_ENABLED)               return
    if (!user)                        return
    if (status !== 'authenticated')   return
    if (!navigator.onLine)            return

    if (syncingRef.current) {
      // Tandai ada sync pending — akan dijalankan setelah yang sekarang selesai
      pendingRef.current = true
      return
    }

    syncingRef.current = true
    setIsSyncing(true)
    setHasFailed(false)

    try {
      await runSync(user.id)
      setLastSyncedAt(new Date())
    } catch {
      setHasFailed(true)
    } finally {
      syncingRef.current = false
      setIsSyncing(false)

      // Jika ada pending sync, jalankan sekarang
      if (pendingRef.current) {
        pendingRef.current = false
        doSync()
      }
    }
  }, [user, status])

  // Trigger sync saat kembali online
  useEffect(() => {
    if (isOnline) doSync()
  }, [isOnline, doSync])

  // Periodic sync setiap 5 menit saat online
  useEffect(() => {
    if (!isOnline) return
    const interval = setInterval(() => doSync(), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [isOnline, doSync])

  return {
    isSyncing,
    lastSyncedAt,
    hasFailed,
    triggerSync: doSync,
  }
}
