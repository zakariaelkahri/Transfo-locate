import { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { LocationResult, useItemLoc } from '../features/articles'

export default function HomePage() {
  const [code, setCode] = useState('')
  const { loc, loading, error, search } = useItemLoc()

  function handleSubmit(e) {
    e.preventDefault()
    if (code.trim()) search(code.trim())
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔍 Localiser un article</h1>
      <p style={styles.subtitle}>Entrez une référence article pour afficher toutes les lignes disponibles avec leur emplacement détaillé.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <Input
          label="Référence article"
          placeholder="ex. TRF-001"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button loading={loading} type="submit">Localiser</Button>
      </form>

      {error && <p style={styles.error}>⚠️ {error}</p>}
      <LocationResult loc={loc} />
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
  },
  title: {
    fontSize: '1.85rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '1.5rem',
    maxWidth: '64ch',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px' },
  error: {
    marginTop: '1rem',
    color: '#b91c1c',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    maxWidth: '720px',
  },
}
