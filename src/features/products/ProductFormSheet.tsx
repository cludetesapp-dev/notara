// ═══════════════════════════════════════════════════
// features/products/ProductFormSheet.tsx
// Bottom sheet — tambah / edit produk
// ═══════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { X, Package } from 'lucide-react'
import { useProductStore } from '@/state/productStore'
import { useUiStore } from '@/state/uiStore'
import { ValidationError } from '@/core/errors'
import type { Product } from '@/types/product'

interface Props {
  open:    boolean
  product: Product | null   // null = mode tambah
  onClose: () => void
}

interface FormState {
  name:      string
  category:  string
  unit:      string
  buyPrice:  string
  sellPrice: string
  stock:     string
}

const EMPTY: FormState = {
  name:      '',
  category:  '',
  unit:      '',
  buyPrice:  '',
  sellPrice: '',
  stock:     '',
}

function toFormState(p: Product): FormState {
  return {
    name:      p.name,
    category:  p.category ?? '',
    unit:      p.unit,
    buyPrice:  String(p.buyPrice),
    sellPrice: String(p.sellPrice),
    stock:     String(p.stock),
  }
}

export function ProductFormSheet({ open, product, onClose }: Props) {
  const isEdit = product !== null
  const { create, update } = useProductStore()
  const toast = useUiStore(s => s.toast)

  const [form,    setForm]    = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  // Sync form saat sheet dibuka
  useEffect(() => {
    if (open) {
      setForm(product ? toFormState(product) : EMPTY)
      setError(null)
    }
  }, [open, product])

  function set<K extends keyof FormState>(key: K, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setLoading(true)
    setError(null)
    try {
      const data = {
        name:      form.name.trim(),
        category:  form.category.trim() || undefined,
        unit:      form.unit.trim(),
        buyPrice:  Number(form.buyPrice)  || 0,
        sellPrice: Number(form.sellPrice) || 0,
        stock:     Number(form.stock)     || 0,
      }

      if (isEdit && product) {
        await update(product.id, data)
        toast('success', 'Barang berhasil diperbarui')
      } else {
        await create(data)
        toast('success', 'Barang berhasil ditambahkan')
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        background: '#fff',
        borderRadius: 'var(--r-lg) var(--r-lg) 0 0',
        zIndex: 201,
        maxHeight: '92dvh',
        overflowY: 'auto',
        animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
      }}>

        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:10, paddingBottom:4 }}>
          <div style={{ width:36, height:4, borderRadius:9, background:'#e0e0e0' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px 14px',
          borderBottom: '1.5px solid var(--border)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{
              width:34, height:34, borderRadius:10,
              background:'var(--green-muted)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Package size={17} color="var(--green)" />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:'var(--soil)' }}>
                {isEdit ? 'Edit Barang' : 'Tambah Barang'}
              </div>
              <div style={{ fontSize:10, color:'var(--stone)', fontWeight:600 }}>
                {isEdit ? 'Perbarui data barang' : 'Daftarkan barang baru'}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bar-btn" style={{ background:'#f5f5f5', color:'var(--clay)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '16px 16px 8px' }}>

          {error && (
            <div style={{
              background:'var(--red-pale)', border:'1.5px solid #fca5a5',
              borderRadius:'var(--r-sm)', padding:'10px 13px',
              fontSize:12.5, color:'var(--red)', fontWeight:700, marginBottom:12,
            }}>
              {error}
            </div>
          )}

          <div className="field">
            <label>Nama Barang *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Contoh: Beras Premium 5kg"
              autoFocus={!isEdit}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Kategori</label>
              <input
                value={form.category}
                onChange={e => set('category', e.target.value)}
                placeholder="Sembako, Pupuk..."
              />
            </div>
            <div className="field">
              <label>Satuan *</label>
              <input
                value={form.unit}
                onChange={e => set('unit', e.target.value)}
                placeholder="kg, pcs, ltr..."
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Harga Beli</label>
              <div className="input-rp">
                <span className="pfx">Rp</span>
                <input
                  type="number"
                  value={form.buyPrice}
                  onChange={e => set('buyPrice', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="field">
              <label>Harga Jual</label>
              <div className="input-rp">
                <span className="pfx">Rp</span>
                <input
                  type="number"
                  value={form.sellPrice}
                  onChange={e => set('sellPrice', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="field" style={{ maxWidth: 160 }}>
            <label>Stok Awal</label>
            <input
              type="number"
              value={form.stock}
              onChange={e => set('stock', e.target.value)}
              placeholder="0"
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading || !form.name.trim() || !form.unit.trim()}
            style={{ marginTop: 8 }}
          >
            {loading ? <span className="spin" /> : isEdit ? 'Simpan Perubahan' : 'Tambah Barang'}
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
