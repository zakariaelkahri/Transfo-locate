import { apiClient } from '../../../services/apiClient'

export const getArticleByCode = (code) => apiClient.get(`/articles/${code}`)
export const getItemLoc = (itmref) => apiClient.post('/stock/item_loc/itemref', { itmref })
export const getItemLocByLot = (lot) => apiClient.post('/stock/item_loc/lot', { lot })
