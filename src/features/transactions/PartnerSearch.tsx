import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Plus } from 'lucide-react'
import type { Partner } from '@/types/partner'
import type { TransactionType } from '@/types/transaction'

interface Props {
  partners:        Partner[]
  type:            TransactionType
  selectedId:      string
  selectedName:    string
  onSelect:        (p: Partner) => void
  onCreateNew:     (name: string) => void
}

export function PartnerSearch({ partners, type, selectedId, selectedName, onSelect, onCreateNew }: Props) {
  const [query, setQuery]   = useState('')
  const [open,  setOpen]    = useState(false)
  const wrapRef             = useRef<HTMLDivElement>(null)

  // Filter by type
  const filtered = partners
    .filter(p => {
      if (type === 'SALE')     return p.type === 'CUSTOMER' || p.type === 'BOTH'
      if (type === 'PURCHASE') return p.type === 'SUPPLIER'  || p.type === 'BOTH'
      return true
    })
    .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)

  const label   = type === 'SALE' ? 'Customer' : 'Supplier'
  const display = selectedId ? selectedName : ''

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="field" ref={wrapRef} style={{ position: 'relative' }}>
      <label>{label}</label>
      <div
        onClick={() => { setOpen(v => !v); setQuery('') }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '11px 13px',
          border: `1.5px solid ${selectedId ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: 'var(--r-sm)',
          background: selectedId ? 'var(--green-pale)' : 'var(--cream)',
          cursor: 'pointer', transition: 'all .2s',
        }}
      >
        <span style={{ flex: 1, fontSize: 13.5, fontWeight: selectedId ? 700 : 400, color: selectedId ? 'var(--soil)' : '#c0bdb8' }}>
          {display || `Pilih ${label}...`}
        </span>
        <ChevronDown size={14} color="var(--stone)" />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 99,
          background: '#fff', border: '1.5px solid var(--green)',
          borderTop: 'none', borderRadius: '0 0 var(--r-sm) var(--r-sm)',
          boxShadow: '0 6px 16px rgba(0,0,0,.1)', maxHeight: 220, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={`Cari ${label}...`}
                style={{
                  width: '100%', padding: '7px 10px 7px 28px',
                  border: '1.5px solid var(--border)', borderRadius: 8,
                  fontFamily: 'inherit', fontSize: 13, outline: 'none',
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(p => (
              <div
                key={p.id}
                onClick={() => { onSelect(p); setOpen(false); setQuery('') }}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: 13.5,
                  fontWeight: p.id === selectedId ? 800 : 600,
                  color: 'var(--soil)',
                  background: p.id === selectedId ? 'var(--green-pale)' : 'transparent',
                  borderBottom: '1px solid #f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span>{p.name}</span>
                {p.phone && <span style={{ fontSize: 10, color: 'var(--stone)' }}>{p.phone}</span>}
              </div>
            ))}

            {/* Buat baru */}
            {query && filtered.length === 0 && (
              <div
                onClick={() => { onCreateNew(query); setOpen(false) }}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: 13,
                  fontWeight: 700, color: 'var(--green)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <Plus size={14} /> Buat "{query}"
              </div>
            )}

            {!query && filtered.length === 0 && (
              <div style={{ padding: 14, fontSize: 12, color: 'var(--stone)', textAlign: 'center' }}>
                Belum ada {label.toLowerCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
