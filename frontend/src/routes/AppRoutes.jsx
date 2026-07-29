import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import LoginPage from '../pages/LoginPage'
import AdminPage from '../pages/AdminPage'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'

export default function AppRoutes() {
  const { auth } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={auth ? <Navigate to={auth?.user?.role_name === 'admin' ? '/admin' : '/'} replace /> : <LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
