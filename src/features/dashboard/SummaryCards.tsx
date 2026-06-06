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
