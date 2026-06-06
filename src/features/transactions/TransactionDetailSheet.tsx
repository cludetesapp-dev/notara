// ═══════════════════════════════════════════════════
// features/transactions/TransactionDetailSheet.tsx
// Bottom sheet detail nota — read-only + tombol edit/hapus
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { X, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react'
import { transactionService } from '@/services/transactionService'
import { formatRupiah, formatDate, formatDateTime } from '@/utils/format'
import type { Transaction, TransactionItem } from '@/types/transaction'

interface Props {
  transaction: Transaction
  onClose:     () => void
  onEdit:      () => void
  onDelete:    () => void
}

export function TransactionDetailSheet({ transaction: tx, onClose, onEdit, onDelete }: Props) {
  const [items,   setItems]   = useState<TransactionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    transactionService.getItems(tx.id)
      .then(setItems)
      .finally(() => setLoading(false))
  }, [tx.id])

  const isSale  = tx.type === 'SALE'
  const sisa    = tx.dpAmount > 0 ? Math.max(0, tx.total - tx.dpAmount) : 0
  const profit  = items.reduce((s, it) => s + it.profit, 0) - tx.discount

  const payLabel: Record<string, string> = { CASH: 'Tunai', TRANSFER: 'Transfer', DP: 'DP / Cicil' }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
          zIndex: 60, backdropFilter: 'blur(2px)',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderRadius: '20px 20px 0 0',
        zIndex: 61, maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 -8px 40px rgba(0,0,0,.18)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)',
      }}>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: '#e5e7eb' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px 10px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isSale
                ? <ArrowUpCircle size={16} color="var(--green)" />
                : <ArrowDownCircle size={16} color="var(--amber)" />
              }
              <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--soil)', fontFamily: 'DM Mono, monospace' }}>
                {tx.code}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 50,
                background: isSale ? 'var(--green-pale)' : 'var(--amber-pale)',
                color: isSale ? 'var(--green)' : 'var(--amber)',
                textTransform: 'uppercase', letterSpacing: '.4px',
              }}>
                {isSale ? 'Penjualan' : 'Pembelian'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--stone)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> {formatDate(tx.date)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, border: 'none', background: 'var(--cream)',
              borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={15} color="var(--stone)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Items */}
          {loading ? (
            <div style={{ height: 80, background: '#f5f5f4', borderRadius: 8, animation: 'pulse 1.5s infinite' }} />
          ) : (
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--stone)', letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 8 }}>
                Daftar Item
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map(it => (
                  <div key={it.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 12px', background: 'var(--cream)',
                    borderRadius: 8, border: '1px solid var(--border)',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--soil)' }}>{it.productName}</div>
                      <div style={{ fontSize: 10, color: 'var(--stone)' }}>
                        {it.qty} {it.unit} × {formatRupiah(it.sellPrice)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--soil)', fontFamily: 'DM Mono, monospace' }}>
                        {formatRupiah(it.subtotal)}
                      </div>
                      {isSale && (
                        <div style={{ fontSize: 9.5, color: 'var(--green)', fontWeight: 700 }}>
                          laba {formatRupiah(it.profit)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ringkasan keuangan */}
          <div style={{
            background: 'var(--cream)', borderRadius: 10,
            border: '1px solid var(--border)', padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 7,
          }}>
            <DetailRow label="Subtotal" value={formatRupiah(tx.subtotal)} />
            {tx.discount > 0 && (
              <DetailRow
                label={`Diskon (${tx.discountType === 'percent' ? `${tx.discountValue}%` : 'nominal'})`}
                value={`-${formatRupiah(tx.discount)}`}
                accent="var(--amber)"
              />
            )}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 7 }}>
              <DetailRow label="Total Tagihan" value={formatRupiah(tx.total)} bold />
            </div>
            {tx.dpAmount > 0 && (
              <>
                <DetailRow label={`DP / Uang Muka`} value={formatRupiah(tx.dpAmount)} accent="var(--green)" />
                <DetailRow label="Sisa Tagihan" value={formatRupiah(sisa)} accent="var(--rose-text)" bold />
              </>
            )}
            {isSale && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 7 }}>
                <DetailRow label="Laba Bersih" value={formatRupiah(profit)} accent="var(--green)" bold />
              </div>
            )}
          </div>

          {/* Meta info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <MetaRow label="Metode Bayar" value={payLabel[tx.payMethod ?? 'CASH'] ?? tx.payMethod} />
            {tx.dueDate && <MetaRow label="Rencana Lunas" value={formatDate(tx.dueDate)} />}
            {tx.notes && <MetaRow label="Catatan" value={tx.notes} />}
            <MetaRow label="Dibuat" value={formatDateTime(tx.createdAt)} />
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '4px 16px 8px', display: 'flex', gap: 10 }}>
          <button
            onClick={onDelete}
            style={{
              flex: 1, padding: '12px 0', border: '1.5px solid #fca5a5',
              borderRadius: 'var(--r-sm)', background: 'var(--red-pale)',
              color: 'var(--red)', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Trash2 size={14} /> Hapus Nota
          </button>
          <button
            onClick={onEdit}
            className="btn-primary"
            style={{ flex: 2 }}
          >
            <Pencil size={14} /> Edit Nota
          </button>
        </div>
      </div>
    </>
  )
}

function DetailRow({ label, value, accent, bold }: {
  label:   string
  value:   string
  accent?: string
  bold?:   boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11.5, color: 'var(--stone)', fontWeight: 600 }}>{label}</span>
      <span style={{
        fontSize: bold ? 14 : 12,
        fontWeight: bold ? 900 : 700,
        color: accent ?? 'var(--soil)',
        fontFamily: 'DM Mono, monospace',
      }}>
        {value}
      </span>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <span style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 600, minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: 11, color: 'var(--soil)', fontWeight: 700, flex: 1 }}>{value}</span>
    </div>
  )
}
