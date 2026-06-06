// ═══════════════════════════════════════════════════
// features/settings/ThemeToggle.tsx
// Toggle light/dark/system mode
// Simpan preferensi ke localStorage (bukan Dexie — UI preference only)
// ═══════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'notara.theme'

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(mode: ThemeMode) {
  const isDark = mode === 'dark' || (mode === 'system' && getSystemDark())
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

export function useThemeMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  return (stored as ThemeMode) ?? 'light'
}

// Inisialisasi tema saat modul dimuat (sebelum React render)
;(function initTheme() {
  const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? 'light'
  applyTheme(stored)
})()

const OPTIONS: { mode: ThemeMode; label: string; sub: string; icon: React.ReactNode }[] = [
  { mode:'light',  label:'Terang',  sub:'Selalu gunakan mode terang',  icon:<Sun   size={18}/> },
  { mode:'dark',   label:'Gelap',   sub:'Selalu gunakan mode gelap',   icon:<Moon  size={18}/> },
  { mode:'system', label:'Sistem',  sub:'Ikuti pengaturan perangkat',  icon:<Monitor size={18}/> },
]

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return (stored as ThemeMode) ?? 'light'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    applyTheme(mode)

    // Ikuti perubahan system preference saat mode === 'system'
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  return (
    <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1.5px solid #e8f0e8', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderBottom:'1px solid #f0f5f0', background:'#fafaf9' }}>
        <Sun size={16} color="var(--amber)" />
        <span style={{ fontSize:13, fontWeight:800, color:'var(--soil)' }}>Tampilan</span>
      </div>

      <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
        {OPTIONS.map(opt => {
          const active = mode === opt.mode
          return (
            <button
              key={opt.mode}
              onClick={() => setMode(opt.mode)}
              style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'11px 12px', borderRadius:'var(--r-sm)',
                border: active ? '1.5px solid var(--green)' : '1.5px solid #e8f0e8',
                background: active ? 'var(--green-pale)' : '#fff',
                cursor:'pointer', fontFamily:'inherit', textAlign:'left',
                transition:'border-color 0.15s, background 0.15s',
                width:'100%',
              }}
            >
              <div style={{
                width:36, height:36, borderRadius:10, flexShrink:0,
                background: active ? 'var(--green)' : '#f0f5f0',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: active ? '#fff' : 'var(--stone)',
                transition:'background 0.15s, color 0.15s',
              }}>
                {opt.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight: active ? 800 : 600, color: active ? 'var(--green)' : 'var(--soil)' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize:10, color:'var(--stone)', fontWeight:600, marginTop:1 }}>
                  {opt.sub}
                </div>
              </div>
              {active && (
                <div style={{
                  width:18, height:18, borderRadius:'50%',
                  background:'var(--green)', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
