// ═══════════════════════════════════════════════════
// features/transactions/TransactionListPage.tsx
// Daftar transaksi: filter tipe, search, delete, buka detail/edit
// ═══════════════════════════════════════════════════

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Plus, ArrowDownCircle, ArrowUpCircle, Receipt, Pencil, Trash2, Eye } from 'lucide-react'
import { useTransactionStore }   from '@/state/transactionStore'
import { useUiStore }            from '@/state/uiStore'
import { formatRupiah, formatDate } from '@/utils/format'
import { TransactionInputScreen }   from './TransactionInputScreen'
import { TransactionDetailSheet }   from './TransactionDetailSheet'
import { useTransactionForm }       from './useTransactionForm'
import type { Transaction }         from '@/types/transaction'

type FilterType = 'ALL' | 'SALE' | 'PURCHASE'

export default function TransactionListPage() {
  const { transactions, loading, load, remove } = useTransactionStore()
  const { toast, showConfirm }                  = useUiStore()

  const [search,  setSearch]  = useState('')
  const [filter,  setFilter]  = useState<FilterType>('ALL')
  const [detail,  setDetail]  = useState<Transaction | null>(null)

  const hook = useTransactionForm(useCallback(() => {
    load()
    toast('success', hook.isEditMode ? 'Nota berhasil diperbarui' : 'Nota berhasil disimpan')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, toast]))

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    let list = transactions
    if (filter !== 'ALL') list = list.filter(tx => tx.type === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(tx =>
        tx.code.toLowerCase().includes(q) ||
        (tx.notes ?? '').toLowerCase().includes(q)
      )
    }
    return list
  }, [transactions, filter, search])

  async function handleDelete(tx: Transaction) {
    showConfirm(
      'Hapus Nota',
      `Hapus nota ${tx.code}? Stok akan dikembalikan secara otomatis.`,
      async () => {
        await remove(tx.id)
        toast('success', 'Nota dihapus & stok dipulihkan')
      },
    )
  }

  function handleEdit(tx: Transaction) {
    setDetail(null)
    setTimeout(() => hook.openEditForm(tx), 50)
  }

  // ── Summary ──────────────────────────────────────────────
  const totalSale     = transactions.filter(t => t.type === 'SALE').reduce((s, t) => s + t.total, 0)
  const totalPurchase = transactions.filter(t => t.type === 'PURCHASE').reduce((s, t) => s + t.total, 0)
  const countSale     = transactions.filter(t => t.type === 'SALE').length
  const countPurchase = transactions.filter(t => t.type === 'PURCHASE').length

  return (
    <div className="page-scroll">
      <div className="wrap">

        {/* ── Summary cards ─────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{
            background: 'var(--md-primary-container)', border: 'none',
            borderRadius: 'var(--r-sm)', padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <ArrowUpCircle size={14} color="var(--green)" />
              <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Penjualan</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--soil)', fontFamily: 'DM Mono, monospace' }}>
              {formatRupiah(totalSale)}
            </div>
            <div style={{ fontSize: 10, color: 'var(--stone)', marginTop: 2 }}>{countSale} nota</div>
          </div>

          <div style={{
            background: 'var(--amber-pale)', border: '1.5px solid var(--amber-border)',
            borderRadius: 'var(--r-sm)', padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <ArrowDownCircle size={14} color="var(--amber)" />
              <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Pembelian</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--soil)', fontFamily: 'DM Mono, monospace' }}>
              {formatRupiah(totalPurchase)}
            </div>
            <div style={{ fontSize: 10, color: 'var(--stone)', marginTop: 2 }}>{countPurchase} nota</div>
          </div>
        </div>

        {/* ── Filter chips ──────────────────────────── */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {(['ALL', 'SALE', 'PURCHASE'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 13px', borderRadius: 50, border: 'none',
                fontFamily: 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: filter === f ? 'var(--green)' : '#fff',
                color:      filter === f ? '#fff' : 'var(--stone)',
                boxShadow: filter === f ? 'none' : '0 1px 3px rgba(0,0,0,.08)',
                transition: 'all .15s',
              }}
            >
              {f === 'ALL' ? 'Semua' : f === 'SALE' ? 'Penjualan' : 'Pembelian'}
            </button>
          ))}
        </div>

        {/* ── Search ────────────────────────────────── */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--stone)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nomor nota atau catatan..."
            style={{
              width: '100%', padding: '10px 12px 10px 34px',
              border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)',
              fontFamily: 'inherit', fontSize: 13, outline: 'none',
              background: '#fff',
            }}
          />
        </div>

        {/* ── List ──────────────────────────────────── */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 76, borderRadius: 'var(--r-sm)', background: '#f5f5f4', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Receipt size={36} color="var(--stone)" style={{ opacity: .3, marginBottom: 10 }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--stone)' }}>
              {search || filter !== 'ALL' ? 'Tidak ada nota yang cocok' : 'Belum ada nota'}
            </div>
            {!search && filter === 'ALL' && (
              <div style={{ fontSize: 11, color: 'var(--stone)', marginTop: 4, opacity: .7 }}>
                Tap + untuk buat nota pertama
              </div>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(tx => (
              <TransactionCard
                key={tx.id}
                tx={tx}
                onView={() => setDetail(tx)}
                onEdit={() => handleEdit(tx)}
                onDelete={() => handleDelete(tx)}
              />
            ))}
          </div>
        )}

      </div>

      {/* ── FAB ───────────────────────────────────────── */}
      <button
        className="fab"
        onClick={() => hook.openForm('SALE')}
        aria-label="Buat nota baru"
      >
        <Plus size={22} />
      </button>

      {/* ── Input screen ──────────────────────────────── */}
      <TransactionInputScreen hook={hook} />

      {/* ── Detail sheet ──────────────────────────────── */}
      {detail && (
        <TransactionDetailSheet
          transaction={detail}
          onClose={() => setDetail(null)}
          onEdit={() => handleEdit(detail)}
          onDelete={() => { setDetail(null); handleDelete(detail) }}
        />
      )}
    </div>
  )
}

// ─── Card komponen ───────────────────────────────────────────

function TransactionCard({
  tx, onView, onEdit, onDelete,
}: {
  tx: Transaction
  onView:   () => void
  onEdit:   () => void
  onDelete: () => void
}) {
  const isSale = tx.type === 'SALE'
  const sisa   = tx.dpAmount > 0 ? Math.max(0, tx.total - tx.dpAmount) : 0

  return (
    <div
      style={{
        background: '#fff', borderRadius: 'var(--r-sm)',
        border: '1.5px solid var(--border)',
        padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 6,
        cursor: 'pointer',
      }}
      onClick={onView}
    >
      {/* Row 1: kode + tipe + total */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {/* Badge tipe */}
            <span style={{
              fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 50,
              background: isSale ? 'var(--green-pale)' : 'var(--amber-pale)',
              color: isSale ? 'var(--green)' : 'var(--amber)',
              border: `1px solid ${isSale ? 'var(--green-muted)' : 'var(--amber-border)'}`,
              textTransform: 'uppercase', letterSpacing: '.4px',
            }}>
              {isSale ? 'Jual' : 'Beli'}
            </span>
            <span style={{
              fontSize: 11.5, fontWeight: 800, fontFamily: 'DM Mono, monospace',
              color: 'var(--soil)',
            }}>
              {tx.code}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--stone)', marginTop: 3 }}>
            {formatDate(tx.date)}
            {tx.payMethod === 'DP' && (
              <span style={{
                marginLeft: 6, fontSize: 9, fontWeight: 700, padding: '1px 5px',
                borderRadius: 4, background: 'var(--rose-pale)',
                color: 'var(--rose-text)', border: '1px solid var(--rose-border)',
              }}>DP</span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--soil)', fontFamily: 'DM Mono, monospace' }}>
            {formatRupiah(tx.total)}
          </div>
          {sisa > 0 && (
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--rose-text)', marginTop: 2 }}>
              Sisa: {formatRupiah(sisa)}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: catatan + tombol aksi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 11, color: 'var(--stone)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.notes || '—'}
        </div>
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <ActionBtn icon={<Eye size={13} />} onClick={onView} color="var(--stone)" />
          <ActionBtn icon={<Pencil size={13} />} onClick={onEdit} color="var(--green)" />
          <ActionBtn icon={<Trash2 size={13} />} onClick={onDelete} color="var(--red)" />
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ icon, onClick, color }: { icon: React.ReactNode; onClick: () => void; color: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 28, height: 28, border: 'none', cursor: 'pointer',
        background: 'var(--cream)', borderRadius: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}
    >
      {icon}
    </button>
  )
}
