import axios from 'axios'

const api = axios.create({
  // Default to empty (same-origin) so Vite dev proxy (/api) works.
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 for profile/session check endpoints
    const url = error.config?.url || ''
    if (error.response?.status === 401 && !url.includes('/api/profile') && !url.includes('/api/check-session')) {
      // Redirect to login on unauthorized for other endpoints
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
