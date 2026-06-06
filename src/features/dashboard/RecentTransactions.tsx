import { formatRupiah } from '@/utils/formatters'
import type { RecentTx } from './useDashboardData'

interface RecentTransactionsProps {
  transactions: RecentTx[]
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
        }}
      >
        Transaksi Terbaru
      </div>

      {transactions.map(tx => (
        <div
          key={tx.id}
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #F1F3F4',
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {tx.partnerName}
          </div>

          <div
            style={{
              fontSize: 12,
              color: '#5F6368',
              marginTop: 2,
            }}
          >
            {tx.date}
          </div>

          <div
            style={{
              marginTop: 4,
              fontWeight: 700,
            }}
          >
            {formatRupiah(tx.total)}
          </div>
        </div>
      ))}
    </div>
  )
}
