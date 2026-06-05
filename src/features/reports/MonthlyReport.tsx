// ═══════════════════════════════════════════════════
// features/reports/MonthlyReport.tsx
// Laporan Bulanan — ringkasan, heatmap harian, top produk
// ═══════════════════════════════════════════════════

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { useMonthlyReport } from './useReportData'
import { formatRupiah, formatRupiahCompact } from '@/utils/format'

const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAY_LABELS  = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

function Shimmer({ h = 56 }: { h?: number }) {
  return (
    <div style={{
      background: 'linear-gradient(90deg,#e8f0e8 25%,#f0fdf4 50%,#e8f0e8 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      borderRadius: 'var(--r)',
      height: h, marginBottom: 8,
    }} />
  )
}

export function MonthlyReport() {
  const now   = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const report = useMonthlyReport(year, month)

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1
    if (isCurrentMonth) return
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <div>
      {/* Month navigator */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:'#fff', borderRadius:'var(--r-lg)',
        padding:'10px 14px', marginBottom:10,
        border:'1.5px solid #e8f0e8',
      }}>
        <button onClick={prevMonth} style={{ background:'none', border:'none', cursor:'pointer', padding:4, color:'var(--clay)', display:'flex', alignItems:'center' }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:15, fontWeight:800, color:'var(--soil)' }}>{MONTH_NAMES[month-1]}</div>
          <div style={{ fontSize:11, color:'var(--stone)', fontWeight:600 }}>{year}</div>
        </div>
        <button
          onClick={nextMonth}
          style={{ background:'none', border:'none', padding:4, display:'flex', alignItems:'center', cursor: isCurrentMonth ? 'not-allowed' : 'pointer', color: isCurrentMonth ? 'var(--border)' : 'var(--clay)' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {report.loading ? (
        <><Shimmer h={100} /><Shimmer h={180} /><Shimmer h={200} /></>
      ) : (
        <>
          {/* Summary */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div style={{ background:'linear-gradient(135deg, var(--green) 0%, #16a34a 100%)', borderRadius:'var(--r-lg)', padding:'16px 14px', gridColumn:'1/-1' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:4 }}>
                Omset {MONTH_NAMES[month-1]}
              </div>
              <div style={{ fontSize:26, fontWeight:900, color:'#fff', fontFamily:'DM Mono, monospace' }}>
                {formatRupiahCompact(report.omset)}
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:4, fontWeight:600 }}>
                Laba: {formatRupiahCompact(report.profit)} · {report.txCount} nota penjualan
              </div>
            </div>
            <StatCard label="Pembelian" value={formatRupiahCompact(report.purchase)} sub="Total ke supplier" color="var(--amber)" bg="#fffbeb" border="#fde68a" />
            <StatCard label="Nota Penjualan" value={`${report.txCount}`} sub="transaksi" color="var(--clay)" bg="#fafaf9" border="#e8f0e8" mono={false} />
          </div>

          {/* Heatmap harian */}
          <DailyHeatmap data={report.dailySummary} year={year} month={month} />

          {/* Top produk */}
          {report.topProducts.length > 0 && (
            <div style={{
              background:'#fff', borderRadius:'var(--r-lg)',
              border:'1.5px solid #e8f0e8', overflow:'hidden', marginBottom:10,
            }}>
              <div style={{ padding:'12px 14px 6px', fontSize:11, fontWeight:800, color:'var(--clay)', letterSpacing:'0.8px', textTransform:'uppercase' }}>
                Top Produk Bulan Ini
              </div>
              {report.topProducts.map((p, i) => (
                <div key={p.productId} style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'9px 14px',
                  borderTop: i === 0 ? 'none' : '1px dashed #f0f5f0',
                }}>
                  <div style={{ width:22, height:22, borderRadius:7, background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'var(--green)', flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ width:28, height:28, borderRadius:9, background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Package size={14} color="var(--green)" />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:'var(--soil)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {p.productName}
                    </div>
                    <div style={{ fontSize:10, color:'var(--stone)', fontWeight:600 }}>
                      {p.qty} {p.unit} · laba {formatRupiahCompact(p.profit)}
                    </div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:800, fontFamily:'DM Mono, monospace', color:'var(--green)', flexShrink:0 }}>
                    {formatRupiahCompact(p.omset)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {report.txCount === 0 && (
            <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1.5px solid #e8f0e8', padding:'32px 20px', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📊</div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--stone)' }}>Belum ada penjualan bulan ini</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Heatmap harian ──────────────────────────────────────────

function DailyHeatmap({ data, year, month }: {
  data: { date: string; omset: number; profit: number }[]
  year: number
  month: number
}) {
  const maxOmset = Math.max(...data.map(d => d.omset), 1)
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=Min

  // Opacity scale berdasarkan omset relatif
  function opacity(omset: number) {
    if (omset === 0) return 0
    return 0.15 + (omset / maxOmset) * 0.85
  }

  return (
    <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1.5px solid #e8f0e8', padding:'12px 14px', marginBottom:10 }}>
      <div style={{ fontSize:11, fontWeight:800, color:'var(--clay)', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:10 }}>
        Aktivitas Harian
      </div>

      {/* Header hari */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3, marginBottom:3 }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ fontSize:9, fontWeight:700, color:'var(--stone)', textAlign:'center' }}>{d}</div>
        ))}
      </div>

      {/* Grid tanggal */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3 }}>
        {/* Padding awal bulan */}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {data.map((d, i) => {
          const day = i + 1
          const alpha = opacity(d.omset)
          const bg = alpha === 0
            ? '#f8faf8'
            : `rgba(22, 101, 52, ${alpha})`
          const textColor = alpha > 0.5 ? '#fff' : 'var(--stone)'
          return (
            <div
              key={d.date}
              title={d.omset > 0 ? `${day}: ${formatRupiah(d.omset)}` : `${day}: tidak ada transaksi`}
              style={{
                aspectRatio:'1', borderRadius:6, background:bg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:9, fontWeight:700, color:textColor,
                cursor: d.omset > 0 ? 'default' : 'default',
                transition:'background 0.15s',
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:8, justifyContent:'flex-end' }}>
        <div style={{ fontSize:9, color:'var(--stone)', fontWeight:600 }}>Rendah</div>
        {[0.1, 0.3, 0.55, 0.75, 1].map(o => (
          <div key={o} style={{ width:12, height:12, borderRadius:3, background:`rgba(22,101,52,${o})` }} />
        ))}
        <div style={{ fontSize:9, color:'var(--stone)', fontWeight:600 }}>Tinggi</div>
      </div>
    </div>
  )
}

// ─── Sub-komponen ─────────────────────────────────────────────

function StatCard({ label, value, sub, color, bg, border, mono = true }: {
  label:string; value:string; sub:string; color:string; bg:string; border:string; mono?:boolean
}) {
  return (
    <div style={{ background:bg, borderRadius:'var(--r)', padding:'12px 14px', border:`1.5px solid ${border}` }}>
      <div style={{ fontSize:9.5, fontWeight:700, color:'var(--stone)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:17, fontWeight:900, color, fontFamily: mono ? 'DM Mono, monospace' : undefined }}>{value}</div>
      <div style={{ fontSize:9, color:'var(--stone)', marginTop:2, fontWeight:600 }}>{sub}</div>
    </div>
  )
}
