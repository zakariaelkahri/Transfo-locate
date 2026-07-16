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
      <p style={styles.subtitle}>Entrez la référence article pour obtenir les instructions d'emplacement.</p>

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
  container: { maxWidth: '560px', margin: '0 auto' },
  title: { fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' },
  subtitle: { color: '#64748b', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  error: { marginTop: '1rem', color: '#dc2626' },
}
