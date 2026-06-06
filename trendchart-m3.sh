#!/bin/bash

cat > src/features/dashboard/TrendChart.tsx <<'FILE'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip
} from 'recharts'

interface TrendChartProps {
  data: Array<{
    label: string
    revenue: number
    profit: number
  }>
}

export function TrendChart({
  data
}: TrendChartProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 28,
        border: '1px solid #E8EAED',
        padding: 20,
      }}
    >
      <div
        style={{
          marginBottom: 18,
        }}
      >
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
            letterSpacing: '-0.03em',
          }}
        >
          Trend Penjualan
        </div>
      </div>

      <div
        style={{
          height: 260,
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="profitGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#0B57D0"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="#0B57D0"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#EEF2F6"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{
                fill: '#5F6368',
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: '1px solid #E8EAED',
                boxShadow:
                  '0 8px 20px rgba(0,0,0,.08)',
              }}
            />

            <Area
              type="monotone"
              dataKey="profit"
              stroke="#0B57D0"
              strokeWidth={3}
              fill="url(#profitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
FILE

echo "TrendChart Material 3 installed"
