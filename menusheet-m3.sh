#!/bin/bash

cat > src/components/layout/MenuSheet.tsx <<'FILE'
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

export function MenuSheet({
  open,
  onClose,
}: MenuSheetProps) {
  const navigate = useNavigate()

  if (!open) return null

  const items = [
    {
      icon: Package,
      label: 'Barang',
      path: '/products',
    },
    {
      icon: Users,
      label: 'Mitra',
      path: '/partners',
    },
    {
      icon: FileText,
      label: 'Laporan',
      path: '/reports',
    },
    {
      icon: BarChart3,
      label: 'Analitik',
      path: '/dashboard',
    },
    {
      icon: Settings,
      label: 'Pengaturan',
      path: '/settings',
    },
  ]

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,.32)',
          zIndex: 998,
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          padding: 20,
          zIndex: 999,
        }}
      >
        <div
          style={{
            width: 44,
            height: 4,
            borderRadius: 999,
            background: '#DADCE0',
            margin: '0 auto 20px',
          }}
        />

        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Menu
        </div>

        {items.map(item => {
          const Icon = item.icon

          return (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path)
                onClose()
              }}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 8px',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: '#E8F0FE',
                  color: '#0B57D0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} />
              </div>

              <div
                style={{
                  flex: 1,
                  textAlign: 'left',
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>

              <ChevronRight size={18} />
            </button>
          )
        })}
      </div>
    </>
  )
}
FILE

echo "MenuSheet Material 3 installed"
