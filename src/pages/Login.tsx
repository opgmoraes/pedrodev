import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebaseClient'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.88c2.27-2.09 3.58-5.17 3.58-8.8z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.98c-1.07.72-2.45 1.16-4.05 1.16-3.11 0-5.75-2.1-6.69-4.92H1.3v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.31 14.35a7.2 7.2 0 0 1 0-4.7V6.56H1.3a12 12 0 0 0 0 10.88l4.01-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.56l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z" />
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err: any) {
      setError('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setGoogleLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/admin')
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError('Não foi possível entrar com o Google. Tenta de novo.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Painel do formulário */}
      <div className="flex items-center justify-center px-6 py-16">
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div className="mono" style={{ color: 'var(--accent)', fontSize: 14, marginBottom: 28 }}>pedro.tech</div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Bem-vindo de volta</h1>
          <p className="page-subtitle">Entra pra ver clientes, projetos e orçamentos.</p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4 }}
          >
            <GoogleIcon />
            {googleLoading ? 'entrando…' : 'Entrar com Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-faint)' }}>ou com e-mail</span>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <label>e-mail</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" />
            <label>senha</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required autoComplete="current-password" />
            {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>{error}</p>}
            <button style={{ marginTop: 20, width: '100%' }} disabled={loading}>
              {loading ? 'entrando…' : 'entrar'}
            </button>
          </form>
        </div>
      </div>

      {/* Painel visual — some em telas pequenas */}
      <div className="hidden md:flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-alt)', borderLeft: '1px solid var(--border)' }}>
        <div
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            opacity: 0.35,
            filter: 'blur(40px)',
          }}
        />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 320 }}>
          <div className="mono" style={{ color: 'var(--accent)', fontSize: 15, marginBottom: 10 }}>pedro.tech</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Painel interno pra acompanhar clientes, projetos, orçamentos e contratos num só lugar.
          </p>
        </div>
      </div>
    </div>
  )
}
