// ═══════════════════════════════════════════════════
// components/shared/ToastContainer.tsx
// ═══════════════════════════════════════════════════

import { useUiStore } from '@/state/uiStore'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ICONS = {
  success: <CheckCircle  size={15} />,
  error:   <XCircle      size={15} />,
  info:    <Info         size={15} />,
  warning: <AlertTriangle size={15} />,
}

const COLORS = {
  success: { bg: '#166534', color: '#fff' },
  error:   { bg: '#dc2626', color: '#fff' },
  info:    { bg: '#1c1917', color: '#fff' },
  warning: { bg: '#b45309', color: '#fff' },
}

export function ToastContainer() {
  const { toasts, dismissToast } = useUiStore()

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--nav-h) + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
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
              padding: '10px 14px',
              borderRadius: 50,
              fontSize: 12.5,
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              animation: 'popIn 0.2s ease',
              pointerEvents: 'auto',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
            onClick={() => dismissToast(t.id)}
          >
            {ICONS[t.type]}
            <span style={{ overflow:'hidden', textOverflow:'ellipsis' }}>{t.message}</span>
            <X size={12} style={{ opacity:0.6, flexShrink:0 }} />
          </div>
        )
      })}
    </div>
  )
}


// ═══════════════════════════════════════════════════
// components/shared/ConfirmDialog.tsx
// ═══════════════════════════════════════════════════

export function ConfirmDialog() {
  const { confirm, closeConfirm } = useUiStore()

  if (!confirm.open) return null

  function handleConfirm() {
    confirm.onConfirm()
    closeConfirm()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeConfirm}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex: 500,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Dialog */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        background: '#fff',
        borderRadius: 'var(--r-lg)',
        padding: '22px 20px 18px',
        zIndex: 501,
        width: 'min(calc(100vw - 40px), 320px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'popIn 0.2s ease',
      }}>
        <div style={{ fontWeight:900, fontSize:16, color:'var(--soil)', marginBottom:8 }}>
          {confirm.title}
        </div>
        <div style={{ fontSize:13, color:'var(--clay)', lineHeight:1.5, marginBottom:20 }}>
          {confirm.message}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button
            onClick={closeConfirm}
            style={{
              flex:1, padding:'11px', border:'1.5px solid var(--border)',
              borderRadius:'var(--r-sm)', background:'var(--cream)',
              fontFamily:'inherit', fontWeight:700, fontSize:13,
              color:'var(--clay)', cursor:'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex:1, padding:'11px', border:'none',
              borderRadius:'var(--r-sm)',
              background:'linear-gradient(135deg,var(--green),var(--green-mid))',
              fontFamily:'inherit', fontWeight:800, fontSize:13,
              color:'#fff', cursor:'pointer',
              boxShadow:'0 4px 12px rgba(22,101,52,0.3)',
            }}
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </>
  )
}
