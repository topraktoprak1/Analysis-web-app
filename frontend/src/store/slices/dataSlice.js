import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  records: [],
  currentRecord: null,
  pagination: {
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  error: null,
}

// Async thunks
export const fetchRecords = createAsyncThunk(
  'data/fetchRecords',
  async ({ page = 1, per_page = 10, search = '' }, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/get-records', {
        params: { page, per_page, search }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch records')
    }
  }
)

export const addRecord = createAsyncThunk(
  'data/addRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/add-record', { record: recordData })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add record')
    }
  }
)

export const updateRecord = createAsyncThunk(
  'data/updateRecord',
  async ({ id, record }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/update-record/${id}`, { record })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update record')
    }
  }
)

export const deleteRecord = createAsyncThunk(
  'data/deleteRecord',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/delete-record/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete record')
    }
  }
)

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Records
      .addCase(fetchRecords.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.loading = false
        // Ensure records is always an array to avoid runtime errors in components
        state.records = Array.isArray(action.payload?.records) ? action.payload.records : []
        state.pagination = {
          page: action.payload?.page || state.pagination.page,
          per_page: action.payload?.per_page || state.pagination.per_page,
          total: action.payload?.total || state.pagination.total,
          pages: action.payload?.pages || state.pagination.pages,
        }
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add Record
      .addCase(addRecord.pending, (state) => {
        state.loading = true
      })
      .addCase(addRecord.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(addRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Record
      .addCase(updateRecord.pending, (state) => {
        state.loading = true
      })
      .addCase(updateRecord.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Record
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(r => r.id !== action.payload)
      })
  },
})

export const { clearError, setCurrentRecord } = dataSlice.actions
export default dataSlice.reducer
