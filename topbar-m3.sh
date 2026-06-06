#!/bin/bash

cat > src/components/layout/TopBar.tsx <<'FILE'
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
    <header
      className="app-bar"
      style={{
        background: '#fff',
        borderBottom: '1px solid #E8EAED',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="bar-brand"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          className="bar-brand-box"
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: '#0B57D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: '-1px',
            boxShadow: '0 2px 8px rgba(11,87,208,.18)',
          }}
        >
          N
        </div>

        <div>
          <div
            className="bar-brand-name"
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: '#1F1F1F',
              letterSpacing: '-0.02em',
            }}
          >
            NOTARA
          </div>

          <div
            className="bar-brand-sub"
            style={{
              fontSize: 12,
              color: '#5F6368',
            }}
          >
            Nota & Arsip Digital
          </div>
        </div>
      </div>

      <div
        className="bar-right"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
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
          <Printer size={18} />
        </button>

        <button
          className="bar-btn"
          onClick={() => navigate('/settings')}
          aria-label="Pengaturan"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}
FILE

echo "TopBar Material 3 installed"
