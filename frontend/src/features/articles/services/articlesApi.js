import { apiClient } from '../../../services/apiClient'

export const getArticleByCode = (code) => apiClient.get(`/articles/${code}`)
