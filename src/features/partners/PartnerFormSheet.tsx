// ═══════════════════════════════════════════════════
// features/partners/PartnerFormSheet.tsx
// Bottom sheet — tambah / edit mitra (Customer/Supplier)
// ═══════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { X, Users } from 'lucide-react'
import { usePartnerStore } from '@/state/partnerStore'
import { useUiStore }      from '@/state/uiStore'
import { ValidationError } from '@/core/errors'
import type { Partner, PartnerType } from '@/types/partner'

interface Props {
  open:         boolean
  partner:      Partner | null
  defaultType?: PartnerType
  onClose:      () => void
}

interface FormState {
  name:        string
  type:        PartnerType
  phone:       string
  address:     string
  bankName:    string
  accountNo:   string
  accountName: string
}

function toFormState(p: Partner): FormState {
  return {
    name:        p.name,
    type:        p.type,
    phone:       p.phone       ?? '',
    address:     p.address     ?? '',
    bankName:    p.bankName    ?? '',
    accountNo:   p.accountNo   ?? '',
    accountName: p.accountName ?? '',
  }
}

const PARTNER_TYPES: { value: PartnerType; label: string; desc: string }[] = [
  { value: 'CUSTOMER', label: 'Customer',  desc: 'Pembeli' },
  { value: 'SUPPLIER', label: 'Supplier',  desc: 'Pemasok' },
  { value: 'BOTH',     label: 'Keduanya',  desc: 'Beli & Jual' },
]

export function PartnerFormSheet({ open, partner, defaultType = 'CUSTOMER', onClose }: Props) {
  const isEdit = partner !== null
  const { create, update } = usePartnerStore()
  const toast = useUiStore(s => s.toast)

  const emptyForm: FormState = {
    name:'', type: defaultType, phone:'', address:'', bankName:'', accountNo:'', accountName:'',
  }

  const [form,    setForm]    = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [showBank, setShowBank] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(partner ? toFormState(partner) : { ...emptyForm, type: defaultType })
      setShowBank(partner ? !!(partner.accountNo) : false)
      setError(null)
    }
  }, [open, partner, defaultType])

  function set<K extends keyof FormState>(key: K, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setLoading(true)
    setError(null)
    try {
      const data = {
        name:        form.name.trim(),
        type:        form.type,
        phone:       form.phone.trim()       || undefined,
        address:     form.address.trim()     || undefined,
        bankName:    form.bankName.trim()    || undefined,
        accountNo:   form.accountNo.trim()   || undefined,
        accountName: form.accountName.trim() || undefined,
      }

      if (isEdit && partner) {
        await update(partner.id, data)
        toast('success', 'Mitra berhasil diperbarui')
      } else {
        await create(data)
        toast('success', 'Mitra berhasil ditambahkan')
      }
      onClose()
    } catch (e) {
      if (e instanceof ValidationError) setError(e.message)
      else setError('Gagal menyimpan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200, animation:'fadeIn 0.2s ease' }}
      />

      <div style={{
        position:'fixed', left:0, right:0, bottom:0,
        background:'#fff',
        borderRadius:'var(--r-lg) var(--r-lg) 0 0',
        zIndex:201, maxHeight:'92dvh', overflowY:'auto',
        animation:'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
        paddingBottom:'max(env(safe-area-inset-bottom, 0px), 16px)',
      }}>

        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:10, paddingBottom:4 }}>
          <div style={{ width:36, height:4, borderRadius:9, background:'#e0e0e0' }} />
        </div>

        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'10px 16px 14px', borderBottom:'1.5px solid var(--border)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{
              width:34, height:34, borderRadius:10,
              background:'#eff6ff',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Users size={17} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:'var(--soil)' }}>
                {isEdit ? 'Edit Mitra' : 'Tambah Mitra'}
              </div>
              <div style={{ fontSize:10, color:'var(--stone)', fontWeight:600 }}>
                Customer, Supplier, atau keduanya
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bar-btn" style={{ background:'#f5f5f5', color:'var(--clay)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding:'16px 16px 8px' }}>

          {error && (
            <div style={{
              background:'var(--red-pale)', border:'1.5px solid #fca5a5',
              borderRadius:'var(--r-sm)', padding:'10px 13px',
              fontSize:12.5, color:'var(--red)', fontWeight:700, marginBottom:12,
            }}>
              {error}
            </div>
          )}

          {/* Tipe mitra */}
          <div className="field">
            <label>Tipe Mitra *</label>
            <div style={{ display:'flex', gap:7 }}>
              {PARTNER_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => set('type', t.value)}
                  style={{
                    flex:1, padding:'9px 8px', border:'1.5px solid',
                    borderColor: form.type === t.value ? '#3b82f6' : 'var(--border)',
                    borderRadius:'var(--r-sm)', background: form.type === t.value ? '#eff6ff' : 'var(--cream)',
                    cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s',
                  }}
                >
                  <div style={{ fontSize:11, fontWeight:800, color: form.type === t.value ? '#3b82f6' : 'var(--clay)' }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize:9.5, color:'var(--stone)', fontWeight:600, marginTop:1 }}>
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Nama *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Nama customer atau supplier"
              autoFocus={!isEdit}
            />
          </div>

          <div className="field">
            <label>No. HP / WhatsApp</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="08xx-xxxx-xxxx"
            />
          </div>

          <div className="field">
            <label>Alamat</label>
            <textarea
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Jl. contoh no. 1, Kota..."
              rows={2}
              style={{ resize:'none' }}
            />
          </div>

          {/* Rekening bank — opsional */}
          <div style={{ marginBottom:10 }}>
            <button
              onClick={() => setShowBank(b => !b)}
              style={{
                width:'100%', padding:'10px 13px',
                border:'1.5px dashed', borderColor: showBank ? '#3b82f6' : 'var(--border)',
                borderRadius:'var(--r-sm)', background: showBank ? '#eff6ff' : 'transparent',
                cursor:'pointer', fontFamily:'inherit',
                display:'flex', alignItems:'center', justifyContent:'space-between',
              }}
            >
              <span style={{ fontSize:12, fontWeight:700, color: showBank ? '#3b82f6' : 'var(--stone)' }}>
                🏦 {showBank ? 'Rekening Bank (terisi)' : 'Tambah rekening bank (opsional)'}
              </span>
              <span style={{ fontSize:11, color:'var(--stone)' }}>{showBank ? '▲' : '▼'}</span>
            </button>
          </div>

          {showBank && (
            <div style={{ background:'#f8faff', border:'1.5px solid #dbeafe', borderRadius:'var(--r-sm)', padding:'12px', marginBottom:10 }}>
              <div className="field" style={{ marginBottom:8 }}>
                <label>Nama Bank</label>
                <input
                  value={form.bankName}
                  onChange={e => set('bankName', e.target.value)}
                  placeholder="BRI, BCA, Mandiri..."
                />
              </div>
              <div className="field-row">
                <div className="field" style={{ marginBottom:0 }}>
                  <label>No. Rekening</label>
                  <input
                    value={form.accountNo}
                    onChange={e => set('accountNo', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                <div className="field" style={{ marginBottom:0 }}>
                  <label>Atas Nama</label>
                  <input
                    value={form.accountName}
                    onChange={e => set('accountName', e.target.value)}
                    placeholder="Nama pemilik rekening"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading || !form.name.trim()}
            style={{ marginTop:4 }}
          >
            {loading ? <span className="spin" /> : isEdit ? 'Simpan Perubahan' : 'Tambah Mitra'}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
