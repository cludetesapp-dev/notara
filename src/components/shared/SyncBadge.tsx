// ═══════════════════════════════════════════════════
// components/shared/SyncBadge.tsx
// Pill Online/Offline/Syncing di TopBar
// ═══════════════════════════════════════════════════

interface Props {
  isOnline:  boolean
  isSyncing: boolean
  hasFailed: boolean
}

export function SyncBadge({ isOnline, isSyncing, hasFailed }: Props) {
  // Tentukan warna + label
  let dotColor: string
  let bgColor:  string
  let bdColor:  string
  let label:    string

  if (!isOnline) {
    dotColor = '#dc2626'
    bgColor  = 'rgba(220,38,38,0.15)'
    bdColor  = 'rgba(220,38,38,0.35)'
    label    = 'Offline'
  } else if (isSyncing) {
    dotColor = '#f59e0b'
    bgColor  = 'rgba(245,158,11,0.15)'
    bdColor  = 'rgba(245,158,11,0.35)'
    label    = 'Sync...'
  } else if (hasFailed) {
    dotColor = '#f97316'
    bgColor  = 'rgba(249,115,22,0.15)'
    bdColor  = 'rgba(249,115,22,0.35)'
    label    = 'Gagal'
  } else {
    dotColor = '#4ade80'
    bgColor  = 'rgba(74,222,128,0.15)'
    bdColor  = 'rgba(74,222,128,0.35)'
    label    = 'Online'
  }

  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          4,
      background:   bgColor,
      borderRadius: 50,
      padding:      '3px 8px',
      border:       `1px solid ${bdColor}`,
    }}>
      {isSyncing ? (
        /* Spinner kecil saat syncing */
        <span style={{
          width:        6,
          height:       6,
          borderRadius: '50%',
          border:       `1.5px solid ${dotColor}`,
          borderTopColor: 'transparent',
          display:      'inline-block',
          animation:    'spin 0.7s linear infinite',
          flexShrink:   0,
        }} />
      ) : (
        <div style={{
          width:        6,
          height:       6,
          borderRadius: '50%',
          background:   dotColor,
          flexShrink:   0,
        }} />
      )}
      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
        {label}
      </span>
    </div>
  )
}
