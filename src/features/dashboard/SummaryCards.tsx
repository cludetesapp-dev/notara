import { TrendingUp, ShoppingBag, Package, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatRupiahCompact, formatRupiah } from '@/utils/format'
import type { DailyStats, MonthlyStats, ReceivablePayable } from './useDashboardData'

interface Props {
  today: DailyStats
  month: MonthlyStats
  rp:    ReceivablePayable
}

export function SummaryCards({ today, month, rp }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>

      {/* Omset Hero Card — farm-v4 style gradient */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--green) 0%, var(--green-mid) 60%, #16a34a 100%)',
          borderRadius: 'var(--r-lg)',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative circles */}
        <div style={{ position:'absolute', right:-30, bottom:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
        <div style={{ position:'absolute', right:40, top:-20, width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6 }}>
          Omset Hari Ini
        </div>
        <div style={{ fontSize:28, fontWeight:900, color:'#fff', fontFamily:'DM Mono, monospace', position:'relative', zIndex:1 }}>
          {formatRupiahCompact(today.omset)}
        </div>
        <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:4, fontWeight:600 }}>
          Bulan ini: {formatRupiahCompact(month.omset)} &nbsp;·&nbsp; {month.txCount} transaksi
        </div>
      </div>

      {/* 2 stat cards — grid 2 kolom */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <StatCard
          icon={<TrendingUp size={16} color="var(--green)" />}
          label="Laba Hari Ini"
          value={formatRupiahCompact(today.profit)}
          sub={`Bulan: ${formatRupiahCompact(month.profit)}`}
          accentColor="var(--green)"
        />

        <StatCard
          icon={<ShoppingBag size={16} color="var(--green)" />}
          label="Transaksi"
          value={String(today.txCount)}
          sub={`Bulan: ${month.txCount} nota`}
          accentColor="var(--green)"
          valueMono={false}
        />
      </div>

      {/* Pembelian hari ini — full width */}
      <StatCard
        icon={<Package size={16} color="var(--amber)" />}
        label="Pembelian Hari Ini"
        value={formatRupiah(today.purchase)}
        sub="Total pengeluaran ke supplier"
        accentColor="var(--amber)"
        fullWidth
      />

      {/* Piutang & Utang — 2 kolom */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>

        {/* Piutang — customer masih utang ke kita */}
        <div
          style={{
            background: rp.totalPiutang > 0 ? '#f0fdf4' : '#fff',
            borderRadius: 'var(--r)',
            padding: '12px 14px',
            border: rp.totalPiutang > 0 ? '1.5px solid var(--green-border, #bbf7d0)' : '1.5px solid #e8f0e8',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
            <CheckCircle2 size={14} color="var(--green)" />
            <div style={{ fontSize:9.5, fontWeight:700, color:'var(--stone)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
              Piutang
            </div>
          </div>
          <div style={{ fontSize:16, fontWeight:900, color: rp.totalPiutang > 0 ? 'var(--green)' : 'var(--stone)', fontFamily:'DM Mono, monospace' }}>
            {rp.totalPiutang > 0 ? formatRupiahCompact(rp.totalPiutang) : '—'}
          </div>
          <div style={{ fontSize:9, color:'var(--stone)', marginTop:3, fontWeight:600 }}>
            {rp.countPiutang > 0 ? `${rp.countPiutang} nota belum lunas` : 'Semua sudah lunas'}
          </div>
        </div>

        {/* Utang — kita masih utang ke supplier */}
        <div
          style={{
            background: rp.totalUtang > 0 ? '#fff9f0' : '#fff',
            borderRadius: 'var(--r)',
            padding: '12px 14px',
            border: rp.totalUtang > 0 ? '1.5px solid #fed7aa' : '1.5px solid #e8f0e8',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:6 }}>
            <AlertCircle size={14} color="var(--amber)" />
            <div style={{ fontSize:9.5, fontWeight:700, color:'var(--stone)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
              Utang
            </div>
          </div>
          <div style={{ fontSize:16, fontWeight:900, color: rp.totalUtang > 0 ? 'var(--amber)' : 'var(--stone)', fontFamily:'DM Mono, monospace' }}>
            {rp.totalUtang > 0 ? formatRupiahCompact(rp.totalUtang) : '—'}
          </div>
          <div style={{ fontSize:9, color:'var(--stone)', marginTop:3, fontWeight:600 }}>
            {rp.countUtang > 0 ? `${rp.countUtang} nota belum lunas` : 'Tidak ada utang'}
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Sub-component ────────────────────────────────────────────
interface StatCardProps {
  icon:         React.ReactNode
  label:        string
  value:        string
  sub:          string
  accentColor:  string
  fullWidth?:   boolean
  valueMono?:   boolean
}

function StatCard({ icon, label, value, sub, accentColor: _accentColor, fullWidth, valueMono = true }: StatCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--r)',
        padding: '12px 14px',
        border: '1.5px solid #e8f0e8',
        gridColumn: fullWidth ? '1 / -1' : undefined,
        display: fullWidth ? 'flex' : 'block',
        alignItems: fullWidth ? 'center' : undefined,
        gap: fullWidth ? 12 : undefined,
      }}
    >
      <div style={{ marginBottom: fullWidth ? 0 : 6 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: fullWidth ? 15 : 17, fontWeight: 900, color: 'var(--soil)', fontFamily: valueMono ? 'DM Mono, monospace' : undefined }}>
          {value}
        </div>
        <div style={{ fontSize: 9, color: 'var(--stone)', marginTop: 2, fontWeight: 600 }}>
          {sub}
        </div>
      </div>
    </div>
  )
}
