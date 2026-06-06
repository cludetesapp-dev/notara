import { m3 } from '@/theme/material3'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({
  title,
  subtitle,
}: TopBarProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,

        background: m3.color.surface,

        backdropFilter: 'blur(12px)',

        borderBottom: `1px solid ${m3.color.outline}`,

        padding: '20px 20px 16px',
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: m3.color.onSurface,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            color: m3.color.onSurfaceVariant,
          }}
        >
          {subtitle}
        </div>
      )}
    </header>
  )
}
