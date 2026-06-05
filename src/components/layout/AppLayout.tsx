// ═══════════════════════════════════════════════════
// components/layout/AppLayout.tsx
// ═══════════════════════════════════════════════════

import { Outlet }          from 'react-router-dom'
import { TopBar }          from './TopBar'
import { BottomNav }       from './BottomNav'
import { SyncBanner }      from './SyncBanner'
import { MenuSheet }       from './MenuSheet'
import { TransactionInputScreen } from '@/features/transactions/TransactionInputScreen'
import { useTransactionForm }     from '@/features/transactions/useTransactionForm'
import { ToastContainer, ConfirmDialog } from '@/components/shared/Overlays'
import { useUiStore }      from '@/state/uiStore'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useSync }         from '@/hooks/useSync'
import { useState }        from 'react'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  const isOnline = useOnlineStatus()
  const { isSyncing, hasFailed } = useSync()

  const toast  = useUiStore(s => s.toast)
  const txForm = useTransactionForm(() => {
    toast('success', 'Transaksi berhasil disimpan')
  })

  function handleAdd() {
    txForm.openForm('SALE')
  }

  function handlePrintNota() {
    // TODO Task Nota
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <SyncBanner isSyncing={isSyncing} />

      <TopBar
        isOnline={isOnline}
        isSyncing={isSyncing}
        hasFailed={hasFailed}
        onPrintNota={handlePrintNota}
      />

      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Outlet context={{ openTransactionForm: txForm.openForm }} />
      </main>

      <BottomNav
        onAdd={handleAdd}
        onMenu={() => setMenuOpen(true)}
      />

      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <TransactionInputScreen hook={txForm} />

      <ToastContainer />
      <ConfirmDialog />
    </div>
  )
}
