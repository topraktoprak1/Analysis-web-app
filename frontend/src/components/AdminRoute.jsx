import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function AdminRoute() {
  const { role } = useSelector((state) => state.auth)

  return role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}

export default AdminRoute
