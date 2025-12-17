import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeFilters: {},
  savedFilters: [],
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { field, value } = action.payload
      if (value === null || value === undefined || value === '') {
        delete state.activeFilters[field]
      } else {
        state.activeFilters[field] = value
      }
    },
    clearFilters: (state) => {
      state.activeFilters = {}
    },
    setSavedFilters: (state, action) => {
      state.savedFilters = action.payload
    },
  },
})

export const { setFilter, clearFilters, setSavedFilters } = filterSlice.actions
export default filterSlice.reducer
