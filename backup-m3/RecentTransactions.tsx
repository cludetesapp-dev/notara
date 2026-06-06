import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatRupiah, formatDate } from '@/utils/format'
import type { RecentTx } from './useDashboardData'

interface Props {
  transactions: RecentTx[]
}

export function RecentTransactions({ transactions }: Props) {
  const navigate = useNavigate()

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--r-lg)',
        border: '1.5px solid #e8f0e8',
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <div style={{
        padding: '12px 14px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--clay)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          Transaksi Terbaru
        </div>
        <button
          onClick={() => navigate('/transactions')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 10, fontWeight: 700, color: 'var(--green)',
            padding: '2px 0',
          }}
        >
          Lihat semua
        </button>
      </div>

      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--stone)', fontSize: 12, fontWeight: 600 }}>
          Belum ada transaksi
        </div>
      ) : (
        <div style={{ padding: '0 14px 12px' }}>
          {transactions.map((tx, i) => {
            const isSale = tx.type === 'SALE'
            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 0',
                  borderBottom: i < transactions.length - 1 ? '1px dashed #f0f5f0' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/transactions')}
              >
                {/* Type icon */}
                <div style={{
                  width: 34, height: 32, borderRadius: 10, flexShrink: 0,
                  background: isSale ? 'var(--green)' : 'var(--amber-pale)',
                  border: isSale ? 'none' : '1.5px solid var(--amber-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSale
                    ? <ArrowUpRight size={16} color="#fff" />
                    : <ArrowDownLeft size={16} color="var(--amber)" />
                  }
                </div>

                {/* Partner + code */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--soil)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tx.partnerName}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--stone)', marginTop: 1 }}>
                    {tx.code} · {formatDate(tx.date)}
                  </div>
                </div>

                {/* Total */}
                <div style={{
                  fontSize: 13, fontWeight: 900,
                  fontFamily: 'DM Mono, monospace',
                  color: isSale ? 'var(--green)' : 'var(--amber)',
                  flexShrink: 0,
                }}>
                  {isSale ? '+' : '−'}{formatRupiah(tx.total)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
