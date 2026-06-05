// ═══════════════════════════════════════════════════
// features/products/ProductListPage.tsx
// ═══════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Package, Archive, RotateCcw, Pencil, Trash2, ChevronDown } from 'lucide-react'
import { useProductStore } from '@/state/productStore'
import { useUiStore }      from '@/state/uiStore'
import { ProductFormSheet } from './ProductFormSheet'
import { formatRupiah }     from '@/utils/format'
import type { Product }     from '@/types/product'

type Filter = 'active' | 'archived'

export default function ProductListPage() {
  const { products, loading, load, archive, restore, delete: deleteProduct } = useProductStore()
  const { toast, showConfirm } = useUiStore()

  const [sheet,   setSheet]   = useState<{ open: boolean; product: Product | null }>({ open: false, product: null })
  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<Filter>('active')
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let list = products
    if (filter === 'active')   list = list.filter(p => !p.isArchived)
    if (filter === 'archived') list = list.filter(p => p.isArchived)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [products, filter, search])

  function openAdd()  { setSheet({ open: true, product: null }) }
  function openEdit(p: Product) { setSheet({ open: true, product: p }) }
  function closeSheet() { setSheet({ open: false, product: null }) }

  async function handleDelete(p: Product) {
    showConfirm(
      'Hapus Barang',
      p.isArchived
        ? `Pulihkan "${p.name}" ke daftar aktif?`
        : `Hapus "${p.name}"? Jika sudah pernah bertransaksi, barang akan diarsip.`,
      async () => {
        if (p.isArchived) {
          await restore(p.id)
          toast('success', 'Barang dipulihkan')
        } else {
          const result = await deleteProduct(p.id)
          toast('info', result === 'archived' ? 'Barang diarsip karena punya riwayat transaksi' : 'Barang dihapus')
        }
      },
    )
  }

  async function handleArchive(p: Product) {
    showConfirm(
      'Arsip Barang',
      `Arsip "${p.name}"? Barang tidak muncul di daftar pilih transaksi.`,
      async () => {
        await archive(p.id)
        toast('info', 'Barang diarsip')
      },
    )
  }

  const activeCount   = products.filter(p => !p.isArchived).length
  const archivedCount = products.filter(p => p.isArchived).length

  return (
    <div className="page-scroll">
      <div className="wrap">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <div style={{ fontWeight:900, fontSize:17, color:'var(--soil)' }}>Barang</div>
            <div style={{ fontSize:10, color:'var(--stone)', fontWeight:600 }}>
              {activeCount} aktif · {archivedCount} diarsip
            </div>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ width:'auto', padding:'9px 14px', fontSize:12 }}>
            <Plus size={15} /> Tambah
          </button>
        </div>

        {/* Search + Filter */}
        <div style={{ marginBottom:10, display:'flex', gap:8 }}>
          <div style={{ flex:1, position:'relative' }}>
            <Search size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--stone)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau kategori..."
              style={{
                width:'100%', padding:'10px 12px 10px 32px',
                border:'1.5px solid var(--border)', borderRadius:'var(--r-sm)',
                fontFamily:'inherit', fontSize:13, color:'var(--soil)',
                background:'var(--cream)', outline:0,
              }}
            />
          </div>
          <button
            onClick={() => setShowFilter(f => !f)}
            style={{
              padding:'10px 12px', border:'1.5px solid var(--border)',
              borderRadius:'var(--r-sm)', background: showFilter ? 'var(--green-muted)' : 'var(--cream)',
              borderColor: showFilter ? 'var(--green)' : 'var(--border)',
              color: showFilter ? 'var(--green)' : 'var(--stone)',
              cursor:'pointer', display:'flex', alignItems:'center', gap:5,
              fontSize:12, fontWeight:700, fontFamily:'inherit',
            }}
          >
            {filter === 'active' ? 'Aktif' : 'Arsip'}
            <ChevronDown size={13} />
          </button>
        </div>

        {/* Filter dropdown */}
        {showFilter && (
          <div style={{
            background:'#fff', border:'1.5px solid var(--border)',
            borderRadius:'var(--r-sm)', marginBottom:8, overflow:'hidden',
            boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
          }}>
            {(['active','archived'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setShowFilter(false) }}
                style={{
                  width:'100%', padding:'11px 14px',
                  border:'none', background: filter === f ? 'var(--green-pale)' : 'transparent',
                  color: filter === f ? 'var(--green)' : 'var(--clay)',
                  fontWeight: filter === f ? 800 : 600,
                  fontSize:13, cursor:'pointer', textAlign:'left',
                  fontFamily:'inherit',
                  borderBottom: f === 'active' ? '1px solid var(--border)' : 'none',
                }}
              >
                {f === 'active' ? '✅ Aktif' : '📦 Diarsip'}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        {loading ? (
          <SkeletonList />
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} search={search} onAdd={openAdd} />
        ) : (
          <div className="card" style={{ overflow:'visible' }}>
            {filtered.map((p, i) => (
              <ProductRow
                key={p.id}
                product={p}
                isLast={i === filtered.length - 1}
                onEdit={() => openEdit(p)}
                onArchive={() => handleArchive(p)}
                onDelete={() => handleDelete(p)}
                onRestore={() => handleDelete(p)}
              />
            ))}
          </div>
        )}

      </div>

      <ProductFormSheet
        open={sheet.open}
        product={sheet.product}
        onClose={closeSheet}
      />
    </div>
  )
}

// ─── Product Row ──────────────────────────────────────────────
interface RowProps {
  product:   Product
  isLast:    boolean
  onEdit:    () => void
  onArchive: () => void
  onDelete:  () => void
  onRestore: () => void
}

function ProductRow({ product: p, isLast, onEdit, onArchive, onDelete, onRestore }: RowProps) {
  const margin = p.sellPrice - p.buyPrice
  const marginPct = p.buyPrice > 0 ? Math.round((margin / p.buyPrice) * 100) : 0

  return (
    <div style={{
      padding: '12px 14px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 10,
      opacity: p.isArchived ? 0.6 : 1,
    }}>

      {/* Icon */}
      <div style={{
        width:38, height:38, borderRadius:10, flexShrink:0,
        background: p.isArchived ? '#f5f5f5' : 'var(--green-muted)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {p.isArchived
          ? <Archive size={16} color="var(--stone)" />
          : <Package size={16} color="var(--green)" />
        }
      </div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:800, fontSize:13.5, color:'var(--soil)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {p.name}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:2, flexWrap:'wrap', alignItems:'center' }}>
          {p.category && (
            <span style={{ fontSize:9.5, fontWeight:700, color:'var(--stone)', background:'#f5f5f5', borderRadius:5, padding:'1px 6px' }}>
              {p.category}
            </span>
          )}
          <span style={{ fontSize:10, color:'var(--stone)', fontWeight:600 }}>
            Stok: <b style={{ color: p.stock <= 0 ? 'var(--red)' : 'var(--soil)' }}>{p.stock}</b> {p.unit}
          </span>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:3, alignItems:'center' }}>
          <span style={{ fontSize:11, fontWeight:900, color:'var(--soil)', fontFamily:'DM Mono,monospace' }}>
            {formatRupiah(p.sellPrice)}
          </span>
          {margin > 0 && (
            <span style={{ fontSize:9.5, fontWeight:700, color:'var(--green)', background:'var(--green-muted)', borderRadius:5, padding:'1px 6px' }}>
              +{marginPct}%
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:4, flexShrink:0 }}>
        {p.isArchived ? (
          <ActionBtn icon={<RotateCcw size={13} />} color="var(--green)" onClick={onRestore} title="Pulihkan" />
        ) : (
          <>
            <ActionBtn icon={<Pencil size={13} />} color="var(--clay)" onClick={onEdit} title="Edit" />
            <ActionBtn icon={<Archive size={13} />} color="var(--stone)" onClick={onArchive} title="Arsip" />
          </>
        )}
        <ActionBtn icon={<Trash2 size={13} />} color="var(--red)" onClick={onDelete} title="Hapus" />
      </div>

    </div>
  )
}

function ActionBtn({ icon, color, onClick, title }: { icon: React.ReactNode; color: string; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width:30, height:30, border:'none', borderRadius:8,
        background:'#f5f5f5', cursor:'pointer', color,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#e8e8e8')}
      onMouseLeave={e => (e.currentTarget.style.background = '#f5f5f5')}
    >
      {icon}
    </button>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────
function SkeletonList() {
  return (
    <div className="card">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ padding:'12px 14px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', display:'flex', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'#f0f0f0' }} />
          <div style={{ flex:1 }}>
            <div style={{ height:13, width:'60%', borderRadius:5, background:'#f0f0f0', marginBottom:6 }} />
            <div style={{ height:10, width:'40%', borderRadius:5, background:'#f5f5f5' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────
function EmptyState({ filter, search, onAdd }: { filter: Filter; search: string; onAdd: () => void }) {
  if (search) {
    return (
      <div className="empty-state">
        <Search size={36} />
        <p>Tidak ditemukan untuk "<b>{search}</b>"</p>
      </div>
    )
  }
  if (filter === 'archived') {
    return (
      <div className="empty-state">
        <Archive size={36} />
        <p>Belum ada barang yang diarsip</p>
      </div>
    )
  }
  return (
    <div className="empty-state">
      <Package size={36} />
      <p style={{ marginBottom:12 }}>Belum ada barang terdaftar</p>
      <button className="btn-primary" onClick={onAdd} style={{ width:'auto', padding:'10px 20px', margin:'0 auto' }}>
        <Plus size={15} /> Tambah Barang Pertama
      </button>
    </div>
  )
}
