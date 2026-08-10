import { useState } from 'react'
import { getMatLocByOF } from '../services/articlesApi'

export function useOFLoc() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(of) {
    setLoading(true)
    setError(null)
    setItems([])
    try {
      const data = await getMatLocByOF(of)
      const list = Array.isArray(data) ? data : []
      if (list.length === 0) setError('Aucune matière allouée pour cet OF (ZONE1).')
      setItems(list)
    } catch (err) {
      const status = err?.message?.match(/\d+/)?.[0]
      if (status === '404') setError('Ordre de fabrication introuvable.')
      else if (status === '422') setError('Numéro d\'OF invalide.')
      else setError('Erreur lors de la récupération des matières allouées.')
    } finally {
      setLoading(false)
    }
  }

  return { items, loading, error, search }
}
