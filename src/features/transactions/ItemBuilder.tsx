import { useState, useRef } from 'react'
import { Plus, ShoppingBag } from 'lucide-react'
import { formatRupiah } from '@/utils/format'
import type { Product } from '@/types/product'

interface Props {
  products:  Product[]
  type:      'SALE' | 'PURCHASE'
  onAdd:     (product: Product, qty: number, price: number) => void
}

export function ItemBuilder({ products, type, onAdd }: Props) {
  const [query,    setQuery]    = useState('')
  const [suggest,  setSuggest]  = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [qty,      setQty]      = useState(1)
  const [price,    setPrice]    = useState('')
  const inputRef                = useRef<HTMLInputElement>(null)

  const filtered = products
    .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6)

  const displayPrice  = price !== '' ? parseInt(price.replace(/\D/g, '') || '0', 10) : 0
  const defaultPrice  = selected ? (type === 'SALE' ? selected.sellPrice : selected.buyPrice) : 0
  const activePrice   = price !== '' ? displayPrice : defaultPrice
  const previewSub    = activePrice * qty

  function pickProduct(p: Product) {
    setSelected(p)
    setQuery(p.name)
    setSuggest(false)
    setPrice('')
    setQty(1)
  }

  function handleAdd() {
    if (!selected) return
    const finalPrice = price !== '' ? displayPrice : defaultPrice
    onAdd(selected, qty, finalPrice)
    // Reset
    setSelected(null)
    setQuery('')
    setPrice('')
    setQty(1)
    inputRef.current?.focus()
  }

  function fmtPrice(val: string): string {
    const num = val.replace(/\D/g, '')
    return num ? parseInt(num, 10).toLocaleString('id-ID') : ''
  }

  return (
    <div className="item-builder-box">
      <div className="builder-title">
        <ShoppingBag size={12} />
        Tambah Item
      </div>

      {/* Produk search */}
      <div className="field" style={{ position: 'relative' }}>
        <label>Produk</label>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Cari nama produk..."
          autoComplete="off"
          onChange={e => { setQuery(e.target.value); setSuggest(true); setSelected(null) }}
          onFocus={() => setSuggest(true)}
          onBlur={() => setTimeout(() => setSuggest(false), 200)}
          style={{ width: '100%', padding: '11px 13px', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontFamily: 'inherit', fontSize: '13.5px', color: 'var(--soil)', background: 'var(--cream)', outline: 'none' }}
        />
        {suggest && filtered.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 99,
            background: '#fff', border: '1.5px solid var(--green)',
            borderTop: 'none', borderRadius: '0 0 var(--r-sm) var(--r-sm)',
            boxShadow: '0 6px 16px rgba(0,0,0,.1)', maxHeight: 160, overflowY: 'auto',
          }}>
            {filtered.map(p => (
              <div key={p.id} onMouseDown={() => pickProduct(p)} style={{
                padding: '9px 14px', cursor: 'pointer', fontSize: 13,
                fontWeight: 700, color: 'var(--soil)',
                borderBottom: '1px solid #f5f5f5',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div>{p.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--stone)', fontWeight: 600 }}>
                    Stok: {p.stock} {p.unit}
                  </div>
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--green)', fontWeight: 800 }}>
                  {formatRupiah(type === 'SALE' ? p.sellPrice : p.buyPrice)}
                </div>
              </div>
            ))}
          </div>
        )}
        {suggest && filtered.length === 0 && query && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 99,
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: '0 0 var(--r-sm) var(--r-sm)',
            padding: '12px 14px', fontSize: 12, color: 'var(--stone)', textAlign: 'center',
          }}>
            Produk tidak ditemukan
          </div>
        )}
      </div>

      {/* Qty + Harga */}
      <div className="field-row" style={{ alignItems: 'end' }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Jumlah{selected ? ` (${selected.unit})` : ''}</label>
          <div className="qty-wrap">
            <button className="qty-btn" type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <input
              type="number"
              value={qty}
              min={1}
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              onFocus={e => e.target.select()}
            />
            <button className="qty-btn" type="button" onClick={() => setQty(q => q + 1)}>+</button>
          </div>
        </div>

        <div className="field" style={{ marginBottom: 0 }}>
          <label>Harga {type === 'SALE' ? 'Jual' : 'Beli'}</label>
          <div className="input-rp" style={{ height: 44, display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--cream)', transition: 'border-color .2s', position: 'relative' }}>
            <span className="pfx">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={price}
              placeholder={selected ? parseInt(defaultPrice.toString()).toLocaleString('id-ID') : '0'}
              onChange={e => setPrice(fmtPrice(e.target.value))}
              onFocus={e => e.target.select()}
              style={{ width: '100%', height: 44, border: 'none', background: 'transparent', padding: '0 12px 0 30px', fontFamily: 'inherit', fontSize: '13.5px', color: 'var(--soil)', outline: 'none', textAlign: 'right' }}
            />
          </div>
        </div>
      </div>

      {/* Preview subtotal */}
      <div className="preview-sub-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', padding: '7px 2px', marginTop: 8 }}>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Subtotal Item</span>
        <span style={{ fontSize: 14, fontWeight: 900, fontFamily: 'DM Mono, monospace', color: 'var(--green)' }}>
          {formatRupiah(previewSub)}
        </span>
      </div>

      <button
        className="btn-add-item"
        type="button"
        onClick={handleAdd}
        disabled={!selected}
      >
        <Plus size={13} /> Tambah ke Daftar
      </button>
    </div>
  )
}
