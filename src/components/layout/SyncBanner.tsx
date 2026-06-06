import { useEffect, useState } from 'react'

interface Props {
  isSyncing: boolean
}

// Slide-down banner persis farm-v4 — muncul saat syncing, auto-hide setelah done
export function SyncBanner({ isSyncing }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isSyncing) {
      setVisible(true)
    } else {
      // delay hide supaya user sempat lihat "Tersimpan"
      const t = setTimeout(() => setVisible(false), 1500)
      return () => clearTimeout(t)
    }
  }, [isSyncing])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: isSyncing ? 'var(--md-on-surface)' : 'var(--md-primary)',
      color: '#fff', padding: '7px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 7, fontSize: 12, fontWeight: 700,
      animation: 'slideDownBanner .25s ease',
    }}>
      {isSyncing ? (
        <>
          <span className="spin" style={{ width: 14, height: 14, borderWidth: 2 }} />
          Menyinkronkan data...
        </>
      ) : (
        <>✓ Tersimpan</>
      )}
      <style>{`
        @keyframes slideDownBanner {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  )
}
