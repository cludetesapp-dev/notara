// ═══════════════════════════════════════════════════
// features/settings/SettingsPage.tsx
// Halaman Pengaturan — OrgSettings, ThemeToggle, BackupRestore, Logout
// ═══════════════════════════════════════════════════

import { useState }        from 'react'
import { useNavigate }     from 'react-router-dom'
import { LogOut }          from 'lucide-react'
import { APP_VERSION }     from '@/core/version'
import { OrgSettings }     from './OrgSettings'
import { ThemeToggle }     from './ThemeToggle'
import { BackupRestore }   from './BackupRestore'
import { logout }          from '@/services/authService'
import { useAuthStore }    from '@/state/authStore'
import { useUiStore }      from '@/state/uiStore'
import { IS_DEV_MODE }     from '@/services/authService'

export default function SettingsPage() {
  const navigate           = useNavigate()
  const setUnauthenticated = useAuthStore(s => s.setUnauthenticated)
  const showConfirm        = useUiStore(s => s.showConfirm)
  const user               = useAuthStore(s => s.user)
  const [loggingOut, setLoggingOut] = useState(false)

  function handleLogout() {
    showConfirm(
      'Keluar dari akun',
      'Kamu akan keluar dari NOTARA. Data lokal tetap tersimpan di perangkat ini.',
      async () => {
        setLoggingOut(true)
        await logout()
        setUnauthenticated()
        navigate('/login', { replace: true })
      }
    )
  }

  return (
    <div className="page-scroll">
      <div className="wrap">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <OrgSettings />
          <ThemeToggle />
          <BackupRestore />

          {/* ── Akun / Logout ── */}
          <div style={{
            background:    '#fff',
            border:        '1.5px solid var(--border)',
            borderRadius:  'var(--r)',
            padding:       '16px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.5px', marginBottom: 12 }}>
              AKUN
            </div>

            {/* Info user */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              gap:           10,
              marginBottom:  12,
              padding:       '10px 12px',
              background:    'var(--bg)',
              borderRadius:  8,
            }}>
              <div style={{
                width:           34,
                height:          34,
                background:      'var(--soil)',
                borderRadius:    8,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                flexShrink:      0,
              }}>
                <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
                  <path d="M6 30V6l18 18V6" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--soil)' }}>
                  {user?.name ?? 'Pengguna'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--stone)' }}>
                  {IS_DEV_MODE ? 'Dev Mode (bypass auth)' : user?.email ?? ''}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                width:        '100%',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                gap:          8,
                background:   'none',
                border:       '1.5px solid var(--border)',
                borderRadius: 8,
                padding:      '11px 0',
                fontSize:     13,
                fontWeight:   700,
                color:        loggingOut ? 'var(--stone)' : 'var(--red)',
                cursor:       loggingOut ? 'not-allowed' : 'pointer',
              }}
            >
              <LogOut size={14} />
              {loggingOut ? 'Keluar...' : 'Keluar dari Akun'}
            </button>
          </div>

          {/* Versi */}
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.5px' }}>
              NOTARA v{APP_VERSION}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
