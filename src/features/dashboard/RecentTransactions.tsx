import { formatRupiah } from '@/utils/formatters'
import type { RecentTx } from './useDashboardData'
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface RecentTransactionsProps {
  transactions: RecentTx[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions.length) return null

  return (
    <div style={{
      background: 'var(--md-surface-container-lowest)',
      borderRadius: 'var(--shape-xl)',
      border: '1px solid var(--md-outline-variant)',
      overflow: 'hidden',
      boxShadow: 'var(--elevation-1)',
    }}>
      <div style={{
        padding: '16px 20px 12px',
      }}>
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--md-on-surface)',
        }}>
          Transaksi Terbaru
        </div>
      </div>

      {transactions.map(tx => {
        const isSale = tx.type === 'SALE'
        return (
          <div
            key={tx.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 20px',
              borderTop: '1px solid var(--md-outline-variant)',
            }}
          >
            {/* Icon */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--shape-full)',
              background: isSale
                ? 'var(--md-primary-container)'
                : 'var(--md-secondary-container)',
              color: isSale
                ? 'var(--md-primary)'
                : 'var(--md-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {isSale
                ? <ArrowUpRight size={18} />
                : <ArrowDownLeft size={18} />
              }
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600,
                fontSize: 14,
                color: 'var(--md-on-surface)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {tx.partnerName || (isSale ? 'Penjualan' : 'Pembelian')}
              </div>
              <div style={{
                fontSize: 12,
                color: 'var(--md-on-surface-variant)',
                marginTop: 2,
              }}>
                {tx.date}
              </div>
            </div>

            <div style={{
              fontWeight: 700,
              fontSize: 14,
              color: isSale ? 'var(--md-primary)' : 'var(--md-on-surface)',
              fontFamily: "'DM Mono', monospace",
              flexShrink: 0,
            }}>
              {isSale ? '+' : '-'}{formatRupiah(tx.total)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
