import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccessPage } from './access.mjs'

export default function ProtectedRoute({ children, role }) {
  const { auth, logout, updateUser } = useAuth()
  const location = useLocation()
  const token = auth?.token
  const [check, setCheck] = useState(null)
  const [retry, setRetry] = useState(0)
  const routeKey = `${location.pathname}:${token}:${retry}`

  useEffect(() => {
    if (!token) return
    const controller = new AbortController()
    let active = true
    async function verify() {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        })
        if (!active) return
        if (response.status === 401 || response.status === 403) {
          logout()
          return
        }
        if (!response.ok) throw new Error('Session verification failed')
        const user = await response.json()
        if (!active) return
        updateUser(user)
        setCheck({ key: routeKey, user })
      } catch (error) {
        if (active && error.name !== 'AbortError') setCheck({ key: routeKey, error: true })
      }
    }
    verify()
    return () => { active = false; controller.abort() }
  }, [token, routeKey, logout, updateUser])

  if (!auth) return <Navigate to="/login" replace />
  if (check?.key !== routeKey) return <p role="status">Vérification de votre session…</p>
  if (check.error) return <div role="alert"><p>Impossible de vérifier votre session.</p><button type="button" onClick={() => setRetry(value => value + 1)}>Réessayer</button></div>
  if (!canAccessPage(check.user, location.pathname, location.search, role)) {
    return <section><h1>Accès refusé</h1><p>Votre rôle ne permet pas d’accéder à cette page.</p><Link to="/?section=items">Retour à la liste des articles</Link></section>
  }
  return children
}
