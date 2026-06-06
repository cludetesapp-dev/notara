import {
  Settings,
  Package,
  Users,
  FileText,
  BarChart3,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface MenuSheetProps {
  open: boolean
  onClose: () => void
}

export function MenuSheet({ open, onClose }: MenuSheetProps) {
  const navigate = useNavigate()

  if (!open) return null

  const items = [
    { icon: Package,   label: 'Barang',     path: '/products',  color: 'var(--md-primary)',   bg: 'var(--md-primary-container)' },
    { icon: Users,     label: 'Mitra',      path: '/partners',  color: 'var(--md-tertiary)',  bg: 'var(--md-tertiary-container)' },
    { icon: FileText,  label: 'Laporan',    path: '/reports',   color: 'var(--md-secondary)', bg: 'var(--md-secondary-container)' },
    { icon: BarChart3, label: 'Analitik',   path: '/dashboard', color: 'var(--md-primary)',   bg: 'var(--md-primary-container)' },
    { icon: Settings,  label: 'Pengaturan', path: '/settings',  color: 'var(--md-on-surface-variant)', bg: 'var(--md-surface-container-high)' },
  ]

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 998,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--md-surface-container-low)',
          borderTopLeftRadius: 'var(--shape-xl)',
          borderTopRightRadius: 'var(--shape-xl)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)',
          zIndex: 999,
          animation: 'slideIn 0.25s ease',
        }}
      >
        {/* Drag handle */}
        <div className="sheet-handle" />

        {/* Title */}
        <div style={{
          padding: '16px 24px 8px',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--md-on-surface)',
        }}>
          Menu
        </div>

        {/* Items */}
        {items.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => { navigate(item.path); onClose() }}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '10px 24px',
                cursor: 'pointer',
                transition: 'background 0.15s',
                minHeight: 56,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--md-surface-container)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--shape-lg)',
                background: item.bg,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={22} />
              </div>

              <div style={{
                flex: 1,
                textAlign: 'left',
                fontSize: 16,
                fontWeight: 500,
                color: 'var(--md-on-surface)',
              }}>
                {item.label}
              </div>

              <ChevronRight size={20} color="var(--md-on-surface-variant)" />
            </button>
          )
        })}
      </div>
    </>
  )
}
