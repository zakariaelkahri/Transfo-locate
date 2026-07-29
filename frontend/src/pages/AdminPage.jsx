import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🛠️ Tableau de bord Admin</h1>
        <p style={styles.welcome}>Bienvenue, <strong>{auth?.user?.username}</strong></p>

        <div style={styles.grid}>
          <div style={styles.tile}>
            <span style={styles.tileIcon}>👥</span>
            <span style={styles.tileLabel}>Gestion des utilisateurs</span>
          </div>
          <div style={styles.tile}>
            <span style={styles.tileIcon}>📦</span>
            <span style={styles.tileLabel}>Gestion du stock</span>
          </div>
          <div style={styles.tile}>
            <span style={styles.tileIcon}>📊</span>
            <span style={styles.tileLabel}>Statistiques</span>
          </div>
          <div style={styles.tile}>
            <span style={styles.tileIcon}>⚙️</span>
            <span style={styles.tileLabel}>Paramètres</span>
          </div>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>Se déconnecter</button>
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
    padding: '2rem',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '600px',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: { color: '#f1f5f9', fontWeight: 800, fontSize: '1.6rem', margin: 0 },
  welcome: { color: '#94a3b8', margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  tile: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  tileIcon: { fontSize: '2rem' },
  tileLabel: { color: '#cbd5e1', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' },
  logoutBtn: {
    padding: '0.7rem',
    borderRadius: '8px',
    border: '1px solid rgba(249,115,22,0.4)',
    background: 'transparent',
    color: '#f97316',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
}
