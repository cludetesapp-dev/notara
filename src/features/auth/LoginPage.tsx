// ═══════════════════════════════════════════════════
// features/auth/LoginPage.tsx
// Halaman Login — monochrome design + logo Notara
// ═══════════════════════════════════════════════════

import { useState, useEffect }  from 'react'
import { useNavigate, Link }    from 'react-router-dom'
import { Eye, EyeOff, Wifi, WifiOff } from 'lucide-react'
import { login, IS_DEV_MODE }   from '@/services/authService'
import { useAuthStore }         from '@/state/authStore'
import { AuthError }            from '@/core/errors'

export default function LoginPage() {
  const navigate            = useNavigate()
  const setAuthenticated    = useAuthStore(s => s.setAuthenticated)
  const status              = useAuthStore(s => s.status)

  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [isOnline,   setIsOnline]   = useState(navigator.onLine)

  // Monitor online/offline
  useEffect(() => {
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online',  on)
      window.removeEventListener('offline', off)
    }
  }, [])

  // Jika sudah authenticated, redirect ke dashboard
  useEffect(() => {
    if (status === 'authenticated') navigate('/', { replace: true })
  }, [status, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim())    return setError('Email wajib diisi.')
    if (!password)        return setError('Password wajib diisi.')

    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      setAuthenticated(user)
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof AuthError) setError(err.message)
      else setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:       '100dvh',
      background:      'var(--bg)',
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         '24px 20px',
    }}>

      {/* ── Koneksi banner ── */}
      {!isOnline && (
        <div style={{
          position:    'fixed',
          top:         0,
          left:        0,
          right:       0,
          background:  'var(--soil)',
          color:       '#fff',
          fontSize:    12,
          fontWeight:  600,
          textAlign:   'center',
          padding:     '8px 16px',
          display:     'flex',
          alignItems:  'center',
          justifyContent: 'center',
          gap:         6,
          zIndex:      100,
        }}>
          <WifiOff size={13} />
          Tidak ada koneksi — login hanya tersedia jika punya sesi tersimpan
        </div>
      )}

      <div style={{
        width:     '100%',
        maxWidth:  380,
        display:   'flex',
        flexDirection: 'column',
        gap:       28,
      }}>

        {/* ── Logo + Brand ── */}
        <div style={{ textAlign: 'center' }}>
          {/* Logo Notara — N stilisasi monochrome */}
          <div style={{
            width:           64,
            height:          64,
            background:      'var(--soil)',
            borderRadius:    16,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            margin:          '0 auto 16px',
            boxShadow:       '0 4px 24px rgba(0,0,0,0.15)',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 30V6l18 18V6"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: 'var(--soil)' }}>
            NOTARA
          </div>
          <div style={{ fontSize: 12, color: 'var(--stone)', marginTop: 4, fontWeight: 500 }}>
            Transaction Operating System
          </div>
        </div>

        {/* ── Dev mode badge ── */}
        {IS_DEV_MODE && (
          <div style={{
            background:   'var(--soil)',
            color:        '#fff',
            borderRadius: 10,
            padding:      '10px 14px',
            fontSize:     12,
            fontWeight:   600,
            display:      'flex',
            alignItems:   'center',
            gap:          8,
          }}>
            <Wifi size={13} />
            Dev Mode — klik Masuk untuk bypass auth
          </div>
        )}

        {/* ── Form Card ── */}
        <form
          onSubmit={handleSubmit}
          style={{
            background:   '#fff',
            border:       '1.5px solid var(--border)',
            borderRadius: 'var(--r)',
            padding:      '24px 20px',
            display:      'flex',
            flexDirection: 'column',
            gap:          16,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--soil)', marginBottom: 4 }}>
            Masuk ke akun
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background:   '#fef2f2',
              border:       '1px solid #fecaca',
              borderRadius: 8,
              padding:      '10px 12px',
              fontSize:     13,
              color:        'var(--red)',
              fontWeight:   500,
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--clay)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="kamu@email.com"
              autoComplete="email"
              disabled={loading}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--clay)' }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: 12, color: 'var(--stone)', textDecoration: 'none', fontWeight: 500 }}
              >
                Lupa password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                style={{ ...inputStyle, paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position:   'absolute',
                  right:      12,
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  color:      'var(--stone)',
                  padding:    0,
                  display:    'flex',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background:   loading ? 'var(--stone)' : 'var(--soil)',
              color:        '#fff',
              border:       'none',
              borderRadius: 10,
              padding:      '13px 0',
              fontSize:     14,
              fontWeight:   700,
              cursor:       loading ? 'not-allowed' : 'pointer',
              marginTop:    4,
              transition:   'background 0.15s',
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--stone)', fontWeight: 500 }}>
          © 2026 NOTARA · Offline-First PWA
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width:        '100%',
  border:       '1.5px solid var(--border)',
  borderRadius: 8,
  padding:      '11px 12px',
  fontSize:     14,
  color:        'var(--soil)',
  background:   '#fff',
  outline:      'none',
  fontFamily:   'inherit',
  transition:   'border-color 0.15s',
}
