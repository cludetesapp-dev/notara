// ═══════════════════════════════════════════════════
// components/layout/TopBar.tsx
// ═══════════════════════════════════════════════════

import { Printer, Settings } from 'lucide-react'
import { useNavigate }       from 'react-router-dom'
import { SyncBadge }         from '@/components/shared/SyncBadge'

interface TopBarProps {
  isOnline?:    boolean
  isSyncing?:   boolean
  hasFailed?:   boolean
  onPrintNota?: () => void
}

export function TopBar({
  isOnline   = true,
  isSyncing  = false,
  hasFailed  = false,
  onPrintNota,
}: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header className="app-bar">
      {/* Brand */}
      <div className="bar-brand">
        <div className="bar-brand-box">
          <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
            <path d="M6 30V6l18 18V6" stroke="white" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="bar-brand-name">NOTARA</div>
          <div className="bar-brand-sub">Nota &amp; Arsip Digital</div>
        </div>
      </div>

      {/* Right actions */}
      <div className="bar-right">
        <SyncBadge
          isOnline={isOnline}
          isSyncing={isSyncing}
          hasFailed={hasFailed}
        />

        <button className="bar-btn" onClick={onPrintNota} aria-label="Cetak Nota">
          <Printer size={16} />
        </button>

        <button className="bar-btn" onClick={() => navigate('/settings')} aria-label="Pengaturan">
          <Settings size={16} />
        </button>
      </div>
    </header>
  )
}
