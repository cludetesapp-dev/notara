import { Building2 } from 'lucide-react'

interface Props {
  bankName:    string
  accountNo:   string
  accountName: string
  onChange:    (field: 'bankName' | 'accountNo' | 'accountName', val: string) => void
}

const BANK_LIST = ['BRI', 'BCA', 'Mandiri', 'BNI', 'BSI', 'DANA', 'GoPay', 'OVO', 'Lainnya']

export function BankInlineField({ bankName, accountNo, accountName, onChange }: Props) {
  return (
    <div style={{
      background: '#fffbeb', border: '1.5px solid #fde68a',
      borderRadius: 'var(--r-sm)', padding: '10px 12px', marginTop: 8,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Building2 size={13} color="var(--amber)" />
        <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Tambah Rekening (opsional)
        </span>
      </div>

      {/* Bank chips */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--stone)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 5 }}>Bank</div>
        <div className="chip-row">
          {BANK_LIST.map(b => (
            <button
              key={b}
              type="button"
              className={`chip${bankName === b ? ' active' : ''}`}
              onClick={() => onChange('bankName', bankName === b ? '' : b)}
              style={{ fontSize: 10.5, padding: '4px 10px' }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="field-row" style={{ marginBottom: 0 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>No. Rekening</label>
          <input
            type="text"
            inputMode="numeric"
            value={accountNo}
            placeholder="0000 0000 0000"
            onChange={e => onChange('accountNo', e.target.value.replace(/\D/g, ''))}
            style={{ fontFamily: 'DM Mono, monospace', letterSpacing: '.5px' }}
          />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Atas Nama</label>
          <input
            type="text"
            value={accountName}
            placeholder="Nama pemilik"
            onChange={e => onChange('accountName', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
