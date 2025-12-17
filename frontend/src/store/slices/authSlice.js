import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/login', credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/register', userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/api/logout')
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Logout failed')
    }
  }
)

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      // Try to get profile which will tell us if we're logged in
      const response = await api.get('/api/profile')
      return {
        authenticated: true,
        user: response.data.name,
        role: response.data.role
      }
    } catch (error) {
      // If 401, user is not authenticated (not an error, just not logged in)
      if (error.response?.status === 401) {
        return { authenticated: false }
      }
      return rejectWithValue(error.response?.data?.error || 'Session check failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.name
        state.role = action.payload.role
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.role = null
        state.isAuthenticated = false
        state.loading = false
      })
      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.loading = true
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.authenticated) {
          state.isAuthenticated = true
          state.user = action.payload.user
          state.role = action.payload.role
        } else {
          state.isAuthenticated = false
          state.user = null
          state.role = null
        }
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.role = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
