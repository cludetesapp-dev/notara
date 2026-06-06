// ═══════════════════════════════════════════════════
// features/auth/ResetPasswordPage.tsx
// Halaman Reset Password — dipanggil setelah klik link email
// ═══════════════════════════════════════════════════

import { useState }           from 'react'
import { useNavigate, Link }  from 'react-router-dom'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { updatePassword }     from '@/services/authService'
import { AuthError }          from '@/core/errors'

export default function ResetPasswordPage() {
  const navigate              = useNavigate()
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [success,   setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6)      return setError('Password minimal 6 karakter.')
    if (password !== confirm)      return setError('Konfirmasi password tidak cocok.')

    setLoading(true)
    try {
      await updatePassword(password)
      setSuccess(true)
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch (err) {
      if (err instanceof AuthError) setError(err.message)
      else setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid var(--border)',
    borderRadius: 8, padding: '11px 12px', fontSize: 14,
    color: 'var(--soil)', background: '#fff', outline: 'none',
    fontFamily: 'inherit',
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

        {/* Logo mini */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--soil)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M6 30V6l18 18V6" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--soil)', letterSpacing: -0.3 }}>NOTARA</div>
            <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 500 }}>Buat Password Baru</div>
          </div>
        </div>

        {success ? (
          <div style={{
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: 'var(--r)', padding: '28px 20px',
            textAlign: 'center', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 12,
          }}>
            <CheckCircle size={40} color="var(--soil)" strokeWidth={1.5} />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--soil)' }}>
              Password berhasil diubah!
            </div>
            <div style={{ fontSize: 13, color: 'var(--stone)', lineHeight: 1.6 }}>
              Kamu akan diarahkan ke halaman login dalam 3 detik...
            </div>
            <Link
              to="/login"
              style={{
                marginTop: 8, display: 'block', background: 'var(--soil)',
                color: '#fff', borderRadius: 8, padding: '11px 28px',
                fontSize: 13, fontWeight: 700, textDecoration: 'none',
              }}
            >
              Login Sekarang
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#fff', border: '1.5px solid var(--border)',
              borderRadius: 'var(--r)', padding: '24px 20px',
              display: 'flex', flexDirection: 'column', gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--soil)', marginBottom: 6 }}>
                Buat password baru
              </div>
              <div style={{ fontSize: 13, color: 'var(--stone)', lineHeight: 1.6 }}>
                Masukkan password baru kamu. Minimal 6 karakter.
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '10px 12px',
                fontSize: 13, color: 'var(--red)', fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Password baru */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--clay)' }}>Password Baru</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  disabled={loading}
                  style={{ ...inputStyle, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--stone)', padding: 0, display: 'flex',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--clay)' }}>Konfirmasi Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Ketik ulang password"
                disabled={loading}
                style={inputStyle}
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
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
