# CLAUDE.md — Panduan untuk AI (Claude)
# Project: NOTARA — Transaction Operating System
# Versi Saat Ini: 1.8.0
# Bahasa: Indonesia

---

## Cara Mulai Sesi Baru

**Selalu baca file ini dulu sebelum melakukan apapun.**
Jika user upload ZIP proyek, baca CLAUDE.md dari dalam ZIP tersebut.
Jika ada file dokumentasi lain yang diupload, baca semuanya sebelum mulai.

---

## Informasi Proyek

**Nama:** NOTARA
**Tagline:** Transaction Operating System untuk UMKM Indonesia
**Versi Saat Ini:** 1.8.0
**Tipe:** Offline-First PWA + Cloud Sync
**Stack:** React 18 · Vite 5 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui · Dexie 4 · Supabase · Zustand 4 · React Hook Form 7 · Zod 3 · Recharts · vite-plugin-pwa
**Deploy:** Netlify Drop (drag-and-drop folder `dist`)
**Repo:** _(isi saat project dibuat)_

---

## 🎯 Task Aktif Sekarang

Claude: baca tabel ini, kerjakan task pertama yang statusnya 🔄. Buat Change Plan dulu untuk task kategori KRITIS, langsung kerjakan untuk task kategori UI/Feature biasa.

| No | Task | Kategori | Status |
|---|---|---|---|
| 1 | Setup fondasi project (folder, config, types, db) | KRITIS | ✅ Done v1.0.0 |
| 2 | Core layer: errors, version, repositories, services, Zustand stores | KRITIS | ✅ Done v1.1.0 |
| 3 | Halaman Products & Partners (list + form sheet) | UI/Feature | ✅ Done v1.2.0 |
| 4 | Halaman Transaksi (list, detail, edit, hapus) | UI/Feature | ✅ Done v1.3.0 |
| 5 | Dashboard (summary cards, trend chart, recent transactions) | UI/Feature | ✅ Done v1.4.0 |

Setelah task selesai: update status jadi `✅ Done v1.X.X` dan ubah task berikutnya jadi `🔄 Kerjakan ini`.

---

## PRODUCT VISION

NOTARA adalah **Transaction Operating System** untuk UMKM Indonesia.

> "Mudah seperti buku nota. Modern seperti aplikasi SaaS."

**Tujuan:** Beli Barang → Jual Barang → Lihat Laba → Ambil Keputusan

**Bukan:** ERP · Akuntansi double-entry · Form panjang

---

## PRODUCT SCOPE V1

| Modul | Status |
|---|---|
| Dashboard | ✅ |
| Nota Penjualan & Pembelian | ✅ |
| Manajemen Barang | ✅ |
| Manajemen Supplier & Customer | ✅ |
| Laporan Harian / Bulanan / Tahunan | ✅ |
| Pengaturan + Backup | ✅ |
| PWA Offline | ✅ |
| Auth (Supabase) + Multi User | ✅ |
| Cloud Sync (Supabase) | ✅ |
| Barcode · QR Nota | ❌ V2+ |

---

## USER PERSONA

| Persona | Kebutuhan | Prioritas |
|---|---|---|
| Pemilik Toko (Budi, 45) | Nota cepat, laba hari ini | Kecepatan |
| Distributor (Siti, 38) | Banyak transaksi, laporan bulanan | Laporan |
| Kios Pertanian (Joko, 50) | Beli supplier, jual petani, pantau stok | Stok |

---

## APPROVAL RULES ⚠️ HYBRID

### Kategori KRITIS — Wajib Change Plan dulu, tunggu approval sebelum coding:
- Auth flow (`authService`, Supabase session)
- Sync logic (`syncService`, conflict resolution)
- Database schema (Dexie migrations, Supabase schema)
- Inventory logic (stock movement, rollback)

### Kategori UI/Feature — Langsung kerjakan, jelaskan setelah selesai:
- UI komponen baru
- Halaman baru
- Styling / dark mode
- Form baru
- Laporan baru
- Isolated bug fix (typo, icon, warna)

### Format Change Plan (wajib untuk kategori KRITIS):

```
Task:
Affected Files:
New Files:
Database Changes (Dexie):
Database Changes (Supabase):
Migration Required:
Risk Level: Low / Medium / High
Test Checklist:
```

---

## PROJECT PRIORITIES

Urutan prioritas penanganan masalah:
1. Bug Fixes (data rusak / hilang)
2. Data Safety
3. Inventory Accuracy
4. Sync Stability
5. New Features
6. UI Improvements
7. Refactoring

**Business accuracy lebih penting dari visual effects.**
**Jangan pernah korbankan data integrity untuk UI.**

---

## VALIDATION RULES

Aturan validasi wajib di semua form. Pesan error dalam bahasa Indonesia.

### Nama (produk, mitra, dll)
- Minimal 2 karakter, maksimal 100 karakter
- Tidak boleh kosong
- Karakter tidak diizinkan: `* ( ) ^ % $ # @`
- Nama toko/organisasi: boleh `&` dan `-`

### Qty item transaksi
- Minimal: 1
- Maksimal normal: 999.999
- **Pengecualian harga tinggi:** Jika harga satuan ≥ Rp 100.000.000, maka qty maksimal 9.999 — ini untuk menghindari nilai transaksi yang tidak wajar akibat salah input.

### Harga (beli/jual)
- Minimal: 0
- Maksimal: Rp 999.999.999.999 (hampir 1 triliun)

### Diskon nominal
- Minimal: 0
- Maksimal: sama dengan subtotal (tidak boleh melebihi total belanja)

### Diskon persen
- Minimal: 0
- Maksimal: 100

### Email
- Wajib format email valid (ada `@` dan domain)

### Nama organisasi / toko
- Minimal 2 karakter, maksimal 60 karakter

---

## ARCHITECTURE — ALUR WAJIB

```
UI Component / Page
  ↓
Zustand Store (state cache)
  ↓
Service (business logic)
  ↓
Repository (query database)
  ↓
Dexie (IndexedDB — local source of truth)
  ↕  (background, non-blocking)
Supabase (cloud sync)
```

**DILARANG KERAS:** UI Component → `db.xxx` langsung tanpa melewati layer Service/Repository.

**Sync tidak pernah memblokir transaksi lokal.**
Flow wajib: `Simpan Lokal → Update UI → Queue Sync → Background Upload`

---

## FOLDER STRUCTURE

```
src/
├── core/
│   ├── version.ts          ← SATU-SATUNYA sumber versi
│   ├── config.ts           ← konstanta app (APP_NAME, CURRENCY_SYMBOL, dll)
│   └── errors.ts           ← AppError, ValidationError, DatabaseError, SyncError
│
├── db/
│   ├── database.ts         ← Dexie init + semua tabel
│   └── migrations/         ← kosong untuk V1, siap diisi saat schema berubah
│
├── repositories/
│   ├── ProductRepository.ts
│   ├── PartnerRepository.ts
│   ├── TransactionRepository.ts
│   ├── SettingsRepository.ts
│   └── ReportRepository.ts
│
├── services/
│   ├── authService.ts      ← login, logout, session restore (KRITIS)
│   ├── syncService.ts      ← Supabase sync, queue, retry (KRITIS)
│   ├── productService.ts
│   ├── partnerService.ts
│   ├── transactionService.ts
│   ├── reportService.ts
│   ├── backupService.ts
│   ├── settingsService.ts
│   └── activityLogService.ts
│
├── state/
│   ├── authStore.ts
│   ├── productStore.ts
│   ├── partnerStore.ts
│   ├── transactionStore.ts
│   ├── settingsStore.ts
│   └── uiStore.ts
│
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── ResetPasswordPage.tsx
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── TrendChart.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── TopProducts.tsx
│   │   └── useDashboardData.ts
│   ├── transactions/
│   │   ├── TransactionListPage.tsx
│   │   ├── TransactionDetailSheet.tsx  ← NEW v1.3.0
│   │   ├── TransactionInputScreen.tsx
│   │   ├── ProductPickerSheet.tsx
│   │   ├── TransactionItemRow.tsx
│   │   ├── StickySummary.tsx
│   │   ├── CartTable.tsx
│   │   ├── ItemBuilder.tsx
│   │   ├── PartnerSearch.tsx
│   │   ├── BankInlineField.tsx
│   │   └── useTransactionForm.ts
│   ├── products/
│   │   ├── ProductListPage.tsx
│   │   └── ProductFormSheet.tsx
│   ├── partners/
│   │   ├── SupplierListPage.tsx
│   │   ├── CustomerListPage.tsx
│   │   └── PartnerFormSheet.tsx
│   ├── reports/
│   │   ├── ReportPage.tsx
│   │   ├── DailyReport.tsx
│   │   ├── MonthlyReport.tsx
│   │   └── YearlyReport.tsx
│   └── settings/
│       ├── SettingsPage.tsx
│       ├── BackupRestore.tsx
│       ├── ThemeToggle.tsx
│       └── OrgSettings.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   └── shared/
│       ├── MoneyDisplay.tsx
│       ├── StatusBadge.tsx
│       ├── SyncBadge.tsx        ← indikator online/offline/pending
│       ├── EmptyState.tsx
│       ├── LoadingSpinner.tsx
│       ├── SkeletonCard.tsx
│       └── ConfirmDialog.tsx
│
├── hooks/
│   ├── useResponsive.ts
│   ├── useDebounce.ts
│   ├── useOnlineStatus.ts      ← deteksi online/offline
│   └── useSync.ts              ← trigger sync saat kembali online
│
├── utils/
│   ├── format.ts               ← formatRupiah, formatDate, formatTime
│   ├── id.ts                   ← generateId, generateNoteCode
│   └── discount.ts             ← hitungDiskon (support % dan nominal)
│
├── types/
│   ├── product.ts
│   ├── partner.ts
│   ├── transaction.ts
│   ├── auth.ts
│   └── common.ts
│
└── app/
    ├── App.tsx
    ├── router.tsx
    └── providers.tsx
```

**Aturan file:**
- File > 300 baris → evaluasi apakah perlu dipecah
- File > 500 baris → **wajib dipecah**
- Satu file = satu tanggung jawab

---

## DATABASE SCHEMA (Dexie — Local)

```ts
// src/db/database.ts
import Dexie, { Table } from 'dexie'
import { DB_SCHEMA_VERSION } from '../core/config'

export class NotaraDB extends Dexie {
  products!:         Table<Product>
  partners!:         Table<Partner>
  transactions!:     Table<Transaction>
  transactionItems!: Table<TransactionItem>
  settings!:         Table<Setting>
  activityLogs!:     Table<ActivityLog>
  syncQueue!:        Table<SyncQueueItem>   // antrian sync ke Supabase

  constructor() {
    super('NotaraDB')
    this.version(DB_SCHEMA_VERSION).stores({
      products:         '&id, name, category, isArchived, syncStatus',
      partners:         '&id, name, type, isArchived, syncStatus',
      transactions:     '&id, type, partnerId, date, status, deletedAt, syncStatus',
      transactionItems: '&id, transactionId, productId',
      settings:         '&key',
      activityLogs:     '&id, entity, action, createdAt',
      syncQueue:        '&id, table, action, createdAt',
    })
  }
}

export const db = new NotaraDB()
```

### Transaction type (v1.3.0 — tambahan payMethod, dpAmount, dueDate)
```ts
export interface Transaction {
  id:            string
  code:          string           // INV-YYYYMMDD-NNN
  type:          TransactionType  // SALE | PURCHASE
  status:        TransactionStatus
  partnerId:     string
  date:          string
  notes?:        string
  discountType:  'nominal' | 'percent'
  discountValue: number
  discount:      number
  subtotal:      number
  total:         number
  payMethod:     PayMethod        // CASH | TRANSFER | DP — NEW v1.3.0
  dpAmount:      number           // 0 jika bukan DP — NEW v1.3.0
  dueDate?:      string           // rencana pelunasan — NEW v1.3.0
  syncStatus:    SyncStatus
  createdAt:     string
  updatedAt:     string
  deletedAt?:    string
}
```

---

## BUSINESS RULES — TRANSAKSI

### Stok
- SALE → stok BERKURANG
- PURCHASE → stok BERTAMBAH
- Edit nota: rollback stok lama → terapkan stok baru (dalam 1 db.transaction)
- Hapus nota (soft delete): rollback stok otomatis
- Blok transaksi SALE jika stok tidak mencukupi

### Nomor Nota
- Format: `INV-YYYYMMDD-NNN`
- Nomor tidak pernah di-recycle (termasuk nota yang dihapus)
- Prefix `INV` (bukan NOT)

### Snapshot
- `productName`, `unit`, `buyPrice`, `sellPrice` di `transactionItems` adalah SNAPSHOT saat transaksi
- Ubah harga produk tidak mempengaruhi nota lama

### DP & Piutang
- `payMethod = 'DP'` → `dpAmount` wajib > 0
- `sisa = total - dpAmount`
- `dueDate` = tanggal rencana pelunasan

---

## CODING RULES

```
✅ Selalu lewati Service → Repository → Dexie
✅ Gunakan crypto.randomUUID() untuk ID
✅ Timestamp selalu ISO 8601 (new Date().toISOString())
✅ Pesan error user-facing dalam bahasa Indonesia
✅ Gunakan CSS variables (--green, --amber, dll)
✅ Komponen < 300 baris; pecah jika lebih
✅ useLiveQuery untuk reaktivitas UI dari Dexie

❌ Akses db.xxx langsung dari component
❌ Integer sebagai primary key
❌ Komponen duplikat
❌ File > 500 baris tanpa pemecahan
❌ useState untuk data yang perlu persist ke DB
❌ dangerouslySetInnerHTML
❌ Hard delete data yang sudah bertransaksi
❌ Block transaksi lokal menunggu sync cloud
❌ Expose service_role key ke frontend
❌ Minify source code development
❌ console.log tertinggal di production code

JIKA RAGU:
→ Tanya: "Apakah ini mudah dirawat 10 tahun lagi?"
→ Pilih verbose tapi jelas daripada pintar tapi sulit dibaca
→ Jika menyentuh auth/sync/db → buat Change Plan dulu
```

---

## ANTI-REGRESSION RULES

Jika memodifikasi `authService`, `syncService`, `database.ts`, atau inventory logic — verifikasi bahwa ini masih bekerja:
- Login & logout
- Session restore saat offline
- Inventory (stock movement)
- Transaksi (tambah, edit, hapus)
- Laporan
- Sync (online & resume setelah offline)

---

## BACKUP FORMAT

```json
{
  "app":       "NOTARA",
  "version":   "1.0.0",
  "timestamp": "2026-06-04T14:30:00.000Z",
  "data": {
    "products":         [],
    "partners":         [],
    "transactions":     [],
    "transactionItems": [],
    "settings":         []
  }
}
```

Saat restore: validasi `version` major harus sama. Jika berbeda → tolak dengan pesan error.

---

## PWA CONFIG

```ts
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'NOTARA', short_name: 'NOTARA',
    theme_color: '#2563EB', background_color: '#F8FAFC',
    display: 'standalone', start_url: '/',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
})
```

---

## DEPLOY — NETLIFY DROP

```
Deploy target : Netlify Drop (drag-and-drop)
URL           : https://app.netlify.com/drop
Cara deploy   : npm run build → drag folder `dist` ke Netlify Drop
Preview       : URL unik per deploy, otomatis tersedia setelah upload
```

**Environment Variables wajib diset di Netlify (Site settings → Environment variables):**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## TESTING CHECKLIST

**Authentication:**
- [ ] Login email/password
- [ ] Logout
- [ ] Session restore (tutup & buka browser)
- [ ] Login saat offline (session lokal)
- [ ] Lupa password

**Inventory:**
- [ ] Tambah produk
- [ ] Edit produk (harga tidak ubah nota lama)
- [ ] Archive produk (sudah bertransaksi)
- [ ] Blok stok minus

**Transaksi:**
- [ ] Buat nota penjualan
- [ ] Buat nota pembelian
- [ ] Edit nota (rollback stok lama, terapkan baru)
- [ ] Hapus nota (rollback stok)
- [ ] Diskon nominal dan persen
- [ ] Nomor nota tidak recycle
- [ ] Detail nota terbuka dengan benar
- [ ] DP flow (dpAmount, dueDate, sisa)

**Sync:**
- [ ] Simpan offline → sync saat online
- [ ] Retry failed sync
- [ ] SyncBadge status akurat
- [ ] Multi device (data konsisten)

**Laporan:**
- [ ] Harian, bulanan, tahunan
- [ ] Laba terhitung benar

**Backup:**
- [ ] Export backup
- [ ] Import backup (validasi versi)

**UI:**
- [ ] Light mode & dark mode
- [ ] Mobile 390px & desktop 1440px
- [ ] Empty state di semua halaman list
- [ ] Loading skeleton

---

## DEFINITION OF DONE

Fitur dianggap selesai jika:
- [ ] UI selesai, responsive 390px–1440px
- [ ] Light mode & dark mode terlihat bagus
- [ ] Form validasi Zod dengan pesan bahasa Indonesia
- [ ] Repository & Service diimplementasi
- [ ] Business rules diikuti (stok, snapshot, rollback)
- [ ] Error handling dengan AppError + toast
- [ ] ActivityLog tercatat
- [ ] Empty state ada
- [ ] Loading state ada
- [ ] Sync queue berjalan (jika entity yang disync)
- [ ] Offline berjalan
- [ ] Testing checklist yang relevan dijalankan manual
- [ ] CLAUDE.md diupdate (task status, riwayat versi)

---

## SOURCE OF TRUTH RULE

- Selalu gunakan ZIP terbaru yang di-upload user.
- Jangan asumsikan ZIP lama adalah yang terbaru.
- Jika ada beberapa ZIP, tanya user mana yang jadi source of truth.
- **Jangan pernah menebak.**

---

## BUG YANG PERNAH TERJADI (Jangan Diulang)

- Jangan tambah logika tidak diminta saat sedang fix bug — fix area yang diminta saja.
- Konfirm dialog: set onclick handler setiap kali dipanggil, bukan cuma sekali di init.
- ZIP output: konten langsung di root, tidak ada folder wrapper.
- Nama file ZIP: `notara-vX.X.X.zip`, bukan format lain.
- **syncService drainQueue (v1.8.0):** payload dikirim dalam camelCase — Supabase butuh snake_case. Selalu konversi dengan `camelToSnake()` sebelum `JSON.stringify`. Selalu inject `user_id` ke payload upsert agar RLS Supabase tidak tolak baris.

---

## TECH DEBT & ROADMAP

### ✅ Sudah selesai
- v1.0.0: Fondasi project, folder structure, types, db schema
- v1.1.0: Core layer (errors, version), repositories, services, Zustand stores
- v1.2.0: Halaman Products & Partners
- v1.3.0: Halaman Transaksi (list, detail sheet, create, edit, hapus)

### ✅ Semua task V1 selesai
| No | Task | Status |
|---|---|---|
| 5 | Dashboard | ✅ Done v1.4.0 |

### ⏳ Roadmap Fitur

**V2:**
- Barcode scanner
- QR nota
- Multi cabang

**V3:**
- Hutang supplier
- Piutang customer
- Customer reminder

**Future SaaS:**
- Role management granular
- Subscription billing
- Team invitations
- Push notifications

---

## RIWAYAT VERSI

| Versi | Perubahan |
|---|---|
| v1.8.1 | Fix bug sync: camelToSnake konversi payload sebelum upload ke Supabase, inject user_id di setiap upsert, drainQueue terima parameter userId |
| v1.8.0 | Task 9: Cloud Sync — syncService (drain queue + pull Supabase, last-write-wins), useSync hook (auto-trigger + periodic 5min), useOnlineStatus hook, SyncBadge component, wire enqueue ke productService/partnerService/transactionService, supabase/schema.sql |
| v1.7.0 | Task 8: Auth flow (Login, Logout, Session Restore, Forgot/Reset Password) — authService, authStore, LoginPage, ForgotPasswordPage, ResetPasswordPage, ProtectedRoute, PublicRoute, @supabase/supabase-js |
| v1.6.0 | Task 7: SettingsPage (OrgSettings — nama/tagline/rekening bank ke Dexie, BackupRestore — export JSON + import dengan validasi major version, ThemeToggle — light/dark/system dengan localStorage) |
| v1.5.0 | Task 6: ReportPage (tab Harian/Bulanan/Tahunan), DailyReport (navigator tanggal + list transaksi), MonthlyReport (heatmap harian + top produk), YearlyReport (bar chart + tabel 12 bulan), useReportData hook |
| v1.4.0 | Task 5: Dashboard lengkap — SummaryCards dengan kartu Piutang & Utang (logic DP), fix useReceivablePayable (proxy → payMethod=DP), DashboardPage pass prop rp, bump versi |
| v1.3.0 | Task 4: TransactionListPage (list + filter + summary cards), TransactionDetailSheet (bottom sheet detail + edit/hapus), update useTransactionForm (edit mode + payMethod/dpAmount/dueDate), update transactionService & types/transaction.ts, tambah validasi rules di CLAUDE.md, update deploy notes ke Netlify Drop |
| v1.2.1 | Update CLAUDE.md: nomor nota ganti prefix NOT→INV (format INV-YYYYMMDD-NNN); sync order fix: drainQueue dulu baru syncFromSupabase |
| v1.2.0 | Task 3: ProductListPage, ProductFormSheet, CustomerListPage, SupplierListPage, PartnerListPage, PartnerFormSheet, ToastContainer, ConfirmDialog |
| v1.1.0 | Task 2: repositories, services, Zustand stores, core/errors |
| v1.0.0 | Initial release — NOTARA dari nol, stack React + TS + Supabase |

---

## CHECKLIST SEBELUM DEPLOY KE NETLIFY DROP

- [ ] Versi sudah naik di `src/core/version.ts`
- [ ] CLAUDE.md sudah diupdate (task status + riwayat versi)
- [ ] Tidak ada fungsi kritis yang tersentuh tanpa alasan
- [ ] Tidak ada `console.log` tertinggal
- [ ] `npm run build` sukses tanpa error
- [ ] TypeScript tanpa error (`tsc --noEmit`)
- [ ] Nama file ZIP benar: `notara-vX.X.X.zip`
- [ ] Konten ZIP langsung di root, tidak ada folder wrapper
- [ ] Drag folder `dist` ke https://app.netlify.com/drop

---

## KEPUTUSAN DESAIN (hasil diskusi, berlaku mulai Task 2 rev)

### Navigation
```
Bottom Nav: Dashboard | Transaksi | [+] | Barang | Menu
```
- **Menu** (slot ke-5) = bottom sheet berisi: Mitra, Laporan, Pengaturan, Backup, Arsip/Trash
- **Pengaturan** dipindah ke icon gear di TopBar kanan
- **Barang** = halaman manajemen produk

### TopBar (kiri → kanan)
1. Brand NOTARA (logo + nama + subtitle)
2. *(flex spacer)*
3. Pill **Online/Offline** — selalu visible, hijau/merah
4. Tombol **Cetak Nota** (icon receipt) — global, buka NotaPickerSheet
5. Icon **Gear** → Settings page

### Sync Banner
- Slide down dari atas saat status = syncing
- Auto-hide setelah sync selesai
- Persis behavior `#sync-status` farm-v4

### Cetak Nota Flow (SALE + PURCHASE)
1. Tap Cetak Nota → NotaPickerSheet
2. Pilih tipe: Penjualan | Pembelian
3. Search/pilih mitra (Customer → SALE, Supplier → PURCHASE)
4. Daftar transaksi mitra, multi-select per tanggal
5. Generate nota → overlay persis farm-v4

**Blok Payment Info nota:**
- SALE: rekening toko (dari Settings) — customer transfer ke kita
- PURCHASE: rekening supplier (dari `partners.bankName/accountNo/accountName`) — kita transfer ke mereka
- Keduanya bisa di-copy ke clipboard

### Schema Partner (tambahan)
```ts
bankName?:    string
accountNo?:   string
accountName?: string
```

### Form Input Transaksi — inline rekening mitra
- Setelah pilih mitra → cek apakah partner punya rekening
- Kalau belum → tampil opsional inline "Tambah rekening [nama]?"
- Kalau sudah → preview rekening, bisa ganti

### Utang & Piutang (V1, bukan V3)
- **Piutang** = customer SALE belum lunas / DP → dilacak di dashboard
- **Utang** = kita belum bayar supplier PURCHASE / DP → dilacak di dashboard
- Dashboard: kartu Piutang (hijau) + kartu Utang (merah)
- Halaman Mitra: per-record tampil saldo piutang/utang

### DP Flow
- SALE DP: customer bayar sebagian → sisa = piutang kita
- PURCHASE DP: kita bayar sebagian → sisa = utang kita ke supplier
- Nota mencantumkan: metode (Cash/Transfer), nominal DP, sisa, tanggal rencana lunas
