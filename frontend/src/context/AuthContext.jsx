import { createContext, useContext, useState } from 'react'
import { setToken, clearToken } from '../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null)

  function login(token, user) {
    localStorage.setItem('token', token)
    setToken(token)
    setAuth({ token, user })
  }

  function logout() {
    localStorage.removeItem('token')
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
