import { useState } from 'react'
import { getItemLoc } from '../services/articlesApi'

export function useItemLoc() {
  const [loc, setLoc] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(itmref) {
    setLoading(true)
    setError(null)
    setLoc([])
    try {
      const data = await getItemLoc(itmref)
      setLoc(Array.isArray(data) ? data : [])
      if (!Array.isArray(data) || data.length === 0) {
        setError('Aucun article trouvé pour cette référence.')
      }
    } catch {
      setError('Article introuvable ou emplacement non défini.')
    } finally {
      setLoading(false)
    }
  }

  return { loc, loading, error, search }
}
