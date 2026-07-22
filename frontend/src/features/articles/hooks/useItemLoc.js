import { useState } from 'react'
import { getItemLoc, getItemLocByLot } from '../services/articlesApi'

export function useItemLoc() {
  const [loc, setLoc] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(value, type = 'itemref') {
    setLoading(true)
    setError(null)
    setLoc([])
    try {
      const data = type === 'lot' ? await getItemLocByLot(value) : await getItemLoc(value)
      setLoc(Array.isArray(data) ? data : [])
      if (!Array.isArray(data) || data.length === 0) {
        setError('Aucun article trouvé.')
      }
    } catch {
      setError('Article introuvable ou emplacement non défini.')
    } finally {
      setLoading(false)
    }
  }

  return { loc, loading, error, search }
}
