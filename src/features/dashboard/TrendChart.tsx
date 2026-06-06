import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from 'recharts'
import type { TrendPoint } from './useDashboardData'

interface TrendChartProps {
  data: TrendPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div style={{
      background: 'var(--md-surface-container-lowest)',
      borderRadius: 'var(--shape-xl)',
      border: '1px solid var(--md-outline-variant)',
      padding: '20px',
      boxShadow: 'var(--elevation-1)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--md-on-surface-variant)',
          marginBottom: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Performa Bisnis
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--md-on-surface)',
        }}>
          Trend Profit
        </div>
      </div>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--md-primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--md-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--md-outline-variant)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: 'var(--md-on-surface-variant)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: 'var(--md-surface-container-high)',
                border: '1px solid var(--md-outline-variant)',
                borderRadius: 'var(--shape-lg)',
                color: 'var(--md-on-surface)',
                fontSize: 13,
                boxShadow: 'var(--elevation-2)',
              }}
            />

            <Area
              type="monotone"
              dataKey="profit"
              stroke="var(--md-primary)"
              strokeWidth={2.5}
              fill="url(#profitGrad)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--md-primary)', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
