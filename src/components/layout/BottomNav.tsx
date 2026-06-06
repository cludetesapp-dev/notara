import {
  LayoutDashboard,
  Package,
  Receipt,
  Menu,
  Plus,
} from 'lucide-react'

import { m3 } from '@/theme/material3'

interface BottomNavProps {
  activeTab: string
  onChange: (tab: string) => void
  onQuickAdd?: () => void
}

function Item({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 56,
          height: 32,
          borderRadius: 999,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          background: active
            ? m3.color.surfaceContainerHigh
            : 'transparent',
        }}
      >
        {icon}
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: active ? 600 : 500,
          color: m3.color.onSurface,
        }}
      >
        {label}
      </span>
    </button>
  )
}

export function BottomNav({
  activeTab,
  onChange,
  onQuickAdd,
}: BottomNavProps) {
  return (
    <>
      <button
        onClick={() => onQuickAdd?.()}
        style={{
          position: 'fixed',
          bottom: 88,
          left: '50%',
          transform: 'translateX(-50%)',

          width: 64,
          height: 64,

          border: 'none',
          borderRadius: 20,

          background: m3.color.primary,
          color: '#fff',

          boxShadow:
            '0 8px 24px rgba(11,87,208,.28)',

          zIndex: 50,
          cursor: 'pointer',
        }}
      >
        <Plus size={28} />
      </button>

      <nav
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,

          height: 80,

          background: m3.color.surface,

          borderTop:
            `1px solid ${m3.color.outline}`,

          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',

          zIndex: 40,
        }}
      >
        <Item
          active={activeTab === 'dashboard'}
          label="Dashboard"
          icon={<LayoutDashboard size={20} />}
          onClick={() => onChange('dashboard')}
        />

        <Item
          active={activeTab === 'products'}
          label="Barang"
          icon={<Package size={20} />}
          onClick={() => onChange('products')}
        />

        <div style={{ width: 64 }} />

        <Item
          active={activeTab === 'transactions'}
          label="Transaksi"
          icon={<Receipt size={20} />}
          onClick={() => onChange('transactions')}
        />

        <Item
          active={activeTab === 'menu'}
          label="Menu"
          icon={<Menu size={20} />}
          onClick={() => onChange('menu')}
        />
      </nav>
    </>
  )
}
