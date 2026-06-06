// ═══════════════════════════════════════════════════
// features/reports/YearlyReport.tsx
// Laporan Tahunan — ringkasan 12 bulan + bar chart
// ═══════════════════════════════════════════════════

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { useYearlyReport } from './useReportData'
import { formatRupiahCompact } from '@/utils/format'

function Shimmer({ h = 56 }: { h?: number }) {
  return (
    <div style={{
      background: 'linear-gradient(90deg,var(--md-outline-variant) 25%,var(--md-surface-container-low) 50%,var(--md-outline-variant) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      borderRadius: 'var(--r)',
      height: h, marginBottom: 8,
    }} />
  )
}

function CustomTooltip({ active, payload, label }: {
  active?:  boolean
  payload?: { name: string; value: number; color: string }[]
  label?:   string
}) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--soil)', borderRadius:10, padding:'8px 12px', boxShadow:'0 4px 12px rgba(0,0,0,0.25)' }}>
      <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.6)', marginBottom:4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize:11, fontWeight:800, color:p.color, fontFamily:'DM Mono, monospace' }}>
          {p.name === 'omset' ? 'Omset' : p.name === 'profit' ? 'Laba' : 'Beli'}: {formatRupiahCompact(p.value)}
        </div>
      ))}
    </div>
  )
}

export function YearlyReport() {
  const now  = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const report = useYearlyReport(year)

  const isCurrentYear = year === now.getFullYear()

  return (
    <div>
      {/* Year navigator */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'var(--md-surface-container-lowest)', borderRadius:'var(--r-lg)',
        padding:'10px 14px', marginBottom:10,
        border:'1.5px solid var(--md-outline-variant)',
      }}>
        <button onClick={() => setYear(y => y - 1)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, color:'var(--clay)', display:'flex', alignItems:'center' }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ fontSize:16, fontWeight:800, color:'var(--soil)' }}>{year}</div>
        <button
          onClick={() => !isCurrentYear && setYear(y => y + 1)}
          style={{ background:'none', border:'none', padding:4, display:'flex', alignItems:'center', cursor: isCurrentYear ? 'not-allowed' : 'pointer', color: isCurrentYear ? 'var(--border)' : 'var(--clay)' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {report.loading ? (
        <><Shimmer h={108} /><Shimmer h={200} /><Shimmer h={240} /></>
      ) : (
        <>
          {/* Hero card */}
          <div style={{
            background: 'var(--md-primary)',
            borderRadius: 'var(--r-lg)', padding: '20px', marginBottom:10,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:-30, bottom:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
            <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6 }}>
              Total Omset {year}
            </div>
            <div style={{ fontSize:28, fontWeight:900, color:'#fff', fontFamily:'DM Mono, monospace' }}>
              {formatRupiahCompact(report.omset)}
            </div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:4, fontWeight:600 }}>
              Laba: {formatRupiahCompact(report.profit)} · Pembelian: {formatRupiahCompact(report.purchase)} · {report.txCount} nota
            </div>
          </div>

          {/* Bar chart omset + laba per bulan */}
          <div style={{ background:'var(--md-surface-container-lowest)', borderRadius:'var(--r-lg)', border:'1.5px solid var(--md-outline-variant)', padding:'14px 14px 10px', marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:800, color:'var(--clay)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:12 }}>
              Omset & Laba per Bulan
            </div>
            {report.omset === 0 ? (
              <div style={{ textAlign:'center', padding:'24px 0', color:'var(--stone)', fontSize:12, fontWeight:600 }}>Belum ada data</div>
            ) : (
              <div style={{ height:150 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.months} barCategoryGap="28%" barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--md-outline-variant)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize:9, fontWeight:700, fill:'var(--stone)' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => formatRupiahCompact(v as number)} tick={{ fontSize:8, fill:'var(--stone)' }} axisLine={false} tickLine={false} width={44} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(22,101,52,0.05)' }} />
                    <Bar dataKey="omset"  fill="var(--md-primary-container)" radius={[3,3,0,0]} name="omset" />
                    <Bar dataKey="profit" fill="var(--md-primary)" radius={[3,3,0,0]} name="profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Tabel bulanan */}
          <div style={{ background:'var(--md-surface-container-lowest)', borderRadius:'var(--r-lg)', border:'1.5px solid var(--md-outline-variant)', overflow:'hidden', marginBottom:10 }}>
            <div style={{ padding:'12px 14px 6px', fontSize:11, fontWeight:800, color:'var(--clay)', letterSpacing:'0.8px', textTransform:'uppercase' }}>
              Ringkasan Per Bulan
            </div>

            {/* Header tabel */}
            <div style={{
              display:'grid', gridTemplateColumns:'60px 1fr 1fr 1fr',
              padding:'6px 14px', background:'var(--md-surface-container)',
              borderBottom:'1px solid var(--md-outline-variant)',
            }}>
              {['Bulan','Omset','Laba','Nota'].map(h => (
                <div key={h} style={{ fontSize:9, fontWeight:700, color:'var(--stone)', textTransform:'uppercase', letterSpacing:'0.5px', textAlign: h === 'Bulan' ? 'left' : 'right' }}>{h}</div>
              ))}
            </div>

            {report.months.map((m, i) => {
              const isEmpty = m.omset === 0 && m.purchase === 0
              return (
                <div
                  key={m.month}
                  style={{
                    display:'grid', gridTemplateColumns:'60px 1fr 1fr 1fr',
                    padding:'9px 14px',
                    borderTop: i === 0 ? 'none' : '1px dashed var(--md-outline-variant)',
                    opacity: isEmpty ? 0.4 : 1,
                  }}
                >
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--soil)' }}>{m.label}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:'var(--green)', fontFamily:'DM Mono, monospace', textAlign:'right' }}>
                    {m.omset > 0 ? formatRupiahCompact(m.omset) : '—'}
                  </div>
                  <div style={{ fontSize:12, fontWeight:800, color:'var(--clay)', fontFamily:'DM Mono, monospace', textAlign:'right' }}>
                    {m.profit > 0 ? formatRupiahCompact(m.profit) : '—'}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--stone)', textAlign:'right' }}>
                    {m.txCount > 0 ? m.txCount : '—'}
                  </div>
                </div>
              )
            })}

            {/* Total row */}
            <div style={{
              display:'grid', gridTemplateColumns:'60px 1fr 1fr 1fr',
              padding:'10px 14px',
              borderTop:'2px solid var(--md-outline-variant)',
              background:'var(--md-surface-container-low)',
            }}>
              <div style={{ fontSize:11, fontWeight:800, color:'var(--green)' }}>TOTAL</div>
              <div style={{ fontSize:12, fontWeight:900, color:'var(--green)', fontFamily:'DM Mono, monospace', textAlign:'right' }}>
                {formatRupiahCompact(report.omset)}
              </div>
              <div style={{ fontSize:12, fontWeight:900, color:'var(--clay)', fontFamily:'DM Mono, monospace', textAlign:'right' }}>
                {formatRupiahCompact(report.profit)}
              </div>
              <div style={{ fontSize:12, fontWeight:800, color:'var(--green)', textAlign:'right' }}>
                {report.txCount}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
