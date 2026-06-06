// ═══════════════════════════════════════════════════
// features/transactions/TransactionInputScreen.tsx
// Form input transaksi (create + edit)
// ═══════════════════════════════════════════════════

import { X, Save, AlertCircle } from 'lucide-react'
import { PartnerSearch }   from './PartnerSearch'
import { ItemBuilder }     from './ItemBuilder'
import { CartTable }       from './CartTable'
import { BankInlineField } from './BankInlineField'
import type { useTransactionForm } from './useTransactionForm'

type FormHook = ReturnType<typeof useTransactionForm>

interface Props {
  hook: FormHook
}

export function TransactionInputScreen({ hook }: Props) {
  const {
    open, form, cart, loading, error, isEditMode,
    subtotal, discount, total, sisa,
    selectedPartner, partnerHasBank,
    products, partners,
    closeForm, setField, selectPartner,
    addToCart, removeFromCart, updateCartQty,
    saveTransaction,
  } = hook

  return (
    <div className={`input-screen${open ? ' open' : ''}`}>

      {/* ── Top bar ──────────────────────────────────── */}
      <div className="input-bar">
        <button className="input-bar-btn" onClick={closeForm} aria-label="Tutup">
          <X size={16} color="white" />
        </button>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          {isEditMode && (
            <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.6)', marginRight: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>Edit</span>
          )}
          {(['SALE', 'PURCHASE'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => !isEditMode && setField('type', t)}
              style={{
                padding: '4px 14px', borderRadius: 50,
                border: 'none', fontFamily: 'inherit',
                fontSize: 11, fontWeight: 800,
                cursor: isEditMode ? 'default' : 'pointer',
                background: form.type === t ? '#fff' : 'rgba(255,255,255,.18)',
                color:      form.type === t ? 'var(--green)' : '#fff',
                transition: 'all .18s',
                opacity:    isEditMode && form.type !== t ? 0.4 : 1,
              }}
            >
              {t === 'SALE' ? 'Penjualan' : 'Pembelian'}
            </button>
          ))}
        </div>

        <button className="input-bar-btn" onClick={saveTransaction} disabled={loading} aria-label="Simpan">
          <Save size={16} color="white" />
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────── */}
      <div className="input-body">

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: 'var(--red-pale)', border: '1.5px solid #fca5a5',
            borderRadius: 'var(--r-sm)', padding: '9px 12px', marginBottom: 10,
            fontSize: 12, fontWeight: 700, color: 'var(--red)',
          }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Tanggal */}
        <div className="field">
          <label>Tanggal</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setField('date', e.target.value)}
          />
        </div>

        <PartnerSearch
          partners={partners}
          type={form.type}
          selectedId={form.partnerId}
          selectedName={form.partnerName}
          onSelect={selectPartner}
          onCreateNew={name => { console.log('Quick create partner:', name) }}
        />

        {form.partnerId && !partnerHasBank && (
          <BankInlineField
            bankName={form.bankName}
            accountNo={form.accountNo}
            accountName={form.accountName}
            onChange={(field, val) => setField(field, val)}
          />
        )}

        {form.partnerId && partnerHasBank && selectedPartner?.accountNo && (
          <div style={{
            background: 'var(--amber-pale)', border: '1.5px solid var(--amber-border)',
            borderRadius: 'var(--r-sm)', padding: '8px 12px', marginBottom: 2,
            fontSize: 12, color: 'var(--amber)', fontWeight: 700,
            display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 10, opacity: .7 }}>Rekening:</span>
            <span>{selectedPartner.bankName}</span>
            <span style={{ fontFamily: 'DM Mono, monospace' }}>{selectedPartner.accountNo}</span>
            <span style={{ opacity: .7 }}>a.n. {selectedPartner.accountName}</span>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <ItemBuilder
            products={products}
            type={form.type}
            onAdd={addToCart}
          />
        </div>

        <CartTable
          cart={cart}
          subtotal={subtotal}
          discount={discount}
          total={total}
          dpAmount={form.dpAmount}
          sisa={sisa}
          discountType={form.discountType}
          discountValue={form.discountValue}
          onRemove={removeFromCart}
          onUpdateQty={updateCartQty}
          onDiscountChange={(type, val) => {
            setField('discountType', type)
            setField('discountValue', val)
          }}
          onDpChange={val => setField('dpAmount', val)}
        />

        {/* Metode bayar */}
        <div className="field" style={{ marginTop: 12 }}>
          <label>Metode Pembayaran</label>
          <div className="chip-row">
            {(['CASH', 'TRANSFER', 'DP'] as const).map(m => (
              <button
                key={m}
                type="button"
                className={`chip${form.payMethod === m ? ' active' : ''}`}
                onClick={() => setField('payMethod', m)}
              >
                {m === 'CASH' ? '💵 Tunai' : m === 'TRANSFER' ? '🏦 Transfer' : '📋 DP'}
              </button>
            ))}
          </div>
        </div>

        {(form.payMethod === 'DP' || form.dpAmount > 0) && (
          <div className="field">
            <label>Rencana Pelunasan</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setField('dueDate', e.target.value)}
            />
          </div>
        )}

        <div className="field" style={{ marginTop: 8 }}>
          <label>Catatan (opsional)</label>
          <textarea
            value={form.notes}
            placeholder="Catatan tambahan..."
            rows={2}
            onChange={e => setField('notes', e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="input-footer">
        <div className="input-total-row">
          <span className="input-total-lbl">Total</span>
          <span className="input-total-val">
            {total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={closeForm}
            style={{
              flex: 1, padding: 13, border: '1.5px solid var(--border)',
              borderRadius: 'var(--r-sm)', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 13, background: '#fff',
              color: 'var(--clay)', cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={saveTransaction}
            disabled={loading || cart.length === 0 || !form.partnerId}
          >
            {loading ? <span className="spin" /> : <Save size={15} />}
            {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Simpan'}
          </button>
        </div>
      </div>

    </div>
  )
}
