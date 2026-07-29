import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  if (role && auth.user.role_name !== role) return <Navigate to="/" replace />
  return children
}
