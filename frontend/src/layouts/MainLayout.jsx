import { Outlet, useNavigate } from 'react-router-dom'
import logo from '../images/logoen.png'
import { useAuth } from '../context/AuthContext'

export default function MainLayout() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={styles.logoWrapper}>
          <div style={styles.glowRing}>
            <img src={logo} alt="Energy Transfo" style={styles.logo} />
          </div>
          <div style={styles.brandText}>
            <span style={styles.brandTitle}>TRANSFO</span>
            <span style={styles.brandSub}>LOCATE</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={styles.badge}>⚡ Système de localisation</span>
          {auth && (
            <button style={styles.logoutBtn} onClick={handleLogout}>Se déconnecter</button>
          )}
        </div>
      </header>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    background: 'linear-gradient(135deg, #0f2544 0%, #1e3a5f 60%, #0f2544 100%)',
    borderBottom: '3px solid #f97316',
    padding: '0.75rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
  },
  glowRing: {
    padding: '4px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #f97316, #fb923c)',
    boxShadow: '0 0 18px rgba(249,115,22,0.6)',
  },
  logo: {
    height: '48px',
    display: 'block',
    borderRadius: '8px',
    background: '#fff',
    padding: '2px 4px',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  },
  brandTitle: {
    fontSize: '1.4rem',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '0.12em',
  },
  brandSub: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#f97316',
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
  },
  badge: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '0.3rem 0.75rem',
    borderRadius: '999px',
    letterSpacing: '0.05em',
  },
  logoutBtn: {
    padding: '0.35rem 0.9rem',
    borderRadius: '999px',
    border: '1px solid rgba(249,115,22,0.4)',
    background: 'transparent',
    color: '#f97316',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  main: { flex: 1, padding: '2rem', background: 'radial-gradient(ellipse at 20% 0%, rgba(249,115,22,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(30,58,95,0.4) 0%, transparent 60%), #0b1829' },
}
