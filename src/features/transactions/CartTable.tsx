import { Trash2 } from 'lucide-react'
import { formatRupiah } from '@/utils/format'
import type { CartItem } from './useTransactionForm'

interface Props {
  cart:         CartItem[]
  subtotal:     number
  discount:     number
  total:        number
  dpAmount:     number
  sisa:         number
  discountType: 'nominal' | 'percent'
  discountValue: number
  onRemove:     (productId: string) => void
  onUpdateQty:  (productId: string, qty: number) => void
  onDiscountChange: (type: 'nominal' | 'percent', val: number) => void
  onDpChange:   (val: number) => void
}

export function CartTable({
  cart, subtotal, discount, total, dpAmount, sisa,
  discountType, discountValue,
  onRemove, onUpdateQty, onDiscountChange, onDpChange,
}: Props) {
  if (cart.length === 0) {
    return (
      <div className="ker-tbl-wrap">
        <div className="ker-empty">Belum ada item — tambahkan di atas</div>
      </div>
    )
  }

  function fmtPrice(val: string): number {
    return parseInt(val.replace(/\D/g, '') || '0', 10)
  }

  return (
    <>
      <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--stone)', letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 6 }}>
        Daftar Item
      </div>

      {/* Tabel */}
      <div className="ker-tbl-wrap" style={{ marginBottom: 8 }}>
        <table className="ker-tbl">
          <thead>
            <tr>
              <th className="col-nama">Produk</th>
              <th className="col-qty tc">Qty</th>
              <th className="col-hrg tr">Harga</th>
              <th className="col-sub tr">Subtotal</th>
              <th className="col-del"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(it => (
              <tr key={it.productId}>
                <td className="td-nama">
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--soil)' }}>{it.productName}</div>
                  <div className="td-sat" style={{ fontSize: 9.5, color: 'var(--stone)' }}>{it.unit}</div>
                </td>
                <td className="td-qty">
                  {/* Inline qty edit */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <button type="button" onClick={() => onUpdateQty(it.productId, it.qty - 1)}
                      style={{ width: 20, height: 20, border: 'none', background: '#f0f4f0', borderRadius: 4, cursor: 'pointer', color: 'var(--green)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 800, fontSize: 12, minWidth: 20, textAlign: 'center' }}>{it.qty}</span>
                    <button type="button" onClick={() => onUpdateQty(it.productId, it.qty + 1)}
                      style={{ width: 20, height: 20, border: 'none', background: '#f0f4f0', borderRadius: 4, cursor: 'pointer', color: 'var(--green)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </td>
                <td className="td-hrg">{formatRupiah(it.sellPrice)}</td>
                <td className="td-sub">{formatRupiah(it.subtotal)}</td>
                <td className="td-del">
                  <button type="button" className="btn-ker-del" onClick={() => onRemove(it.productId)}
                    style={{ width: 26, height: 26, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={13} color="var(--stone)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {/* Subtotal */}
            <tr>
              <td colSpan={3} className="tf-lbl">Subtotal</td>
              <td className="tf-val">{formatRupiah(subtotal)}</td>
              <td></td>
            </tr>

            {/* Diskon */}
            <tr>
              <td colSpan={2} className="tf-lbl">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <button type="button"
                    onClick={() => onDiscountChange(discountType === 'nominal' ? 'percent' : 'nominal', discountValue)}
                    style={{ fontSize: 9, fontWeight: 800, color: 'var(--amber)', background: 'var(--amber-pale)', border: '1px solid var(--amber-border)', borderRadius: 50, padding: '1px 6px', cursor: 'pointer' }}>
                    {discountType === 'nominal' ? 'Rp' : '%'}
                  </button>
                  Diskon
                </div>
              </td>
              <td colSpan={1}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={discountValue || ''}
                  placeholder="0"
                  onChange={e => onDiscountChange(discountType, fmtPrice(e.target.value))}
                  style={{
                    width: '100%', padding: '3px 6px', border: '1.5px solid var(--amber-border)',
                    borderRadius: 6, fontFamily: 'DM Mono, monospace', fontSize: 12,
                    fontWeight: 700, textAlign: 'right', outline: 'none', background: 'var(--amber-pale)',
                  }}
                />
              </td>
              <td className="tf-val" style={{ color: 'var(--amber)' }}>
                {discount > 0 ? `-${formatRupiah(discount)}` : '—'}
              </td>
              <td></td>
            </tr>

            {/* Total tagihan */}
            <tr className="tf-tagihan">
              <td colSpan={3} className="tf-lbl" style={{ textAlign: 'left', paddingLeft: 4, fontWeight: 800, color: 'var(--soil)', fontSize: 11 }}>
                Total Tagihan
              </td>
              <td className="tf-val" style={{ fontSize: 15, fontWeight: 900, color: 'var(--soil)' }}>
                {formatRupiah(total)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* DP block */}
      <div style={{
        marginTop: 8, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 8,
        padding: '7px 6px 7px 12px',
        background: 'var(--amber-pale)',
        border: '1.5px solid var(--amber-border)',
        borderRadius: 'var(--r-sm)',
      }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--amber)', whiteSpace: 'nowrap' }}>
          DP / Uang Muka
        </span>
        <div style={{ position: 'relative', width: 140, flexShrink: 0 }}>
          <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: 'var(--stone)', pointerEvents: 'none' }}>Rp</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={dpAmount || ''}
            onChange={e => onDpChange(fmtPrice(e.target.value))}
            onFocus={e => e.target.select()}
            style={{
              width: '100%', padding: '7px 8px 7px 26px',
              border: '1.5px solid var(--amber-border)', borderRadius: 8,
              fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 700,
              outline: 'none', background: '#fff', color: 'var(--soil)', textAlign: 'right',
            }}
          />
        </div>
      </div>

      {/* Sisa tagihan */}
      {dpAmount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 10px', background: '#f5f5f4', borderRadius: 7, marginTop: 6,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--stone)' }}>Sisa Tagihan</span>
          <span style={{ fontSize: 14, fontWeight: 900, fontFamily: 'DM Mono, monospace', color: 'var(--rose-text)' }}>
            {formatRupiah(sisa)}
          </span>
        </div>
      )}
    </>
  )
}
