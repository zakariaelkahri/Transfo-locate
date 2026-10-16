import { useState } from 'react'
import Button from '../../../components/Button'
import { downloadResults } from '../services/resultsExport.mjs'

export default function ExportButton({ getData, filename }) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  async function handleExport() {
    setExporting(true)
    setError('')
    try {
      await downloadResults(getData(), filename)
    } catch {
      setError("Impossible d’exporter le fichier Excel. Veuillez réessayer.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
      <Button type="button" disabled={exporting} onClick={handleExport}>
        {exporting ? 'Export en cours…' : 'Exporter Excel'}
      </Button>
      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Exporter les résultats affichés (.xlsx)</span>
      {error && <span role="alert" style={{ color: '#fca5a5' }}>{error}</span>}
    </div>
  )
}
