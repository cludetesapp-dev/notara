#!/usr/bin/env bash
set -e

cd ~/Downloads/notara-v1_7_0

mkdir -p src/utils

cat > src/utils/formatters.ts <<'EOT'
export * from './format'
EOT

cat > src/features/dashboard/SummaryCards.tsx <<'EOT'
import { formatRupiah } from '@/utils/formatters'
import type {
  DailyStats,
  MonthlyStats,
  ReceivablePayable,
} from './useDashboardData'

interface SummaryCardsProps {
  today: DailyStats
  month: MonthlyStats
  rp: ReceivablePayable
}

function Card({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8EAED',
        borderRadius: 24,
        padding: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,.06)',
      }}
    >
      <div style={{ fontSize: 12, color: '#5F6368', marginBottom: 8 }}>
        {title}
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#1F1F1F',
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          color: '#5F6368',
        }}
      >
        {subtitle}
      </div>
    </div>
  )
}

export function SummaryCards({
  today,
  month,
  rp,
}: SummaryCardsProps) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div
        style={{
          background: '#E8F0FE',
          borderRadius: 28,
          padding: 24,
          border: '1px solid #D3E3FD',
        }}
      >
        <div
          style={{
            color: '#0B57D0',
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Profit Bulan Ini
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#0B57D0',
          }}
        >
          {formatRupiah(month.profit)}
        </div>

        <div
          style={{
            marginTop: 8,
            color: '#5F6368',
            fontSize: 13,
          }}
        >
          {month.txCount} transaksi
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        <Card
          title="Omset Hari Ini"
          value={formatRupiah(today.omset)}
          subtitle={`${today.txCount} transaksi`}
        />

        <Card
          title="Piutang"
          value={formatRupiah(rp.totalPiutang)}
          subtitle={`${rp.countPiutang} transaksi`}
        />

        <Card
          title="Pembelian Hari Ini"
          value={formatRupiah(today.purchase)}
          subtitle="Total purchase"
        />

        <Card
          title="Utang"
          value={formatRupiah(rp.totalUtang)}
          subtitle={`${rp.countUtang} transaksi`}
        />
      </div>
    </div>
  )
}
EOT

cat > src/features/dashboard/TrendChart.tsx <<'EOT'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip
} from 'recharts'

import type { TrendPoint } from './useDashboardData'

interface TrendChartProps {
  data: TrendPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 28,
        border: '1px solid #E8EAED',
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 12,
            color: '#5F6368',
            marginBottom: 4,
          }}
        >
          Performa Bisnis
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#1F1F1F',
          }}
        >
          Trend Profit
        </div>
      </div>

      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid stroke="#EEF2F6" vertical={false} />

            <XAxis
              dataKey="label"
              tick={{ fill: '#5F6368', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="profit"
              stroke="#0B57D0"
              strokeWidth={3}
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
EOT

cat > src/features/dashboard/TopProducts.tsx <<'EOT'
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
EOT

cat > src/features/dashboard/RecentTransactions.tsx <<'EOT'
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
EOT

