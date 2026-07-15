import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <span style={styles.logo}>⚡ Transfo-Locate</span>
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
    background: '#1e3a5f',
    color: '#fff',
    padding: '1rem 2rem',
  },
  logo: { fontSize: '1.25rem', fontWeight: 700 },
  main: { flex: 1, padding: '2rem' },
}
