#!/bin/bash

cat > src/features/dashboard/SummaryCards.tsx <<'FILE'
import { formatRupiah } from '@/utils/formatters'

interface SummaryCardsProps {
  revenue: number
  expense: number
  profit: number
  transactionCount: number
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
      <div
        style={{
          fontSize: 12,
          color: '#5F6368',
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#1F1F1F',
          letterSpacing: '-0.03em',
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
  revenue,
  expense,
  profit,
  transactionCount,
}: SummaryCardsProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
      }}
    >
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
          Total Profit
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#0B57D0',
            letterSpacing: '-0.04em',
          }}
        >
          {formatRupiah(profit)}
        </div>

        <div
          style={{
            marginTop: 8,
            color: '#5F6368',
            fontSize: 13,
          }}
        >
          {transactionCount} transaksi
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
          title="Penjualan"
          value={formatRupiah(revenue)}
          subtitle="Total pemasukan"
        />

        <Card
          title="Pembelian"
          value={formatRupiah(expense)}
          subtitle="Total pengeluaran"
        />
      </div>
    </div>
  )
}
FILE

echo "SummaryCards Material 3 installed"
