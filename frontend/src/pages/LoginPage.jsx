import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../images/logoen.png'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.status === 401) { setError('Nom d\'utilisateur ou mot de passe incorrect.'); return }
      // if (!res.ok) { setError('Erreur serveur, veuillez réessayer.'); return }

      const data = await res.json()
      const { access_token, user } = data

      if (user.status === 'inactive') { setError('Votre compte est inactif. Contactez l\'administrateur.'); return }
      if (user.status === 'suspended') { setError('Votre compte est suspendu. Contactez l\'administrateur.'); return }

      login(access_token, user)
      navigate(user.role_name === 'admin' ? '/admin' : '/')
      console.log('Connexion réussie !', user)
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <div style={styles.glowRing}>
            <img src={logo} alt="logo" style={styles.logo} />
          </div>
          <div style={styles.brandText}>
            <span style={styles.brandTitle}>TRANSFO</span>
            <span style={styles.brandSub}>LOCATE</span>
          </div>
        </div>

        <h2 style={styles.title}>Connexion</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          {error && <p style={styles.error}>⚠️ {error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 20% 0%, rgba(249,115,22,0.07) 0%, transparent 60%), #0b1829',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '380px',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
  },
  logoWrapper: { display: 'flex', alignItems: 'center', gap: '0.85rem' },
  glowRing: {
    padding: '4px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    boxShadow: '0 0 18px rgba(249,115,22,0.6)',
  },
  logo: { height: '44px', display: 'block', borderRadius: '8px', background: '#fff', padding: '2px 4px' },
  brandText: { display: 'flex', flexDirection: 'column', lineHeight: 1 },
  brandTitle: { fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.12em' },
  brandSub: { fontSize: '0.65rem', fontWeight: 600, color: '#f97316', letterSpacing: '0.35em' },
  title: { color: '#f1f5f9', fontWeight: 700, fontSize: '1.3rem', margin: 0 },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: {
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    fontSize: '1rem',
    outline: 'none',
  },
  error: {
    color: '#fca5a5',
    background: 'rgba(185,28,28,0.15)',
    border: '1px solid rgba(185,28,28,0.35)',
    padding: '0.6rem 0.9rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    margin: 0,
  },
  btn: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.25rem',
  },
}
