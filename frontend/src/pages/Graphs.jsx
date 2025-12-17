import { useState, useRef } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Collapse, Badge } from 'react-bootstrap'
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
  const availableFields = records && records.length > 0 ? Object.keys(records[0]).filter(k => k !== 'created_at') : []

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
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h2>📈 Graph Analysis</h2>
        </Col>
      </Row>

      {/* Data Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-search me-2"></i>
            <strong>Data Filters</strong>
          </div>
          <Button 
            variant="primary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : '🔽 Toggle'} Filters
          </Button>
        </Card.Header>
        <Collapse in={showFilters}>
          <Card.Body>
            <Alert variant="info">
              Apply filters to your data before generating charts. All selected filters will be applied to the charts below.
            </Alert>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Name Surname</Form.Label>
                  <Form.Select size="sm">
                    <option>All</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Discipline</Form.Label>
                  <Form.Select size="sm">
                    <option>All</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Week / Month</Form.Label>
                  <Form.Select size="sm">
                    <option>All</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-2">
                  <Form.Label className="small">Company</Form.Label>
                  <Form.Select size="sm">
                    <option>All</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Collapse>
      </Card>

      {/* Chart Configuration */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <i className="bi bi-gear me-2"></i>
          <strong>Chart Configuration</strong>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label><strong>Number of Charts</strong></Form.Label>
                <Form.Select 
                  value={numCharts}
                  onChange={(e) => setNumCharts(Number(e.target.value))}
                >
                  <option value={1}>1 Chart</option>
                  <option value={2}>2 Charts</option>
                  <option value={3}>3 Charts</option>
                  <option value={4}>4 Charts</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end gap-2">
                <Button variant="primary" className="flex-grow-1" onClick={generateAllCharts} disabled={chartLoading}>
                  <i className="bi bi-bar-chart me-1"></i>
                  {chartLoading ? 'Generating...' : 'Generate All Charts'}
                </Button>
              <Button variant="secondary">
                <i className="bi bi-x-circle me-1"></i>
                Clear All
              </Button>
            </Col>
          </Row>

          {chartError && (
            <Alert variant="danger" className="mt-2">{chartError}</Alert>
          )}

          <div className="d-flex gap-2">
            <Button variant="success">
              <i className="bi bi-file-excel me-1"></i>
              Export to Excel
            </Button>
            <Button variant="info">
              <i className="bi bi-file-word me-1"></i>
              Export to Word
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Charts Grid */}
      <Row>
        {charts.slice(0, numCharts).map((chart, index) => (
          <Col md={numCharts === 1 ? 12 : 6} key={chart.id} className="mb-4">
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-light">
                <strong>Chart {index + 1}</strong>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className="small"><strong>Select Visualization Type</strong></Form.Label>
                      <Form.Select 
                        size="sm"
                        value={chart.type}
                        onChange={(e) => handleChartChange(chart.id, 'type', e.target.value)}
                      >
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="small"><strong>X-axis</strong></Form.Label>
                      <Form.Select 
                        size="sm"
                        value={chart.xAxis}
                        onChange={(e) => handleChartChange(chart.id, 'xAxis', e.target.value)}
                      >
                        <option value="">-- Select X axis --</option>
                        {/* Prefer showing real available fields from dataset */}
                        {availableFields.map((f, i) => (
                          <option key={i} value={f}>{f}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label className="small"><strong>Y-axis</strong></Form.Label>
                      <Form.Select 
                        size="sm"
                        value={chart.yAxis}
                        onChange={(e) => handleChartChange(chart.id, 'yAxis', e.target.value)}
                      >
                        <option value="">-- Select Y axis --</option>
                        {availableFields.map((f, i) => (
                          <option key={i} value={f}>{f}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-2">
                      <Form.Label className="small"><strong>Color by</strong></Form.Label>
                      <Form.Select 
                        size="sm"
                        value={chart.colorBy}
                        onChange={(e) => handleChartChange(chart.id, 'colorBy', e.target.value)}
                      >
                        <option value="">None</option>
                        {availableFields.map((f, i) => (
                          <option key={i} value={f}>{f}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="border rounded p-2 bg-light">
                  <div id={`chart-${chart.id}`} style={{ width: '100%', height: 350 }} />
                  {chartLoading && (
                    <div className="text-center small text-muted mt-2">Updating chart...</div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Saved Charts */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <i className="bi bi-bookmark me-2"></i>
          <strong>Saved Charts</strong>
        </Card.Header>
        <Card.Body>
          <Alert variant="secondary" className="mb-0">
            No saved charts yet. Create and save charts to see them here.
          </Alert>
        </Card.Body>
      </Card>

      <div className="text-center mt-4 text-muted small">
        Copyright © Veri Analizi 2025
      </div>
    </Container>
  )
}

export default Graphs
