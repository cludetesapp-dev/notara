import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import type { TrendPoint } from './useDashboardData'
import { formatRupiahCompact } from '@/utils/format'

interface Props {
  data: TrendPoint[]
}

// Custom tooltip agar rupiah-friendly
function CustomTooltip({ active, payload, label }: {
  active?:  boolean
  payload?: { name: string; value: number; color: string }[]
  label?:   string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--soil)',
      borderRadius: 10,
      padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 11, fontWeight: 800, color: p.color, fontFamily: 'DM Mono, monospace' }}>
          {p.name}: {formatRupiahCompact(p.value)}
        </div>
      ))}
    </div>
  )
}

export function TrendChart({ data }: Props) {
  const isEmpty = data.every(d => d.omset === 0 && d.profit === 0)

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--r-lg)',
        padding: '14px 14px 10px',
        border: '1.5px solid #e8f0e8',
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--clay)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>
        Omset 7 Hari Terakhir
      </div>

      {isEmpty ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--stone)', fontSize: 12, fontWeight: 600 }}>
          Belum ada transaksi
        </div>
      ) : (
        <div style={{ height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="30%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f5f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--stone)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={v => formatRupiahCompact(v as number)}
                tick={{ fontSize: 9, fill: 'var(--stone)' }}
                axisLine={false}
                tickLine={false}
                width={46}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(22,101,52,0.05)' }} />
              <Legend
                wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 6 }}
                formatter={(v) => v === 'omset' ? 'Omset' : 'Laba'}
              />
              <Bar dataKey="omset"  fill="#4ade80" radius={[4, 4, 0, 0]} name="omset" />
              <Bar dataKey="profit" fill="#166534" radius={[4, 4, 0, 0]} name="profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
