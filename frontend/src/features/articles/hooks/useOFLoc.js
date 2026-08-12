import { useState } from 'react'
import { getMatLocByOF } from '../services/articlesApi'

export function useOFLoc() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(ofList) {
    setLoading(true)
    setError(null)
    setGroups([])
    try {
      const data = await getMatLocByOF(ofList)
      // data is [ [items_of1], [items_of2], ... ]
      const result = ofList.map((of, i) => ({ of, items: Array.isArray(data[i]) ? data[i] : [] }))
      const total = result.reduce((sum, g) => sum + g.items.length, 0)
      if (total === 0) setError('Aucune matière allouée trouvée pour ces OF.')
      setGroups(result)
    } catch (err) {
      const status = err?.message?.match(/\d+/)?.[0]
      if (status === '404') setError('Ordre de fabrication introuvable.')
      else if (status === '422') setError('Numéro d\'OF invalide.')
      else setError('Erreur lors de la récupération des matières allouées.')
    } finally {
      setLoading(false)
    }
  }

  return { groups, loading, error, search }
}
