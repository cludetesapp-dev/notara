#!/bin/bash

cat > src/features/dashboard/TopProducts.tsx <<'FILE'
import { formatRupiah } from '@/utils/formatters'

interface ProductItem {
  id: string
  name: string
  quantity: number
  revenue: number
}

interface TopProductsProps {
  products: ProductItem[]
}

export function TopProducts({
  products,
}: TopProductsProps) {
  const topFive = products.slice(0, 5)

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
            fontSize: 12,
            color: '#5F6368',
            marginBottom: 4,
          }}
        >
          Produk Terlaris
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#1F1F1F',
            letterSpacing: '-0.03em',
          }}
        >
          Top Products
        </div>
      </div>

      {topFive.length === 0 && (
        <div
          style={{
            padding: 32,
            textAlign: 'center',
            color: '#5F6368',
          }}
        >
          Belum ada data produk
        </div>
      )}

      {topFive.map((item, index) => (
        <div
          key={item.id}
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
              width: 38,
              height: 38,
              borderRadius: 12,
              background:
                index === 0
                  ? '#D3E3FD'
                  : '#F1F3F4',
              color:
                index === 0
                  ? '#0B57D0'
                  : '#5F6368',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {index + 1}
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: '#1F1F1F',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
            </div>

            <div
              style={{
                fontSize: 12,
                color: '#5F6368',
                marginTop: 2,
              }}
            >
              {item.quantity} terjual
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
                color: '#0B57D0',
              }}
            >
              {formatRupiah(item.revenue)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
FILE

echo "TopProducts Material 3 installed"
