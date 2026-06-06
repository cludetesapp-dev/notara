import { formatRupiah } from '@/utils/formatters'
import type { TopProduct } from './useDashboardData'

interface TopProductsProps {
  products: TopProduct[]
}

const rankColors = ['var(--md-primary)', 'var(--md-secondary)', 'var(--md-tertiary)']

export function TopProducts({ products }: TopProductsProps) {
  if (!products.length) return null

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
          Produk Terlaris
        </div>
      </div>

      {products.map((item, index) => (
        <div
          key={item.productId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 20px',
            borderTop: '1px solid var(--md-outline-variant)',
          }}
        >
          {/* Rank badge */}
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--shape-full)',
            background: index < 3
              ? rankColors[index]
              : 'var(--md-surface-container)',
            color: index < 3 ? '#fff' : 'var(--md-on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            flexShrink: 0,
          }}>
            {index + 1}
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
              {item.productName}
            </div>
            <div style={{
              fontSize: 12,
              color: 'var(--md-on-surface-variant)',
              marginTop: 2,
            }}>
              {item.qty} {item.unit} terjual
            </div>
          </div>

          <div style={{
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--md-primary)',
            fontFamily: "'DM Mono', monospace",
            flexShrink: 0,
          }}>
            {formatRupiah(item.omset)}
          </div>
        </div>
      ))}
    </div>
  )
}
