#!/bin/bash

cat > src/features/dashboard/RecentTransactions.tsx <<'FILE'
import { formatRupiah } from '@/utils/formatters'

interface TransactionItem {
  id: string
  customerName?: string
  partnerName?: string
  total?: number
  profit?: number
  createdAt?: string
}

interface RecentTransactionsProps {
  transactions: TransactionItem[]
}

function initials(name: string) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid #E8EAED',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E8EAED',
          fontWeight: 700,
          color: '#1F1F1F',
        }}
      >
        Transaksi Terbaru
      </div>

      {transactions.length === 0 && (
        <div
          style={{
            padding: 32,
            textAlign: 'center',
            color: '#5F6368',
          }}
        >
          Belum ada transaksi
        </div>
      )}

      {transactions.map(tx => {
        const name =
          tx.customerName ||
          tx.partnerName ||
          'Pelanggan'

        return (
          <div
            key={tx.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 20px',
              borderBottom: '1px solid #F1F3F4',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: '#D3E3FD',
                color: '#0B57D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials(name)}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: '#1F1F1F',
                }}
              >
                {name}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: '#5F6368',
                  marginTop: 2,
                }}
              >
                {tx.createdAt || '-'}
              </div>
            </div>

            <div
              style={{
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: '#1F1F1F',
                }}
              >
                {formatRupiah(tx.total || 0)}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color:
                    (tx.profit || 0) >= 0
                      ? '#0B57D0'
                      : '#D93025',
                }}
              >
                {formatRupiah(tx.profit || 0)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
FILE

echo "RecentTransactions Material 3 installed"
