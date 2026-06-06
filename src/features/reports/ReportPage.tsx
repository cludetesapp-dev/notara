// ═══════════════════════════════════════════════════
// features/reports/ReportPage.tsx
// Halaman Laporan — tab: Harian | Bulanan | Tahunan
// ═══════════════════════════════════════════════════

import { useState } from 'react'
import { DailyReport }   from './DailyReport'
import { MonthlyReport } from './MonthlyReport'
import { YearlyReport }  from './YearlyReport'

type Tab = 'daily' | 'monthly' | 'yearly'

const TABS: { key: Tab; label: string }[] = [
  { key: 'daily',   label: 'Harian' },
  { key: 'monthly', label: 'Bulanan' },
  { key: 'yearly',  label: 'Tahunan' },
]

export default function ReportPage() {
  const [tab, setTab] = useState<Tab>('daily')

  return (
    <>
      {/* Inline shimmer keyframe — dipakai oleh sub-komponen */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="page-scroll">
        <div className="wrap">

          {/* Tab bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            background: '#fff',
            borderRadius: 'var(--r-lg)',
            padding: 4,
            marginBottom: 12,
            border: '1.5px solid #e8f0e8',
            gap: 4,
          }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '8px 0',
                  borderRadius: 'var(--r-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: tab === t.key ? 800 : 600,
                  background: tab === t.key ? 'var(--green)' : 'transparent',
                  color: tab === t.key ? '#fff' : 'var(--stone)',
                  transition: 'background 0.15s, color 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Konten tab */}
          {tab === 'daily'   && <DailyReport />}
          {tab === 'monthly' && <MonthlyReport />}
          {tab === 'yearly'  && <YearlyReport />}

        </div>
      </div>
    </>
  )
}
