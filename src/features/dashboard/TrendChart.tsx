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
