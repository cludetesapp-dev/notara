import { Package } from 'lucide-react'
import { formatRupiahCompact } from '@/utils/format'
import type { TopProduct } from './useDashboardData'

interface Props {
  products: TopProduct[]
}

const RANK_COLORS = ['#166534', '#15803d', '#16a34a', '#4ade80', '#86efac']

export function TopProducts({ products }: Props) {
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
      <div style={{ padding: '12px 14px 4px', fontSize: 11, fontWeight: 800, color: 'var(--clay)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        Top Produk Bulan Ini
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--stone)', fontSize: 12, fontWeight: 600 }}>
          Belum ada penjualan
        </div>
      ) : (
        <div style={{ padding: '4px 14px 12px' }}>
          {products.map((p, i) => (
            <div
              key={p.productId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 0',
                borderBottom: i < products.length - 1 ? '1px dashed #f0f5f0' : 'none',
              }}
            >
              {/* Rank badge */}
              <div style={{
                width: 20, height: 20, borderRadius: 6,
                background: 'var(--green-pale)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: 'var(--green)', flexShrink: 0,
              }}>
                {i + 1}
              </div>

              {/* Product icon */}
              <div style={{
                width: 28, height: 28, borderRadius: 9,
                background: RANK_COLORS[i] + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Package size={14} color={RANK_COLORS[i]} />
              </div>

              {/* Name + qty */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--soil)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.productName}
                </div>
                <div style={{ fontSize: 10, color: 'var(--stone)', fontWeight: 600 }}>
                  {p.qty} {p.unit}
                </div>
              </div>

              {/* Omset */}
              <div style={{ fontSize: 11.5, fontWeight: 800, fontFamily: 'DM Mono, monospace', color: 'var(--green)', flexShrink: 0 }}>
                {formatRupiahCompact(p.omset)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
