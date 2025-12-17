import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chartData: null,
  chartType: 'bar',
  chartConfig: {},
}

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartData: (state, action) => {
      state.chartData = action.payload
    },
    setChartType: (state, action) => {
      state.chartType = action.payload
    },
    setChartConfig: (state, action) => {
      state.chartConfig = action.payload
    },
    clearChart: (state) => {
      state.chartData = null
      state.chartConfig = {}
    },
  },
})

export const { setChartData, setChartType, setChartConfig, clearChart } = chartSlice.actions
export default chartSlice.reducer
