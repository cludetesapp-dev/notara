// ═══════════════════════════════════════════════════
// app/router.tsx — Router dengan protected routes
// ═══════════════════════════════════════════════════

import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { AppLayout }       from '@/components/layout/AppLayout'
import DashboardPage       from '@/features/dashboard/DashboardPage'
import TransactionListPage from '@/features/transactions/TransactionListPage'
import ProductListPage     from '@/features/products/ProductListPage'
import CustomerListPage    from '@/features/partners/CustomerListPage'
import SupplierListPage    from '@/features/partners/SupplierListPage'
import ReportPage          from '@/features/reports/ReportPage'
import SettingsPage        from '@/features/settings/SettingsPage'
import LoginPage           from '@/features/auth/LoginPage'
import ForgotPasswordPage  from '@/features/auth/ForgotPasswordPage'
import ResetPasswordPage   from '@/features/auth/ResetPasswordPage'
import { useAuthStore }    from '@/state/authStore'

// ── Loading screen saat startup ────────────────────
function AppLoadingScreen() {
  return (
    <div style={{
      height:          '100dvh',
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      background:      'var(--bg)',
      gap:             16,
    }}>
      <div style={{
        width:           52,
        height:          52,
        background:      'var(--soil)',
        borderRadius:    12,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <path d="M6 30V6l18 18V6" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontSize: 12, color: 'var(--stone)', fontWeight: 600, letterSpacing: 0.5 }}>
        Memuat...
      </div>
    </div>
  )
}

// ── Guard: hanya bisa diakses jika sudah login ─────
function ProtectedRoute() {
  const status = useAuthStore(s => s.status)

  if (status === 'loading')         return <AppLoadingScreen />
  if (status === 'unauthenticated') return <Navigate to="/login" replace />
  return <Outlet />
}

// ── Guard: redirect ke dashboard jika sudah login ──
function PublicRoute() {
  const status = useAuthStore(s => s.status)

  if (status === 'loading')       return <AppLoadingScreen />
  if (status === 'authenticated') return <Navigate to="/" replace />
  return <Outlet />
}

// Placeholder pages
const Placeholder = ({ label }: { label: string }) => (
  <div className="page-scroll">
    <div className="wrap">
      <p style={{ color: 'var(--stone)', fontSize: 13, fontWeight: 600, textAlign: 'center', marginTop: 40 }}>
        {label} — segera hadir
      </p>
    </div>
  </div>
)

export const router = createBrowserRouter([
  // ── Public routes (login, reset password) ─────
  {
    element: <PublicRoute />,
    children: [
      { path: '/login',           element: <LoginPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // Reset password boleh diakses dari email link (tidak pakai PublicRoute)
  { path: '/reset-password', element: <ResetPasswordPage /> },

  // ── Protected routes ───────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true,          element: <DashboardPage /> },
          { path: 'transactions', element: <TransactionListPage /> },
          { path: 'products',     element: <ProductListPage /> },
          { path: 'partners',     element: <CustomerListPage /> },
          { path: 'customers',    element: <CustomerListPage /> },
          { path: 'suppliers',    element: <SupplierListPage /> },
          { path: 'reports',      element: <ReportPage /> },
          { path: 'settings',     element: <SettingsPage /> },
          { path: 'backup',       element: <Placeholder label="Backup" /> },
          { path: 'trash',        element: <Placeholder label="Arsip" /> },
        ],
      },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
])
