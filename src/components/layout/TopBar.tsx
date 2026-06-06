interface TopBarProps {
  isOnline?: boolean
  isSyncing?: boolean
  hasFailed?: boolean
  onPrintNota?: () => void

  title?: string
  subtitle?: string
}

export function TopBar({
  isOnline,
  isSyncing,
  hasFailed,
  onPrintNota,
  title,
  subtitle,
}: TopBarProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: '#FEFBFF',
        borderBottom: '1px solid #D0D7E2',
        padding: '16px 20px',
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {title}
        </div>
      )}

      {subtitle && (
        <div
          style={{
            fontSize: 13,
            color: '#5F6368',
            marginBottom: 8,
          }}
        >
          {subtitle}
        </div>
      )}

      {(isOnline !== undefined ||
        isSyncing !== undefined ||
        hasFailed !== undefined) && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <span>
            {hasFailed
              ? 'Sync Failed'
              : isSyncing
              ? 'Syncing...'
              : isOnline
              ? 'Online'
              : 'Offline'}
          </span>

          {onPrintNota && (
            <button
              onClick={onPrintNota}
              style={{
                border: 0,
                padding: '8px 12px',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              Print
            </button>
          )}
        </div>
      )}
    </header>
  )
}
