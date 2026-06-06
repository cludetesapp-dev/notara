// ═══════════════════════════════════════════════════
// services/activityLogService.ts
// Catat semua operasi penting ke activityLogs
// ═══════════════════════════════════════════════════

import { db } from '@/db/database'
import type { ActivityLog } from '@/types/common'

export type LogAction = ActivityLog['action']

export const activityLogService = {
  async log(
    entity: string,
    entityId: string,
    action: LogAction,
    detail?: string,
  ): Promise<void> {
    const entry: ActivityLog = {
      id:        crypto.randomUUID(),
      entity,
      entityId,
      action,
      detail,
      createdAt: new Date().toISOString(),
    }
    // Log gagal tidak boleh crash operasi utama
    try {
      await db.activityLogs.add(entry)
    } catch {
      // silent — log tidak kritikal
    }
  },
}
