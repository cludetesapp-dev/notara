// ═══════════════════════════════════════════════════
// state/uiStore.ts
// Global UI state — toast, confirm dialog, overlay
// ═══════════════════════════════════════════════════

import { create } from 'zustand'

export interface Toast {
  id:      string
  type:    'success' | 'error' | 'info' | 'warning'
  message: string
}

interface ConfirmDialog {
  open:     boolean
  title:    string
  message:  string
  onConfirm: () => void
}

interface UiState {
  toasts:  Toast[]
  confirm: ConfirmDialog

  toast:        (type: Toast['type'], message: string) => void
  dismissToast: (id: string) => void
  showConfirm:  (title: string, message: string, onConfirm: () => void) => void
  closeConfirm: () => void
}

const EMPTY_CONFIRM: ConfirmDialog = {
  open:      false,
  title:     '',
  message:   '',
  onConfirm: () => {},
}

export const useUiStore = create<UiState>((set) => ({
  toasts:  [],
  confirm: EMPTY_CONFIRM,

  toast(type, message) {
    const id = crypto.randomUUID()
    set(s => ({ toasts: [...s.toasts, { id, type, message }] }))
    // Auto-dismiss setelah 3.5 detik
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, 3500)
  },

  dismissToast(id) {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
  },

  showConfirm(title, message, onConfirm) {
    set({ confirm: { open: true, title, message, onConfirm } })
  },

  closeConfirm() {
    set({ confirm: EMPTY_CONFIRM })
  },
}))
