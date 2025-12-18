import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login, clearError } from '../store/slices/authSlice'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({ username: '', password: '' })

  useEffect(() => () => dispatch(clearError()), [dispatch])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(formData))
    if (login.fulfilled.match(result)) navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-center text-xl font-bold mb-2">Database Analysis System</h2>
        <h3 className="text-center text-sm text-gray-500 mb-4">Login</h3>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Username</label>
            <input name="username" value={formData.username} onChange={handleChange} required autoFocus className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <div className="text-center mt-4 text-sm">
          <Link to="/register" className="text-indigo-600">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
