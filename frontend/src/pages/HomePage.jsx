import { useState } from 'react'
import Button from '../components/Button'
import { LocationResult, useItemLoc } from '../features/articles'

const SEARCH_TYPES = [
  { value: 'itemref', label: 'Référence article', placeholder: 'ex. TRF-001' },
  { value: 'lot', label: 'Lot', placeholder: 'ex. LOT-001' },
]

export default function HomePage() {
  const [code, setCode] = useState('')
  const [searchType, setSearchType] = useState('itemref')
  const { loc, loading, error, search } = useItemLoc()

  const current = SEARCH_TYPES.find(t => t.value === searchType)

  function handleSubmit(e) {
    e.preventDefault()
    if (code.trim()) search(code.trim(), searchType)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔍 Localiser un article</h1>
      <p style={styles.subtitle}>Entrez une référence article pour afficher toutes les lignes disponibles avec leur emplacement détaillé.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          value={searchType}
          onChange={(e) => { setSearchType(e.target.value); setCode('') }}
          style={styles.select}
        >
          {SEARCH_TYPES.map(t => (
            <option key={t.value} value={t.value} style={{ background: '#1e293b', color: '#f1f5f9' }}>{t.label}</option>
          ))}
        </select>
        <input
          style={styles.input}
          placeholder={current.placeholder}
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
    color: '#f1f5f9',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '1.5rem',
    maxWidth: '64ch',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1rem 1.25rem',
    backdropFilter: 'blur(8px)',
    flexWrap: 'wrap',
  },
  error: {
    marginTop: '1rem',
    color: '#fca5a5',
    background: 'rgba(185,28,28,0.15)',
    border: '1px solid rgba(185,28,28,0.35)',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    maxWidth: '720px',
  },
  select: {
    padding: '0.65rem 2.2rem 0.65rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    fontSize: '1rem',
    cursor: 'pointer',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    transition: 'border-color 0.2s',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    minWidth: '160px',
    padding: '0.65rem 1rem',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    background: 'rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    transition: 'border-color 0.2s',
  },
}
