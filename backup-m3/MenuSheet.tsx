import { useNavigate } from 'react-router-dom'
import { Users, BarChart2, Settings, Download, Trash2, X } from 'lucide-react'

interface Props {
  open:    boolean
  onClose: () => void
}

const MENU_ITEMS = [
  { icon: <Users size={20} />,    label: 'Mitra',      sub: 'Supplier & Customer', path: '/partners' },
  { icon: <BarChart2 size={20} />, label: 'Laporan',    sub: 'Harian, bulanan, tahunan', path: '/reports' },
  { icon: <Settings size={20} />, label: 'Pengaturan', sub: 'Profil toko, rekening', path: '/settings' },
  { icon: <Download size={20} />, label: 'Backup',     sub: 'Export & import data', path: '/backup' },
  { icon: <Trash2 size={20} />,   label: 'Arsip',      sub: 'Transaksi terhapus', path: '/trash' },
]

export function MenuSheet({ open, onClose }: Props) {
  const navigate = useNavigate()
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 100, backdropFilter: 'blur(2px)',
      }} />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderRadius: '20px 20px 0 0',
        zIndex: 101, padding: '0 0 32px',
        animation: 'slideUpSheet .28s cubic-bezier(.4,0,.2,1)',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#e5e7eb', margin: '0 auto' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 12px' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--soil)' }}>Menu</span>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            background: '#f1f5f1', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} color="var(--clay)" />
          </button>
        </div>

        {/* Items */}
        {MENU_ITEMS.map(item => (
          <button key={item.path} onClick={() => { navigate(item.path); onClose() }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', border: 'none', background: 'none',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
              borderBottom: '1px solid #f5f5f5', transition: 'background .15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-pale)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--green-pale)', border: '1.5px solid var(--green-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--green)', flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--soil)' }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--stone)', marginTop: 1 }}>{item.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
