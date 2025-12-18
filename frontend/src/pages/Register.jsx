import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register, clearError } from '../store/slices/authSlice'

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({ username: '', password: '', name: '' })

  useEffect(() => () => dispatch(clearError()), [dispatch])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(register(formData))
    if (register.fulfilled.match(result)) navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-center text-xl font-bold mb-2">Create Account</h2>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Username</label>
            <input name="username" value={formData.username} onChange={handleChange} required autoFocus className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-600">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full rounded border px-3 py-2" />
            <div className="text-xs text-gray-500 mt-1">At least 8 characters with uppercase and number</div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading ? 'Registering...' : 'Register'}</button>
        </form>

        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="text-indigo-600">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
