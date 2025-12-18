import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold">DA</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Database Analysis</span>
            <span className="text-xs text-muted">Admin Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <input placeholder="Search..." className="w-64 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700">{user?.name || user || 'User'}</div>
            <button onClick={handleLogout} className="rounded bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
