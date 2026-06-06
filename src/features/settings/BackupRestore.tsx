// ═══════════════════════════════════════════════════
// features/settings/BackupRestore.tsx
// Export JSON backup & import/restore dengan validasi versi
// Format backup sesuai CLAUDE.md
// ═══════════════════════════════════════════════════

import { useState, useRef } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { db } from '@/db/database'
import { APP_VERSION } from '@/core/version'
import { useUiStore } from '@/state/uiStore'

// ─── Format backup CLAUDE.md ──────────────────────────────────
interface BackupPayload {
  app:       string
  version:   string
  timestamp: string
  data: {
    products:         unknown[]
    partners:         unknown[]
    transactions:     unknown[]
    transactionItems: unknown[]
    settings:         unknown[]
  }
}

// ─── Export ───────────────────────────────────────────────────

async function exportBackup(): Promise<void> {
  const [products, partners, transactions, transactionItems, settings] = await Promise.all([
    db.products.toArray(),
    db.partners.toArray(),
    db.transactions.toArray(),
    db.transactionItems.toArray(),
    db.settings.toArray(),
  ])

  const payload: BackupPayload = {
    app:       'NOTARA',
    version:   APP_VERSION,
    timestamp: new Date().toISOString(),
    data:      { products, partners, transactions, transactionItems, settings },
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  a.href     = url
  a.download = `notara-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Import / Restore ─────────────────────────────────────────

async function importBackup(file: File): Promise<{ ok: boolean; message: string }> {
  let raw: string
  try {
    raw = await file.text()
  } catch {
    return { ok: false, message: 'Gagal membaca file' }
  }

  let payload: BackupPayload
  try {
    payload = JSON.parse(raw)
  } catch {
    return { ok: false, message: 'File bukan format JSON yang valid' }
  }

  // Validasi struktur
  if (payload.app !== 'NOTARA') {
    return { ok: false, message: 'File bukan backup NOTARA' }
  }
  if (!payload.version || !payload.data) {
    return { ok: false, message: 'Format backup tidak dikenali' }
  }

  // Validasi major version harus sama
  const backupMajor  = parseInt(payload.version.split('.')[0], 10)
  const currentMajor = parseInt(APP_VERSION.split('.')[0], 10)
  if (backupMajor !== currentMajor) {
    return {
      ok: false,
      message: `Versi backup (v${payload.version}) tidak kompatibel dengan versi saat ini (v${APP_VERSION}). Major version harus sama.`,
    }
  }

  const d = payload.data
  if (!Array.isArray(d.products) || !Array.isArray(d.partners) ||
      !Array.isArray(d.transactions) || !Array.isArray(d.transactionItems)) {
    return { ok: false, message: 'Struktur data backup tidak valid' }
  }

  // Restore — hapus semua data lama, masukkan data backup
  try {
    await db.transaction('rw', [db.products, db.partners, db.transactions, db.transactionItems, db.settings], async () => {
        await db.products.clear()
        await db.partners.clear()
        await db.transactions.clear()
        await db.transactionItems.clear()
        await db.settings.clear()

        if (d.products.length)         await db.products.bulkAdd(d.products as any)
        if (d.partners.length)         await db.partners.bulkAdd(d.partners as any)
        if (d.transactions.length)     await db.transactions.bulkAdd(d.transactions as any)
        if (d.transactionItems.length) await db.transactionItems.bulkAdd(d.transactionItems as any)
        if (d.settings && Array.isArray(d.settings) && d.settings.length)
          await db.settings.bulkAdd(d.settings as any)
      }
    )
    return { ok: true, message: `Berhasil restore dari backup ${payload.version} (${new Date(payload.timestamp).toLocaleDateString('id-ID')})` }
  } catch (e: any) {
    return { ok: false, message: `Gagal restore: ${e?.message ?? 'unknown error'}` }
  }
}

// ─── Komponen ─────────────────────────────────────────────────

export function BackupRestore() {
  const [exporting,  setExporting]  = useState(false)
  const [importing,  setImporting]  = useState(false)
  const [importInfo, setImportInfo] = useState<{ ok:boolean; message:string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast, showConfirm } = useUiStore()

  async function handleExport() {
    setExporting(true)
    try {
      await exportBackup()
      toast('success', 'Backup berhasil diunduh')
    } catch {
      toast('error', 'Gagal membuat backup')
    } finally {
      setExporting(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input agar file yang sama bisa dipilih lagi
    e.target.value = ''

    showConfirm(
      'Restore Backup',
      'Semua data saat ini akan DIHAPUS dan diganti dengan data dari file backup. Lanjutkan?',
      async () => {
        setImporting(true)
        setImportInfo(null)
        const result = await importBackup(file)
        setImportInfo(result)
        if (result.ok) {
          toast('success', result.message)
        } else {
          toast('error', result.message)
        }
        setImporting(false)
      }
    )
  }

  return (
    <div style={{ background:'var(--md-surface-container-lowest)', borderRadius:'var(--r-lg)', border:'1px solid var(--md-outline-variant)', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderBottom:'1px solid #f0f5f0', background:'#fafaf9' }}>
        <Download size={16} color="var(--green)" />
        <span style={{ fontSize:13, fontWeight:800, color:'var(--soil)' }}>Backup & Restore</span>
      </div>

      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
        <p style={{ fontSize:12, color:'var(--stone)', fontWeight:600, lineHeight:1.6, margin:0 }}>
          Backup menyimpan seluruh data (produk, mitra, transaksi, pengaturan) ke file JSON.
          Restore menggantikan semua data dengan isi file backup.
        </p>

        {/* Export */}
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            width:'100%', padding:'12px',
            borderRadius:'var(--r-sm)', border:'1.5px solid var(--green)',
            background: exporting ? 'var(--green-pale)' : 'var(--green-pale)',
            color:'var(--green)', fontSize:13, fontWeight:800, fontFamily:'inherit',
            cursor: exporting ? 'not-allowed' : 'pointer',
          }}
        >
          <Download size={15} />
          {exporting ? 'Mempersiapkan backup…' : 'Export Backup (.json)'}
        </button>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ flex:1, height:1, background:'#e8f0e8' }} />
          <span style={{ fontSize:10, fontWeight:700, color:'var(--stone)' }}>ATAU</span>
          <div style={{ flex:1, height:1, background:'#e8f0e8' }} />
        </div>

        {/* Import */}
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display:'none' }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            width:'100%', padding:'12px',
            borderRadius:'var(--r-sm)', border:'1.5px solid #fde68a',
            background:'#fffbeb',
            color:'var(--amber)', fontSize:13, fontWeight:800, fontFamily:'inherit',
            cursor: importing ? 'not-allowed' : 'pointer',
          }}
        >
          <Upload size={15} />
          {importing ? 'Memproses restore…' : 'Import Backup (.json)'}
        </button>

        {/* Peringatan */}
        <div style={{
          display:'flex', gap:8, padding:'10px 12px',
          background:'#fff9f0', borderRadius:'var(--r-sm)',
          border:'1.5px solid #fed7aa',
        }}>
          <AlertTriangle size={14} color="var(--amber)" style={{ flexShrink:0, marginTop:1 }} />
          <p style={{ fontSize:11, color:'var(--amber)', fontWeight:600, margin:0, lineHeight:1.6 }}>
            Restore akan menghapus semua data yang ada. Selalu export backup terbaru sebelum melakukan restore.
          </p>
        </div>

        {/* Hasil import */}
        {importInfo && (
          <div style={{
            padding:'10px 12px', borderRadius:'var(--r-sm)',
            background: importInfo.ok ? '#f0fdf4' : '#fef2f2',
            border: `1.5px solid ${importInfo.ok ? '#bbf7d0' : '#fecaca'}`,
            fontSize:12, fontWeight:600,
            color: importInfo.ok ? 'var(--green)' : 'var(--red)',
          }}>
            {importInfo.message}
          </div>
        )}
      </div>
    </div>
  )
}
