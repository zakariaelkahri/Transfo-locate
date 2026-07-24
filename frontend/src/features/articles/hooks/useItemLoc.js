import { useState } from 'react'
import { getItemLoc, getItemLocByLot, getItemLocBySerieNum } from '../services/articlesApi'

export function useItemLoc() {
  const [loc, setLoc] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  async function search(value, type = 'itemref') {
    setLoading(true)
    setError(null)
    setLoc([])
    setHasMore(false)
    try {
      const apiCall = type === 'lot' ? getItemLocByLot(value)
        : type === 'serienum' ? getItemLocBySerieNum(value)
        : getItemLoc(value)
      const data = await apiCall
      const items = Array.isArray(data[0]) ? data[0] : []
      const pagination = data[1]?.pagination_existance ?? false
      setLoc(items)
      setHasMore(pagination)
      if (items.length === 0) setError('Aucun article trouvé.')
    } catch {
      setError('Article introuvable ou emplacement non défini.')
    } finally {
      setLoading(false)
    }
  }

  return { loc, loading, error, hasMore, search }
}
