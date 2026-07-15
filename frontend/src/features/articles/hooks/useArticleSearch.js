import { useState } from 'react'
import { getArticleByCode } from '../services/articlesApi'

export function useArticleSearch() {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search(code) {
    setLoading(true)
    setError(null)
    setArticle(null)
    try {
      const data = await getArticleByCode(code)
      setArticle(data)
    } catch (e) {
      setError('Article introuvable.')
    } finally {
      setLoading(false)
    }
  }

  return { article, loading, error, search }
}
