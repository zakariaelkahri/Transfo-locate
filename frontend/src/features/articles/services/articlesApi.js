import { apiClient } from '../../../services/apiClient'

export const getArticleByCode = (code) => apiClient.get(`/articles/${code}`)
export const getItemLoc = (itmref) => apiClient.post('/stock/itemLoc/itemRef', { itmref })
export const getItemLocByLot = (lot) => apiClient.post('/stock/itemLoc/lot', { lot })
export const getItemLocBySerieNum = (sernum) => apiClient.post('/stock/itemLoc/serieNum', { sernum })
export const getMatLocByOF = (OF) => apiClient.post('/stock/matloc/OF', { OF })
