import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import dataReducer from './slices/dataSlice'
import filterReducer from './slices/filterSlice'
import chartReducer from './slices/chartSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    filter: filterReducer,
    chart: chartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
