import { Printer, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SyncBadge } from '@/components/shared/SyncBadge'

interface TopBarProps {
  isOnline?: boolean
  isSyncing?: boolean
  hasFailed?: boolean
  onPrintNota?: () => void
}

export function TopBar({
  isOnline = true,
  isSyncing = false,
  hasFailed = false,
  onPrintNota,
}: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header className="app-bar">
      <div className="bar-brand">
        <div className="bar-brand-box">N</div>
        <div>
          <div className="bar-brand-name">NOTARA</div>
          <div className="bar-brand-sub">Nota & Arsip Digital</div>
        </div>
      </div>

      <div className="bar-right">
        <SyncBadge
          isOnline={isOnline}
          isSyncing={isSyncing}
          hasFailed={hasFailed}
        />
        <button
          className="bar-btn"
          onClick={onPrintNota}
          aria-label="Cetak Nota"
        >
          <Printer size={20} />
        </button>
        <button
          className="bar-btn"
          onClick={() => navigate('/settings')}
          aria-label="Pengaturan"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  )
}
