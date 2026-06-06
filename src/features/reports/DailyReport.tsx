// ═══════════════════════════════════════════════════
// features/reports/DailyReport.tsx
// Laporan Harian — pilih tanggal, lihat ringkasan + daftar transaksi
// ═══════════════════════════════════════════════════

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useDailyReport } from './useReportData'
import { formatRupiah, formatRupiahCompact, isoToday } from '@/utils/format'

// ─── Helpers ─────────────────────────────────────────────────

function prevDay(date: string): string {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function nextDay(date: string): string {
  const d = new Date(date)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function formatDateHeader(dateStr: string): string {
  const today = isoToday()
  const yesterday = prevDay(today)
  if (dateStr === today) return 'Hari Ini'
  if (dateStr === yesterday) return 'Kemarin'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const PAY_LABEL: Record<string, string> = {
  CASH:     'Tunai',
  TRANSFER: 'Transfer',
  DP:       'DP',
}

// ─── Skeleton ────────────────────────────────────────────────

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

// ─── Komponen Utama ──────────────────────────────────────────

export function DailyReport() {
  const [date, setDate] = useState(isoToday())
  const report = useDailyReport(date)
  const isToday = date === isoToday()

  return (
    <div>
      {/* Date navigator */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--md-surface-container-lowest)', borderRadius: 'var(--r-lg)',
        padding: '10px 14px', marginBottom: 10,
        border: '1.5px solid var(--md-outline-variant)',
      }}>
        <button
          onClick={() => setDate(prevDay(date))}
          style={{ background:'none', border:'none', cursor:'pointer', padding:4, color:'var(--clay)', display:'flex', alignItems:'center' }}
        >
          <ChevronLeft size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--soil)' }}>
            {formatDateHeader(date)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--stone)', fontWeight: 600, marginTop: 1 }}>
            {new Date(date).toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })}
          </div>
        </div>

        <button
          onClick={() => !isToday && setDate(nextDay(date))}
          style={{
            background:'none', border:'none', padding:4, display:'flex', alignItems:'center',
            cursor: isToday ? 'not-allowed' : 'pointer',
            color: isToday ? 'var(--border)' : 'var(--clay)',
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Input tanggal manual */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="date"
          value={date}
          max={isoToday()}
          onChange={e => e.target.value && setDate(e.target.value)}
          style={{
            width: '100%', padding: '9px 14px',
            borderRadius: 'var(--r)', border: '1.5px solid var(--md-outline-variant)',
            fontSize: 13, fontWeight: 600, color: 'var(--soil)',
            background: 'var(--md-surface-container-lowest)', outline: 'none',
          }}
        />
      </div>

      {report.loading ? (
        <><Shimmer h={100} /><Shimmer /><Shimmer /><Shimmer /></>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <SummCard label="Omset" value={formatRupiahCompact(report.omset)} color="var(--md-primary)" bg="var(--md-surface-container-low)" border="#bbf7d0" />
            <SummCard label="Laba" value={formatRupiahCompact(report.profit)} color="var(--md-primary)" bg="var(--md-surface-container-low)" border="#bbf7d0" />
            <SummCard label="Pembelian" value={formatRupiahCompact(report.purchase)} color="var(--md-secondary)" bg="var(--md-secondary-container)" border="transparent" />
            <SummCard label="Transaksi" value={`${report.txCount} nota`} color="var(--md-on-surface-variant)" bg="#fafaf9" border="var(--md-outline-variant)" mono={false} />
          </div>

          {/* Transaction list */}
          {report.transactions.length === 0 ? (
            <EmptyDay />
          ) : (
            <div style={{
              background: 'var(--md-surface-container-lowest)', borderRadius: 'var(--r-lg)',
              border: '1.5px solid var(--md-outline-variant)', overflow: 'hidden',
            }}>
              <div style={{ padding:'12px 14px 8px', fontSize:11, fontWeight:800, color:'var(--clay)', letterSpacing:'0.8px', textTransform:'uppercase' }}>
                Daftar Transaksi
              </div>
              {report.transactions.map((tx, i) => {
                const isSale = tx.type === 'SALE'
                return (
                  <div key={tx.id} style={{
                    display:'flex', alignItems:'center', gap:10,
                    padding:'10px 14px',
                    borderTop: i === 0 ? 'none' : '1px dashed var(--md-outline-variant)',
                  }}>
                    <div style={{
                      width:32, height:32, borderRadius:10, flexShrink:0,
                      background: isSale ? 'var(--green)' : 'var(--amber-pale)',
                      border: isSale ? 'none' : '1.5px solid var(--amber-border)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {isSale
                        ? <ArrowUpRight size={15} color="#fff" />
                        : <ArrowDownLeft size={15} color="var(--md-secondary)" />
                      }
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:800, color:'var(--soil)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {tx.partnerName}
                      </div>
                      <div style={{ fontSize:10, fontWeight:600, color:'var(--stone)', marginTop:1 }}>
                        {tx.code} · {PAY_LABEL[tx.payMethod] ?? tx.payMethod}
                        {isSale && tx.profit > 0 && (
                          <span style={{ color:'var(--green)', marginLeft:6 }}>
                            laba {formatRupiahCompact(tx.profit)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      fontSize:13, fontWeight:900,
                      fontFamily:'DM Mono, monospace',
                      color: isSale ? 'var(--green)' : 'var(--amber)',
                      flexShrink:0,
                    }}>
                      {isSale ? '+' : '−'}{formatRupiah(tx.total)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Sub-komponen ─────────────────────────────────────────────

function SummCard({
  label, value, color, bg, border, mono = true
}: { label:string; value:string; color:string; bg:string; border:string; mono?: boolean }) {
  return (
    <div style={{
      background: bg, borderRadius:'var(--r)', padding:'12px 14px',
      border: `1.5px solid ${border}`,
    }}>
      <div style={{ fontSize:9.5, fontWeight:700, color:'var(--stone)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>
        {label}
      </div>
      <div style={{ fontSize:17, fontWeight:900, color, fontFamily: mono ? 'DM Mono, monospace' : undefined }}>
        {value}
      </div>
    </div>
  )
}

function EmptyDay() {
  return (
    <div style={{
      background:'var(--md-surface-container-lowest)', borderRadius:'var(--r-lg)',
      border:'1.5px solid var(--md-outline-variant)',
      padding:'32px 20px', textAlign:'center',
    }}>
      <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
      <div style={{ fontSize:13, fontWeight:700, color:'var(--stone)' }}>Tidak ada transaksi</div>
      <div style={{ fontSize:11, color:'var(--stone)', marginTop:4 }}>Pilih tanggal lain untuk melihat laporan</div>
    </div>
  )
}
