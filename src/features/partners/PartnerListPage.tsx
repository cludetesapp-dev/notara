// ═══════════════════════════════════════════════════
// features/partners/PartnerListPage.tsx
// Halaman list mitra — dipakai oleh Customer & Supplier page
// ═══════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Users, Phone, MapPin, Archive, Pencil, Trash2, RotateCcw, Building2 } from 'lucide-react'
import { usePartnerStore } from '@/state/partnerStore'
import { useUiStore }      from '@/state/uiStore'
import { PartnerFormSheet } from './PartnerFormSheet'
import type { Partner, PartnerType } from '@/types/partner'

interface Props {
  partnerType: PartnerType           // 'CUSTOMER' | 'SUPPLIER'
  title:       string                // 'Customer' | 'Supplier'
  emptyLabel:  string
}

type Filter = 'active' | 'archived'

export function PartnerListPage({ partnerType, title, emptyLabel }: Props) {
  const { partners, loading, load, archive, restore, delete: deletePartner } = usePartnerStore()
  const { toast, showConfirm } = useUiStore()

  const [sheet,   setSheet]      = useState<{ open: boolean; partner: Partner | null }>({ open: false, partner: null })
  const [search,  setSearch]     = useState('')
  const [filter,  setFilter]     = useState<Filter>('active')
  const [showFil, setShowFil]    = useState(false)

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let list = partners.filter(p =>
      p.type === partnerType || p.type === 'BOTH'
    )
    if (filter === 'active')   list = list.filter(p => !p.isArchived)
    if (filter === 'archived') list = list.filter(p => p.isArchived)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.phone   ?? '').includes(q) ||
        (p.address ?? '').toLowerCase().includes(q)
      )
    }
    return list.sort((a, b) => a.name.localeCompare(b.name))
  }, [partners, partnerType, filter, search])

  function openAdd()             { setSheet({ open: true, partner: null }) }
  function openEdit(p: Partner)  { setSheet({ open: true, partner: p }) }
  function closeSheet()          { setSheet({ open: false, partner: null }) }

  async function handleDelete(p: Partner) {
    showConfirm(
      p.isArchived ? 'Pulihkan Mitra' : 'Hapus Mitra',
      p.isArchived
        ? `Pulihkan "${p.name}" ke daftar aktif?`
        : `Hapus "${p.name}"? Jika punya riwayat transaksi, mitra akan diarsip.`,
      async () => {
        if (p.isArchived) {
          await restore(p.id)
          toast('success', 'Mitra dipulihkan')
        } else {
          const result = await deletePartner(p.id)
          toast('info', result === 'archived' ? 'Mitra diarsip karena punya transaksi' : 'Mitra dihapus')
        }
      },
    )
  }

  async function handleArchive(p: Partner) {
    showConfirm(
      'Arsip Mitra',
      `Arsip "${p.name}"? Mitra tidak muncul di pilihan transaksi baru.`,
      async () => {
        await archive(p.id)
        toast('info', 'Mitra diarsip')
      },
    )
  }

  const typeAll     = partners.filter(p => p.type === partnerType || p.type === 'BOTH')
  const activeCount = typeAll.filter(p => !p.isArchived).length
  const archCount   = typeAll.filter(p => p.isArchived).length

  return (
    <div className="page-scroll">
      <div className="wrap">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <div style={{ fontWeight:900, fontSize:17, color:'var(--soil)' }}>{title}</div>
            <div style={{ fontSize:10, color:'var(--stone)', fontWeight:600 }}>
              {activeCount} aktif · {archCount} diarsip
            </div>
          </div>
          <button className="btn-primary" onClick={openAdd} style={{ width:'auto', padding:'9px 14px', fontSize:12, background:'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow:'0 4px 14px rgba(59,130,246,0.3)' }}>
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
              placeholder={`Cari ${title.toLowerCase()}...`}
              style={{
                width:'100%', padding:'10px 12px 10px 32px',
                border:'1.5px solid var(--border)', borderRadius:'var(--r-sm)',
                fontFamily:'inherit', fontSize:13, color:'var(--soil)',
                background:'var(--cream)', outline:0,
              }}
            />
          </div>
          <button
            onClick={() => setShowFil(f => !f)}
            style={{
              padding:'10px 12px', border:'1.5px solid',
              borderColor: showFil ? '#3b82f6' : 'var(--border)',
              borderRadius:'var(--r-sm)',
              background: showFil ? '#eff6ff' : 'var(--cream)',
              color: showFil ? '#3b82f6' : 'var(--stone)',
              cursor:'pointer', display:'flex', alignItems:'center', gap:5,
              fontSize:12, fontWeight:700, fontFamily:'inherit',
            }}
          >
            {filter === 'active' ? 'Aktif' : 'Arsip'}
          </button>
        </div>

        {showFil && (
          <div style={{
            background:'#fff', border:'1.5px solid var(--border)',
            borderRadius:'var(--r-sm)', marginBottom:8, overflow:'hidden',
            boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
          }}>
            {(['active','archived'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setShowFil(false) }}
                style={{
                  width:'100%', padding:'11px 14px', border:'none',
                  background: filter === f ? '#eff6ff' : 'transparent',
                  color: filter === f ? '#3b82f6' : 'var(--clay)',
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
          <EmptyState filter={filter} search={search} label={emptyLabel} onAdd={openAdd} />
        ) : (
          <div className="card">
            {filtered.map((p, i) => (
              <PartnerRow
                key={p.id}
                partner={p}
                isLast={i === filtered.length - 1}
                onEdit={() => openEdit(p)}
                onArchive={() => handleArchive(p)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>
        )}

      </div>

      <PartnerFormSheet
        open={sheet.open}
        partner={sheet.partner}
        defaultType={partnerType}
        onClose={closeSheet}
      />
    </div>
  )
}

// ─── Partner Row ──────────────────────────────────────────────
function PartnerRow({ partner: p, isLast, onEdit, onArchive, onDelete }: {
  partner:   Partner
  isLast:    boolean
  onEdit:    () => void
  onArchive: () => void
  onDelete:  () => void
}) {
  return (
    <div style={{
      padding:'12px 14px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      display:'flex', alignItems:'center', gap:10,
      opacity: p.isArchived ? 0.6 : 1,
    }}>

      {/* Avatar */}
      <div style={{
        width:38, height:38, borderRadius:10, flexShrink:0,
        background: p.isArchived ? '#f5f5f5' : '#eff6ff',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:15, fontWeight:800, color: p.isArchived ? 'var(--stone)' : '#3b82f6',
      }}>
        {p.isArchived ? <Archive size={16} color="var(--stone)" /> : p.name.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:800, fontSize:13.5, color:'var(--soil)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {p.name}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:3, flexWrap:'wrap', alignItems:'center' }}>
          {p.phone && (
            <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'var(--stone)', fontWeight:600 }}>
              <Phone size={9} /> {p.phone}
            </span>
          )}
          {p.address && (
            <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'var(--stone)', fontWeight:600 }}>
              <MapPin size={9} /> {p.address.length > 25 ? p.address.slice(0, 25) + '…' : p.address}
            </span>
          )}
          {p.accountNo && (
            <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'#3b82f6', fontWeight:700, background:'#eff6ff', borderRadius:5, padding:'1px 6px' }}>
              <Building2 size={9} /> {p.bankName} {p.accountNo}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:4, flexShrink:0 }}>
        {p.isArchived ? (
          <ActionBtn icon={<RotateCcw size={13} />} color="var(--green)" onClick={onDelete} title="Pulihkan" bg="#f0fdf4" />
        ) : (
          <>
            <ActionBtn icon={<Pencil size={13} />} color="var(--clay)" onClick={onEdit} title="Edit" bg="#f5f5f5" />
            <ActionBtn icon={<Archive size={13} />} color="var(--stone)" onClick={onArchive} title="Arsip" bg="#f5f5f5" />
          </>
        )}
        <ActionBtn icon={<Trash2 size={13} />} color="var(--red)" onClick={onDelete} title="Hapus" bg="#fff5f5" />
      </div>

    </div>
  )
}

function ActionBtn({ icon, color, onClick, title, bg }: { icon: React.ReactNode; color: string; onClick: () => void; title: string; bg: string }) {
  return (
    <button
      onClick={onClick} title={title}
      style={{
        width:30, height:30, border:'none', borderRadius:8,
        background:bg, cursor:'pointer', color,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}
    >
      {icon}
    </button>
  )
}

function SkeletonList() {
  return (
    <div className="card">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ padding:'12px 14px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'#f0f0f0' }} />
          <div style={{ flex:1 }}>
            <div style={{ height:13, width:'55%', borderRadius:5, background:'#f0f0f0', marginBottom:6 }} />
            <div style={{ height:10, width:'35%', borderRadius:5, background:'#f5f5f5' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ filter, search, label, onAdd }: { filter: Filter; search: string; label: string; onAdd: () => void }) {
  if (search) return (
    <div className="empty-state">
      <Search size={36} />
      <p>Tidak ditemukan untuk "<b>{search}</b>"</p>
    </div>
  )
  if (filter === 'archived') return (
    <div className="empty-state">
      <Archive size={36} />
      <p>Belum ada {label} yang diarsip</p>
    </div>
  )
  return (
    <div className="empty-state">
      <Users size={36} />
      <p style={{ marginBottom:12 }}>Belum ada {label} terdaftar</p>
      <button className="btn-primary" onClick={onAdd} style={{ width:'auto', padding:'10px 20px', margin:'0 auto', background:'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow:'0 4px 14px rgba(59,130,246,0.3)' }}>
        <Plus size={15} /> Tambah {label.charAt(0).toUpperCase() + label.slice(1)} Pertama
      </button>
    </div>
  )
}
