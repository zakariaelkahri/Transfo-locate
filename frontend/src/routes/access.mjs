export function canAccessPage(user, pathname, search = '', requiredRole) {
  if (user?.status !== 'active' || !['admin', 'responsible', 'user'].includes(user.role_name)) return false
  if (requiredRole && user.role_name !== requiredRole) return false
  if (pathname === '/admin') return user.role_name === 'admin'
  if (pathname === '/' && new URLSearchParams(search).get('section') === 'add-item') {
    return user.role_name === 'responsible'
  }
  return true
}
