// ═══════════════════════════════════════════════════
// services/syncService.ts — Cloud Sync NOTARA (KRITIS)
//
// Strategy: Offline-First, Last-Write-Wins (updatedAt)
// Flow wajib: Drain Queue → Pull from Supabase
// Sync tidak pernah memblokir operasi lokal.
// ═══════════════════════════════════════════════════

import { db }         from '@/db/database'
import { SyncError }  from '@/core/errors'
import type { SyncQueueItem } from '@/types/common'

// ── Supabase env check ─────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL  as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const SYNC_ENABLED = !!(SUPABASE_URL && SUPABASE_KEY)

// Max percobaan per item sebelum ditandai failed
const MAX_ATTEMPTS = 3

// ── Supabase REST helper ───────────────────────────
// Menggunakan fetch langsung ke Supabase REST API
// agar tidak perlu client SDK di sync layer.

function supabaseHeaders(token?: string): HeadersInit {
  return {
    'Content-Type':  'application/json',
    'apikey':        SUPABASE_KEY!,
    'Authorization': `Bearer ${token ?? SUPABASE_KEY!}`,
    'Prefer':        'resolution=merge-duplicates',
  }
}

async function getAccessToken(): Promise<string> {
  // Import lazy — hanya jika sync enabled
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(SUPABASE_URL!, SUPABASE_KEY!)
  const { data } = await sb.auth.getSession()
  return data.session?.access_token ?? SUPABASE_KEY!
}

// ── Peta nama tabel Dexie → Supabase ──────────────
const TABLE_MAP: Record<string, string> = {
  products:         'products',
  partners:         'partners',
  transactions:     'transactions',
  transactionItems: 'transaction_items',
}

// ── Tambah item ke sync queue ──────────────────────
export async function enqueue(
  table:    string,
  recordId: string,
  action:   'upsert' | 'delete',
  payload:  object,
): Promise<void> {
  if (!SYNC_ENABLED) return

  const item: SyncQueueItem = {
    id:        crypto.randomUUID(),
    table,
    recordId,
    action,
    payload:   JSON.stringify(payload),
    createdAt: new Date().toISOString(),
    attempts:  0,
  }
  await db.syncQueue.put(item)
}

// ── Drain: upload semua item queue ke Supabase ─────
async function drainQueue(token: string, userId: string): Promise<void> {
  const items = await db.syncQueue
    .where('attempts').below(MAX_ATTEMPTS)
    .sortBy('createdAt')

  for (const item of items) {
    const sbTable = TABLE_MAP[item.table]
    if (!sbTable) {
      await db.syncQueue.delete(item.id)
      continue
    }

    try {
      if (item.action === 'upsert') {
        // Konversi camelCase (Dexie) → snake_case (Supabase) + inject user_id
        const camelPayload = JSON.parse(item.payload)
        const snakePayload = camelToSnake(camelPayload)
        snakePayload['user_id'] = userId

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/${sbTable}`,
          {
            method:  'POST',
            headers: { ...supabaseHeaders(token), 'Prefer': 'resolution=merge-duplicates,return=minimal' },
            body:    JSON.stringify(snakePayload),
          }
        )
        if (!res.ok && res.status !== 409) throw new Error(`HTTP ${res.status}`)

      } else if (item.action === 'delete') {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/${sbTable}?id=eq.${item.recordId}`,
          { method: 'DELETE', headers: supabaseHeaders(token) }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      }

      // Sukses → hapus dari queue, tandai synced di Dexie
      await db.syncQueue.delete(item.id)
      await markSynced(item.table, item.recordId)

    } catch {
      // Gagal → increment attempts
      await db.syncQueue.update(item.id, { attempts: item.attempts + 1 })

      // Jika sudah MAX_ATTEMPTS → tandai failed di entity
      if (item.attempts + 1 >= MAX_ATTEMPTS) {
        await markFailed(item.table, item.recordId)
      }
    }
  }
}

// ── Pull: ambil data terbaru dari Supabase ─────────
async function pullFromSupabase(token: string, userId: string): Promise<void> {
  // Pull semua tabel, filter by user_id
  await Promise.all([
    pullTable(token, userId, 'products',         'products'),
    pullTable(token, userId, 'partners',         'partners'),
    pullTable(token, userId, 'transactions',     'transactions'),
    pullTable(token, userId, 'transaction_items','transactionItems'),
  ])
}

async function pullTable(
  token:      string,
  userId:     string,
  sbTable:    string,
  dexieTable: string,
): Promise<void> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${sbTable}?user_id=eq.${userId}&order=updated_at.asc`,
    { headers: supabaseHeaders(token) }
  )
  if (!res.ok) return

  const rows: Record<string, unknown>[] = await res.json()
  if (!rows.length) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dexie = (db as any)[dexieTable]
  if (!dexie) return

  for (const row of rows) {
    const camel = snakeToCamel(row) as { id: string; updatedAt: string; [key:string]: unknown }

    // Last-write-wins: hanya update jika remote lebih baru
    const existing = await dexie.get(camel.id)
    if (existing && existing.updatedAt >= camel.updatedAt) continue

    await dexie.put({ ...camel, syncStatus: 'synced' })
  }
}

// ── Public: jalankan sync lengkap ─────────────────
export async function runSync(userId: string): Promise<void> {
  if (!SYNC_ENABLED) return

  let token: string
  try {
    token = await getAccessToken()
  } catch {
    throw new SyncError('Tidak bisa mendapatkan token auth untuk sync.')
  }

  // Step 1: drain queue dulu (upload lokal)
  await drainQueue(token, userId)

  // Step 2: pull dari Supabase (download remote)
  await pullFromSupabase(token, userId)
}

// ── Reset failed items → pending (retry manual) ───
export async function resetFailedQueue(): Promise<void> {
  const failed = await db.syncQueue
    .filter(item => item.attempts >= MAX_ATTEMPTS)
    .toArray()

  for (const item of failed) {
    await db.syncQueue.update(item.id, { attempts: 0 })
  }
}

// ── Count pending items ────────────────────────────
export async function getPendingCount(): Promise<number> {
  return db.syncQueue.count()
}

// ── Helper: tandai entity sebagai synced / failed ──
async function markSynced(table: string, id: string): Promise<void> {
  await updateSyncStatus(table, id, 'synced')
}

async function markFailed(table: string, id: string): Promise<void> {
  await updateSyncStatus(table, id, 'failed')
}

async function updateSyncStatus(
  table:      string,
  id:         string,
  status:     'synced' | 'failed',
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dexie = (db as any)[table]
  if (!dexie) return
  await dexie.update(id, { syncStatus: status })
}

// ── Snake_case → camelCase (Supabase → Dexie) ─────
function snakeToCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
    result[camel] = val
  }
  return result
}

// ── camelCase → snake_case (Dexie → Supabase) ─────
function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    const snake = key.replace(/([A-Z])/g, (c: string) => `_${c.toLowerCase()}`)
    result[snake] = val
  }
  return result
}
