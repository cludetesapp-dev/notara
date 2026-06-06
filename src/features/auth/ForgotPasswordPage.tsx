// ═══════════════════════════════════════════════════
// features/auth/ForgotPasswordPage.tsx
// Halaman Lupa Password
// ═══════════════════════════════════════════════════

import { useState }           from 'react'
import { Link }               from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { sendPasswordReset, IS_DEV_MODE } from '@/services/authService'
import { AuthError }          from '@/core/errors'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [sent,    setSent]    = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = email.trim()
    if (!trimmed) return setError('Email wajib diisi.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
      return setError('Format email tidak valid.')

    setLoading(true)
    try {
      await sendPasswordReset(trimmed)
      setSent(true)
    } catch (err) {
      if (err instanceof AuthError) setError(err.message)
      else setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:      '100dvh',
      background:     'var(--bg)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Back */}
        <Link
          to="/login"
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        6,
            fontSize:   13,
            fontWeight: 600,
            color:      'var(--clay)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          Kembali ke Login
        </Link>

        {/* Logo mini */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background:    'var(--soil)',
            borderRadius:  8,
            display:       'flex',
            alignItems:    'center',
            justifyContent: 'center',
            flexShrink:    0,
          }}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M6 30V6l18 18V6" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--soil)', letterSpacing: -0.3 }}>NOTARA</div>
            <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 500 }}>Reset Password</div>
          </div>
        </div>

        {sent ? (
          /* ── Sukses ── */
          <div style={{
            background:   '#fff',
            border:       '1.5px solid var(--border)',
            borderRadius: 'var(--r)',
            padding:      '28px 20px',
            textAlign:    'center',
            display:      'flex',
            flexDirection: 'column',
            alignItems:   'center',
            gap:          12,
          }}>
            <CheckCircle size={40} color="var(--soil)" strokeWidth={1.5} />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--soil)' }}>
              Email terkirim!
            </div>
            <div style={{ fontSize: 13, color: 'var(--stone)', lineHeight: 1.6 }}>
              {IS_DEV_MODE
                ? 'Dev mode — tidak ada email yang dikirim.'
                : `Link reset password sudah dikirim ke ${email}. Cek kotak masuk (atau folder spam).`}
            </div>
            <Link
              to="/login"
              style={{
                marginTop:    8,
                display:      'block',
                background:   'var(--soil)',
                color:        '#fff',
                borderRadius: 8,
                padding:      '11px 28px',
                fontSize:     13,
                fontWeight:   700,
                textDecoration: 'none',
              }}
            >
              Kembali ke Login
            </Link>
          </div>
        ) : (
          /* ── Form ── */
          <form
            onSubmit={handleSubmit}
            style={{
              background:    '#fff',
              border:        '1.5px solid var(--border)',
              borderRadius:  'var(--r)',
              padding:       '24px 20px',
              display:       'flex',
              flexDirection: 'column',
              gap:           16,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--soil)', marginBottom: 6 }}>
                Lupa password?
              </div>
              <div style={{ fontSize: 13, color: 'var(--stone)', lineHeight: 1.6 }}>
                Masukkan email akun kamu. Kami akan kirim link untuk membuat password baru.
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border:     '1px solid #fecaca',
                borderRadius: 8,
                padding:    '10px 12px',
                fontSize:   13,
                color:      'var(--red)',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

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
                style={{
                  width: '100%', border: '1.5px solid var(--border)',
                  borderRadius: 8, padding: '11px 12px', fontSize: 14,
                  color: 'var(--soil)', background: '#fff', outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

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
              }}
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
