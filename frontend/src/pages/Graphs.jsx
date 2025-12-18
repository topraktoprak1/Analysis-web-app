import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import api from '../services/api'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

function Graphs() {
  const [showFilters, setShowFilters] = useState(false)
  const [numCharts, setNumCharts] = useState(2)
  const [charts, setCharts] = useState([
    { id: 1, type: 'line', xAxis: '(Week / Month)', yAxis: 'KAR/ZARAR', colorBy: 'Discipline' },
    { id: 2, type: 'bar', xAxis: 'Discipline', yAxis: 'KAR/ZARAR', colorBy: '' }
  ])

  const [sampleData] = useState([
    { name: 'Week 1', value: 400, total: 240 },
    { name: 'Week 2', value: 300, total: 139 },
    { name: 'Week 3', value: 200, total: 980 },
    { name: 'Week 4', value: 278, total: 390 },
    { name: 'Week 5', value: 189, total: 480 },
  ])

  const handleChartChange = (chartId, field, value) => {
    setCharts(charts.map(c => c.id === chartId ? {...c, [field]: value} : c))
  }

  // Get available fields from the loaded records (same approach as TableAnalysis)
  const { records } = useSelector((state) => state.data)
  const safeRecords = Array.isArray(records) ? records : []
  const availableFields = safeRecords.length > 0 ? Object.keys(safeRecords[0]).filter(k => k !== 'created_at') : []

  const findBestMatch = (label) => {
    if (!availableFields || availableFields.length === 0) return null
    // Exact match
    const exact = availableFields.find(f => f === label)
    if (exact) return exact
    // Case-insensitive
    const ci = availableFields.find(f => f.toLowerCase() === label.toLowerCase())
    if (ci) return ci
    // Common aliases mapping
    const alias = label.toLowerCase().replace(/[^a-z0-9]/g, '')
    return availableFields.find(f => f.toLowerCase().replace(/[^a-z0-9]/g, '') === alias) || null
  }

  const chartRefs = useRef({})
  const [chartLoading, setChartLoading] = useState(false)
  const [chartError, setChartError] = useState(null)

  const renderChart = (chart) => {
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" />
              <Bar dataKey="total" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="total" stroke="#00C49F" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={sampleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sampleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  const generateAllCharts = async () => {
    setChartLoading(true)
    setChartError(null)
    try {
      // Generate each chart by calling backend /api/chart and render with Plotly
      for (const chart of charts.slice(0, numCharts)) {
        // Map user-friendly placeholders to real column names when possible
        const mapX = (() => {
          if (chart.xAxis && chart.xAxis !== '(Week / Month)') return chart.xAxis
          // Try to find a week/month column in availableFields
          const weekField = availableFields.find(f => /week|month/i.test(f))
          if (weekField) return weekField
          // Fallback to first available field
          return availableFields[0] || null
        })()

        const mapY = (() => {
          if (chart.yAxis) return chart.yAxis
          // Try to find a numeric column by name hints
          const numericHints = ['kar', 'zarar', 'cost', 'total', 'mh', 'rate']
          const found = availableFields.find(f => numericHints.some(h => f.toLowerCase().includes(h)))
          return found || availableFields[0] || null
        })()

        const payload = {
          chart_type: chart.type,
          x_column: mapX,
          y_column: mapY,
          color_column: chart.colorBy || null,
          filters: {}
        }
        const resp = await api.post('/api/chart', payload)
        if (resp.data && resp.data.success && resp.data.chart) {
          try {
            const fig = typeof resp.data.chart === 'string' ? JSON.parse(resp.data.chart) : resp.data.chart
            const container = document.getElementById(`chart-${chart.id}`)
            if (window.Plotly && container) {
              // Use Plotly.react to update the chart in place
              const data = fig.data || fig['data'] || []
              const layout = fig.layout || fig['layout'] || {}
              window.Plotly.react(container, data, layout, {responsive: true})
            }
          } catch (e) {
            console.error('Failed to render plotly chart', e)
          }
        } else {
          console.warn('No chart returned for', chart)
        }
      }
    } catch (err) {
      setChartError(err?.response?.data?.error || err.message || String(err))
    } finally {
      setChartLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] py-6">
      <div className="mb-3">
        <h2 className="text-2xl font-semibold flex items-center gap-2"><i className="fa-solid fa-chart-line text-gray-500"></i> Graph Analysis</h2>
      </div>

      <div className="mb-4 rounded-lg border bg-card shadow-default">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Data Filters</div>
          <button className="text-sm text-indigo-600" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide' : 'Show'} Filters</button>
        </div>
        {showFilters && (
          <div className="p-4">
            <div className="mb-3 text-sm text-gray-600">Apply filters to your data before generating charts.</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-500">Name Surname</label>
                <select className="mt-1 w-full rounded border px-2 py-1 text-sm">
                  <option>All</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Discipline</label>
                <select className="mt-1 w-full rounded border px-2 py-1 text-sm">
                  <option>All</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Week / Month</label>
                <select className="mt-1 w-full rounded border px-2 py-1 text-sm">
                  <option>All</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Company</label>
                <select className="mt-1 w-full rounded border px-2 py-1 text-sm">
                  <option>All</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 rounded-lg border bg-card shadow-default">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold">Chart Configuration</div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-indigo-600" onClick={generateAllCharts} disabled={chartLoading}>{chartLoading ? 'Generating...' : 'Generate All Charts'}</button>
            <button className="text-sm text-gray-600">Clear All</button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium">Number of Charts</label>
              <select value={numCharts} onChange={(e) => setNumCharts(Number(e.target.value))} className="mt-1 w-32 rounded border px-2 py-1 text-sm">
                <option value={1}>1 Chart</option>
                <option value={2}>2 Charts</option>
                <option value={3}>3 Charts</option>
                <option value={4}>4 Charts</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button className="rounded bg-green-600 text-white px-3 py-1 text-sm">Export Excel</button>
              <button className="rounded bg-blue-600 text-white px-3 py-1 text-sm">Export Word</button>
            </div>
          </div>
          {chartError && <div className="text-sm text-red-600 mb-2">{chartError}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {charts.slice(0, numCharts).map((chart, index) => (
          <div key={chart.id} className="rounded border bg-white shadow">
            <div className="px-4 py-3 border-b font-semibold">Chart {index + 1}</div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-sm">Visualization Type</label>
                  <select value={chart.type} onChange={(e) => handleChartChange(chart.id, 'type', e.target.value)} className="mt-1 w-full rounded border px-2 py-1 text-sm">
                    <option value="line">Line Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm">X-axis</label>
                  <select value={chart.xAxis} onChange={(e) => handleChartChange(chart.id, 'xAxis', e.target.value)} className="mt-1 w-full rounded border px-2 py-1 text-sm">
                    <option value="">-- Select X axis --</option>
                    {availableFields.map((f, i) => (<option key={i} value={f}>{f}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-sm">Y-axis</label>
                  <select value={chart.yAxis} onChange={(e) => handleChartChange(chart.id, 'yAxis', e.target.value)} className="mt-1 w-full rounded border px-2 py-1 text-sm">
                    <option value="">-- Select Y axis --</option>
                    {availableFields.map((f, i) => (<option key={i} value={f}>{f}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-sm">Color by</label>
                  <select value={chart.colorBy} onChange={(e) => handleChartChange(chart.id, 'colorBy', e.target.value)} className="mt-1 w-full rounded border px-2 py-1 text-sm">
                    <option value="">None</option>
                    {availableFields.map((f, i) => (<option key={i} value={f}>{f}</option>))}
                  </select>
                </div>
              </div>

              <div className="border rounded p-2 bg-gray-50">
                <div id={`chart-${chart.id}`} style={{ width: '100%', height: 350 }} />
                {chartLoading && <div className="text-center text-sm text-gray-500 mt-2">Updating chart...</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded border bg-white shadow p-4">
        <div className="font-semibold mb-2">Saved Charts</div>
        <div className="text-sm text-gray-600">No saved charts yet. Create and save charts to see them here.</div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">Copyright © Veri Analizi 2025</div>
    </div>
  )
}

export default Graphs
