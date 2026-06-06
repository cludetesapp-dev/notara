import { formatRupiah } from '@/utils/formatters'
import type { TopProduct } from './useDashboardData'

interface TopProductsProps {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 28,
        border: '1px solid #E8EAED',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E8EAED',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Produk Terlaris
        </div>
      </div>

      {products.map((item, index) => (
        <div
          key={item.productId}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid #F1F3F4',
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>
              {index + 1}. {item.productName}
            </div>

            <div
              style={{
                fontSize: 12,
                color: '#5F6368',
              }}
            >
              {item.qty} {item.unit}
            </div>
          </div>

          <div style={{ fontWeight: 700 }}>
            {formatRupiah(item.omset)}
          </div>
        </div>
      ))}
    </div>
  )
}
