// ═══════════════════════════════════════════════════
// features/settings/OrgSettings.tsx
// Pengaturan nama toko, tagline, dan rekening bank
// Data disimpan ke Dexie settings table (key-value)
// ═══════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { Store, CreditCard, Save } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/database'
import { useUiStore } from '@/state/uiStore'

// ─── Setting keys ────────────────────────────────────────────
export const SETTING_KEYS = {
  ORG_NAME:       'org.name',
  ORG_TAGLINE:    'org.tagline',
  ORG_PHONE:      'org.phone',
  ORG_ADDRESS:    'org.address',
  BANK_NAME:      'bank.name',
  BANK_ACCOUNT_NO:'bank.accountNo',
  BANK_ACCOUNT_NAME:'bank.accountName',
} as const

// ─── Helper ──────────────────────────────────────────────────


async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value })
}

// ─── Hook untuk membaca semua settings org ───────────────────
export function useOrgSettings() {
  const rows = useLiveQuery(() => db.settings.toArray(), [])
  if (!rows) return null
  const map = new Map(rows.map(r => [r.key, r.value]))
  return {
    orgName:         map.get(SETTING_KEYS.ORG_NAME)        ?? '',
    orgTagline:      map.get(SETTING_KEYS.ORG_TAGLINE)     ?? '',
    orgPhone:        map.get(SETTING_KEYS.ORG_PHONE)       ?? '',
    orgAddress:      map.get(SETTING_KEYS.ORG_ADDRESS)     ?? '',
    bankName:        map.get(SETTING_KEYS.BANK_NAME)       ?? '',
    bankAccountNo:   map.get(SETTING_KEYS.BANK_ACCOUNT_NO) ?? '',
    bankAccountName: map.get(SETTING_KEYS.BANK_ACCOUNT_NAME) ?? '',
  }
}

// ─── Komponen ─────────────────────────────────────────────────

interface FormState {
  orgName:         string
  orgTagline:      string
  orgPhone:        string
  orgAddress:      string
  bankName:        string
  bankAccountNo:   string
  bankAccountName: string
}

const EMPTY: FormState = {
  orgName:'', orgTagline:'', orgPhone:'', orgAddress:'',
  bankName:'', bankAccountNo:'', bankAccountName:'',
}

export function OrgSettings() {
  const settings = useOrgSettings()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const { toast } = useUiStore()

  // Sync form dari DB saat settings pertama kali load
  useEffect(() => {
    if (!settings) return
    setForm({
      orgName:         settings.orgName,
      orgTagline:      settings.orgTagline,
      orgPhone:        settings.orgPhone,
      orgAddress:      settings.orgAddress,
      bankName:        settings.bankName,
      bankAccountNo:   settings.bankAccountNo,
      bankAccountName: settings.bankAccountName,
    })
  }, [settings === null]) // hanya saat transisi null → data

  function set(key: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSave() {
    if (form.orgName.trim().length < 2) {
      toast('error', 'Nama toko minimal 2 karakter')
      return
    }
    if (form.orgName.trim().length > 60) {
      toast('error', 'Nama toko maksimal 60 karakter')
      return
    }
    setSaving(true)
    try {
      await Promise.all([
        setSetting(SETTING_KEYS.ORG_NAME,          form.orgName.trim()),
        setSetting(SETTING_KEYS.ORG_TAGLINE,        form.orgTagline.trim()),
        setSetting(SETTING_KEYS.ORG_PHONE,          form.orgPhone.trim()),
        setSetting(SETTING_KEYS.ORG_ADDRESS,        form.orgAddress.trim()),
        setSetting(SETTING_KEYS.BANK_NAME,          form.bankName.trim()),
        setSetting(SETTING_KEYS.BANK_ACCOUNT_NO,    form.bankAccountNo.trim()),
        setSetting(SETTING_KEYS.BANK_ACCOUNT_NAME,  form.bankAccountName.trim()),
      ])
      toast('success', 'Pengaturan disimpan')
    } catch {
      toast('error', 'Gagal menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>

      {/* Informasi Toko */}
      <Section icon={<Store size={16} color="var(--green)" />} title="Informasi Toko">
        <Field label="Nama Toko *" value={form.orgName} onChange={set('orgName')} placeholder="Toko Makmur Jaya" maxLength={60} />
        <Field label="Tagline / Slogan" value={form.orgTagline} onChange={set('orgTagline')} placeholder="Terpercaya sejak 2010" maxLength={100} />
        <Field label="Nomor Telepon" value={form.orgPhone} onChange={set('orgPhone')} placeholder="08123456789" type="tel" />
        <AreaField label="Alamat" value={form.orgAddress} onChange={set('orgAddress')} placeholder="Jl. Merdeka No. 1, Surabaya" />
      </Section>

      {/* Rekening Bank */}
      <Section icon={<CreditCard size={16} color="var(--amber)" />} title="Rekening Bank Toko">
        <div style={{ fontSize:11, color:'var(--stone)', marginBottom:8, fontWeight:600 }}>
          Ditampilkan di nota penjualan agar customer bisa transfer ke rekening ini.
        </div>
        <Field label="Nama Bank" value={form.bankName} onChange={set('bankName')} placeholder="BRI / BCA / Mandiri" maxLength={40} />
        <Field label="Nomor Rekening" value={form.bankAccountNo} onChange={set('bankAccountNo')} placeholder="1234567890" type="text" inputMode="numeric" />
        <Field label="Nama Pemilik Rekening" value={form.bankAccountName} onChange={set('bankAccountName')} placeholder="Budi Santoso" maxLength={60} />
      </Section>

      {/* Tombol simpan */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          width:'100%', padding:'13px',
          borderRadius:'var(--r)', border:'none', cursor: saving ? 'not-allowed' : 'pointer',
          background: saving ? 'var(--stone)' : 'var(--green)',
          color:'#fff', fontSize:14, fontWeight:800, fontFamily:'inherit',
          transition:'background 0.15s',
        }}
      >
        <Save size={16} />
        {saving ? 'Menyimpan…' : 'Simpan Pengaturan'}
      </button>
    </div>
  )
}

// ─── Sub-komponen ─────────────────────────────────────────────

function Section({ icon, title, children }: { icon:React.ReactNode; title:string; children:React.ReactNode }) {
  return (
    <div style={{ background:'#fff', borderRadius:'var(--r-lg)', border:'1.5px solid #e8f0e8', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderBottom:'1px solid #f0f5f0', background:'#fafaf9' }}>
        {icon}
        <span style={{ fontSize:13, fontWeight:800, color:'var(--soil)' }}>{title}</span>
      </div>
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type='text', maxLength, inputMode }: {
  label:string; value:string; onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
  placeholder?:string; type?:string; maxLength?:number; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  return (
    <div>
      <label style={{ fontSize:11, fontWeight:700, color:'var(--stone)', display:'block', marginBottom:4 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        style={{
          width:'100%', padding:'10px 12px',
          borderRadius:'var(--r-sm)', border:'1.5px solid #e8f0e8',
          fontSize:13, fontWeight:600, color:'var(--soil)',
          background:'#fff', outline:'none', fontFamily:'inherit',
          boxSizing:'border-box',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--green)')}
        onBlur={e  => (e.target.style.borderColor = '#e8f0e8')}
      />
    </div>
  )
}

function AreaField({ label, value, onChange, placeholder }: {
  label:string; value:string; onChange:(e:React.ChangeEvent<HTMLTextAreaElement>)=>void; placeholder?:string
}) {
  return (
    <div>
      <label style={{ fontSize:11, fontWeight:700, color:'var(--stone)', display:'block', marginBottom:4 }}>{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={2}
        style={{
          width:'100%', padding:'10px 12px', resize:'none',
          borderRadius:'var(--r-sm)', border:'1.5px solid #e8f0e8',
          fontSize:13, fontWeight:600, color:'var(--soil)',
          background:'#fff', outline:'none', fontFamily:'inherit',
          boxSizing:'border-box',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--green)')}
        onBlur={e  => (e.target.style.borderColor = '#e8f0e8')}
      />
    </div>
  )
}
