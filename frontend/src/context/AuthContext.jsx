import { createContext, useContext, useState } from 'react'
import { setToken, clearToken } from '../services/apiClient'

const AuthContext = createContext(null)

function getInitialAuth() {
  try {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    if (token && user) {
      setToken(token)
      return { token, user }
    }
  } catch {
    // corrupted storage
  }
  return null
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth)

  function login(token, user) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setAuth({ token, user })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    clearToken()
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
