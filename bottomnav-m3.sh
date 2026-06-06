#!/bin/bash

cat > src/components/layout/BottomNav.tsx <<'FILE'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  Package,
  Menu
} from 'lucide-react'

interface BottomNavProps {
  onAdd?: () => void
  onMenu?: () => void
}

export function BottomNav({
  onAdd,
  onMenu,
}: BottomNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const active = (path: string) =>
    path === '/'
      ? pathname === '/'
      : pathname.startsWith(path)

  const navStyle = (
    isActive: boolean
  ): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
    border: 'none',
    background: isActive
      ? '#D3E3FD'
      : 'transparent',
    color: isActive
      ? '#0B57D0'
      : '#5F6368',
    borderRadius: 999,
    padding: '10px 12px',
    transition: 'all .15s ease',
    fontWeight: isActive ? 700 : 500,
  })

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
        background: '#fff',
        borderTop: '1px solid #E8EAED',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        zIndex: 999,
      }}
    >
      <button
        style={navStyle(active('/'))}
        onClick={() => navigate('/')}
      >
        <LayoutDashboard size={20} />
        <span style={{ fontSize: 11 }}>
          Dashboard
        </span>
      </button>

      <button
        style={navStyle(active('/transactions'))}
        onClick={() => navigate('/transactions')}
      >
        <ArrowLeftRight size={20} />
        <span style={{ fontSize: 11 }}>
          Transaksi
        </span>
      </button>

      <button
        className="nav-add"
        onClick={onAdd}
        aria-label="Tambah"
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          border: 'none',
          background: '#0B57D0',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 4px 12px rgba(11,87,208,.25)',
          marginTop: -20,
        }}
      >
        <Plus size={24} />
      </button>

      <button
        style={navStyle(active('/products'))}
        onClick={() => navigate('/products')}
      >
        <Package size={20} />
        <span style={{ fontSize: 11 }}>
          Barang
        </span>
      </button>

      <button
        style={navStyle(false)}
        onClick={onMenu}
      >
        <Menu size={20} />
        <span style={{ fontSize: 11 }}>
          Menu
        </span>
      </button>
    </nav>
  )
}
FILE

echo "BottomNav Material 3 installed"
