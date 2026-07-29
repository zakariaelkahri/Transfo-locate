// const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

let authToken = localStorage.getItem('token')

export function setToken(token) { authToken = token }
export function clearToken() { authToken = null }

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    ...options,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
}
