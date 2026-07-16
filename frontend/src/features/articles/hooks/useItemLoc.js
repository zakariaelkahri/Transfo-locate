import { useState } from 'react'
import { getItemLoc } from '../services/articlesApi'

export function useItemLoc() {
  const [loc, setLoc] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(itmref) {
    setLoading(true)
    setError(null)
    setLoc(null) 
    try {
      const data = await getItemLoc(itmref)
      setLoc(data)    
    } catch {
      setError('Article introuvable ou emplacement non défini.')
    } finally {
      setLoading(false)
    }
  }

  return { loc, loading, error, search }
}
