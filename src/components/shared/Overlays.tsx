// ═══════════════════════════════════════════════════
// components/shared/Overlays.tsx — M3 redesign
// ═══════════════════════════════════════════════════

import { useUiStore } from '@/state/uiStore'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ICONS = {
  success: <CheckCircle  size={16} />,
  error:   <XCircle      size={16} />,
  info:    <Info         size={16} />,
  warning: <AlertTriangle size={16} />,
}

const COLORS = {
  success: { bg: 'var(--md-tertiary)',          color: 'var(--md-on-tertiary)' },
  error:   { bg: 'var(--md-error)',             color: '#fff' },
  info:    { bg: 'var(--md-inverse-surface)',   color: 'var(--md-inverse-on-surface)' },
  warning: { bg: 'var(--md-secondary)',         color: 'var(--md-on-secondary)' },
}

export function ToastContainer() {
  const { toasts, dismissToast } = useUiStore()

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--nav-h) + 16px)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center',
      pointerEvents: 'none',
      width: 'min(calc(100vw - 32px), 360px)',
    }}>
      {toasts.map(t => {
        const c = COLORS[t.type]
        return (
          <div
            key={t.id}
            style={{
              background: c.bg,
              color: c.color,
              padding: '12px 20px',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              boxShadow: 'var(--elevation-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'popIn 0.2s ease',
              pointerEvents: 'auto',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              overflow: 'hidden',
              minWidth: 200,
            }}
            onClick={() => dismissToast(t.id)}
          >
            {ICONS[t.type]}
            <span style={{ flex: 1, overflow:'hidden', textOverflow:'ellipsis' }}>{t.message}</span>
            <X size={14} style={{ opacity:0.7, flexShrink:0 }} />
          </div>
        )
      })}
    </div>
  )
}

// ── M3 Dialog ──────────────────────────────────────
export function ConfirmDialog() {
  const { confirm, closeConfirm } = useUiStore()

  if (!confirm.open) return null

  function handleConfirm() {
    confirm.onConfirm()
    closeConfirm()
  }

  return (
    <>
      {/* Scrim */}
      <div
        onClick={closeConfirm}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 500,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* M3 Dialog */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        background: 'var(--md-surface-container-high)',
        borderRadius: 28,
        padding: '24px',
        zIndex: 501,
        width: 'min(calc(100vw - 48px), 312px)',
        boxShadow: 'var(--elevation-3)',
        animation: 'popIn 0.2s ease',
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: 20,
          color: 'var(--md-on-surface)',
          marginBottom: 12,
        }}>
          {confirm.title}
        </div>

        <div style={{
          fontSize: 14,
          color: 'var(--md-on-surface-variant)',
          lineHeight: 1.6,
          marginBottom: 24,
        }}>
          {confirm.message}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={closeConfirm}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: 'var(--shape-full)',
              background: 'transparent',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--md-primary)',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 24px',
              border: 'none',
              borderRadius: 'var(--shape-full)',
              background: 'var(--md-primary)',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--md-on-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </>
  )
}
