import { formatRupiah } from '@/utils/formatters'
import type {
  DailyStats,
  MonthlyStats,
  ReceivablePayable,
} from './useDashboardData'
import { TrendingUp, ShoppingBag, AlertCircle, ArrowDownLeft } from 'lucide-react'

interface SummaryCardsProps {
  today: DailyStats
  month: MonthlyStats
  rp: ReceivablePayable
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div style={{
      background: accent ? 'var(--md-primary-container)' : 'var(--md-surface-container-lowest)',
      borderRadius: 'var(--shape-xl)',
      padding: '16px',
      border: accent ? 'none' : '1px solid var(--md-outline-variant)',
      boxShadow: accent ? 'none' : 'var(--elevation-1)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: accent ? 'var(--md-on-primary-container)' : 'var(--md-on-surface-variant)',
        }}>
          {title}
        </div>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--shape-full)',
          background: accent
            ? 'rgba(255,255,255,0.3)'
            : 'var(--md-surface-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent ? 'var(--md-on-primary-container)' : 'var(--md-primary)',
        }}>
          {icon}
        </div>
      </div>

      <div style={{
        fontSize: 22,
        fontWeight: 800,
        color: accent ? 'var(--md-on-primary-container)' : 'var(--md-on-surface)',
        fontFamily: "'DM Mono', monospace",
        letterSpacing: '-0.5px',
        marginBottom: 4,
      }}>
        {value}
      </div>

      <div style={{
        fontSize: 12,
        color: accent ? 'var(--md-on-primary-container)' : 'var(--md-on-surface-variant)',
        opacity: accent ? 0.75 : 1,
      }}>
        {subtitle}
      </div>
    </div>
  )
}

export function SummaryCards({ today, month, rp }: SummaryCardsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Hero profit card */}
      <div style={{
        background: 'var(--md-primary)',
        borderRadius: 'var(--shape-xl)',
        padding: '24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}>
          <TrendingUp size={16} color="rgba(255,255,255,0.75)" />
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.75)',
          }}>
            Profit Bulan Ini
          </span>
        </div>

        <div style={{
          fontSize: 40,
          fontWeight: 800,
          color: 'var(--md-on-primary)',
          fontFamily: "'DM Mono', monospace",
          letterSpacing: '-1px',
          lineHeight: 1.1,
        }}>
          {formatRupiah(month.profit)}
        </div>

        <div style={{
          marginTop: 8,
          color: 'rgba(255,255,255,0.65)',
          fontSize: 13,
        }}>
          {month.txCount} transaksi · bulan ini
        </div>
      </div>

      {/* KPI grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
      }}>
        <KpiCard
          title="Omset Hari Ini"
          value={formatRupiah(today.omset)}
          subtitle={`${today.txCount} transaksi`}
          icon={<ShoppingBag size={18} />}
        />
        <KpiCard
          title="Piutang"
          value={formatRupiah(rp.totalPiutang)}
          subtitle={`${rp.countPiutang} belum lunas`}
          icon={<AlertCircle size={18} />}
        />
        <KpiCard
          title="Pembelian Hari Ini"
          value={formatRupiah(today.purchase)}
          subtitle="Total beli hari ini"
          icon={<ArrowDownLeft size={18} />}
        />
        <KpiCard
          title="Utang"
          value={formatRupiah(rp.totalUtang)}
          subtitle={`${rp.countUtang} belum lunas`}
          icon={<AlertCircle size={18} />}
          accent
        />
      </div>

    </div>
  )
}
