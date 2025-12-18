import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Alert, Badge, Collapse } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecords } from '../store/slices/dataSlice'
import api from '../services/api'

function TableAnalysis() {
  const dispatch = useDispatch()
  const { records, pagination, loading, error } = useSelector((state) => state.data)
  
  // State
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('') // Input value
  const [appliedSearch, setAppliedSearch] = useState('') // Value actually sent to API
  const [showFilters, setShowFilters] = useState(true)
  const [showPivot, setShowPivot] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  
  // Pivot configuration
  const [pivotConfig, setPivotConfig] = useState({
    groupBy: '',
    columns: '',
    values: [],
    calculation: 'sum'
  })

  const [pivotLoading, setPivotLoading] = useState(false)
  const [pivotError, setPivotError] = useState(null)
  const [pivotResult, setPivotResult] = useState({ columns: [], data: [] })

  // Effect to load records when page, limit, or applied search changes
  useEffect(() => {
    dispatch(fetchRecords({ 
      page: currentPage, 
      per_page: perPage, 
      search: appliedSearch 
    }))
  }, [dispatch, currentPage, perPage, appliedSearch])

  // Handlers
  const handleApplyFilter = () => {
    setCurrentPage(1)
    setAppliedSearch(searchTerm)
  }

  const handleClearFilter = () => {
    setSearchTerm('')
    setAppliedSearch('')
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleExport = async (format, type = 'data') => {
    try {
      setExportLoading(true)
      const endpoint = type === 'pivot' ? '/api/export-pivot' : '/api/export'
      
      const payload = {
        format: format, // 'excel' or 'word'
        filters: appliedSearch ? { search: appliedSearch } : {},
        // Only include pivot config if exporting pivot
        pivot_config: type === 'pivot' ? {
          index: pivotConfig.groupBy,
          columns: pivotConfig.columns || null,
          values: pivotConfig.values,
          agg_func: pivotConfig.calculation
        } : null
      }

      const response = await api.post(endpoint, payload, {
        responseType: 'blob' // Important for file download
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const ext = format === 'excel' ? 'xlsx' : 'docx'
      const prefix = type === 'pivot' ? 'pivot_table' : 'report'
      link.setAttribute('download', `${prefix}_${new Date().toISOString().slice(0,19).replace(/[-T:]/g,'')}.${ext}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed. Please check the console for details.')
    } finally {
      setExportLoading(false)
    }
  }

  const handleGeneratePivot = async () => {
    if (!pivotConfig.groupBy || pivotConfig.values.length === 0) {
      setPivotError('Please select at least a Group By field and one Value field.')
      return
    }

    setPivotLoading(true)
    setPivotError(null)
    try {
      const payload = {
        index: pivotConfig.groupBy,
        columns: pivotConfig.columns || null,
        values: pivotConfig.values,
        agg_func: pivotConfig.calculation,
        filters: appliedSearch ? { search: appliedSearch } : {}
      }
      const resp = await api.post('/api/pivot', payload)
      if (resp.data && resp.data.success) {
        setPivotResult({ columns: resp.data.columns || [], data: resp.data.data || [] })
      } else {
        setPivotError(resp.data?.error || 'Unknown error')
      }
    } catch (err) {
      setPivotError(err?.response?.data?.error || err.message || String(err))
    } finally {
      setPivotLoading(false)
    }
  }

  // Derived state
  const availableFields = records.length > 0 ? Object.keys(records[0]).filter(key => key !== 'id' && key !== 'data') : []
  // Fallback to pivot columns if main records are empty but we have a schema
  const columns = availableFields.length > 0 ? availableFields : []

  return (
    <Container fluid className="py-3">
      <Row className="mb-4">
        <Col>
          <h2>📊 DATABASE Information</h2>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small">TOTAL ROWS</div>
              <h2 className="mb-0 text-primary">{pagination.total || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small">TOTAL COLUMNS</div>
              <h2 className="mb-0 text-info">{columns.length || '-'}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small">STAFF MEMBERS</div>
              <h2 className="mb-0 text-success">
                {records.length > 0 
                  ? new Set(records.map(r => r.personel || r['Name Surname'] || r['PERSONEL'])).size 
                  : '-'}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm h-100">
            <Card.Body>
              <div className="text-muted small">FILE STATUS</div>
              <h4 className="mb-0"><Badge bg="success">✓ Loaded</Badge></h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Database Preview */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-table me-2"></i>
              <strong>DATABASE Preview (First 5 Rows)</strong>
            </div>
            <Button 
              variant="link" 
              size="sm"
              onClick={() => setShowPivot(!showPivot)}
            >
              {showPivot ? 'Hide' : 'Show'} Preview
            </Button>
          </div>
        </Card.Header>
        <Collapse in={showPivot}>
          <Card.Body>
            <Alert variant="info" className="mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Showing first 5 rows from your uploaded file. Use filters and pivot below to analyze.
            </Alert>
            {records.length > 0 ? (
              <div className="table-responsive">
                <Table bordered hover size="sm" style={{ fontSize: '0.85rem' }}>
                  <thead className="bg-light">
                    <tr>
                      {columns.slice(0, 12).map((col, idx) => (
                        <th key={idx} style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.slice(0, 5).map((record, idx) => (
                      <tr key={idx}>
                        {columns.slice(0, 12).map((col, colIdx) => (
                          <td key={colIdx} style={{ whiteSpace: 'nowrap' }}>
                            {record[col] != null ? String(record[col]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-muted text-center py-3">No data available for preview</div>
            )}
          </Card.Body>
        </Collapse>
      </Card>

      {/* Create Pivot Table */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <i className="bi bi-funnel me-2"></i>
          <strong>Create Pivot Table</strong>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label><strong>Group By (Rows)</strong></Form.Label>
                <Form.Select 
                  value={pivotConfig.groupBy}
                  onChange={(e) => setPivotConfig({...pivotConfig, groupBy: e.target.value})}
                >
                  <option value="">-- Select Field --</option>
                  {columns.map((field, idx) => (
                    <option key={idx} value={field}>{field}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label><strong>Columns (Optional)</strong></Form.Label>
                <Form.Select
                  value={pivotConfig.columns}
                  onChange={(e) => setPivotConfig({...pivotConfig, columns: e.target.value})}
                >
                  <option value="">-- None --</option>
                  {columns.map((field, idx) => (
                    <option key={idx} value={field}>{field}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label><strong>Values to Analyze</strong></Form.Label>
                <Form.Select
                  multiple
                  value={pivotConfig.values}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(o => o.value)
                    setPivotConfig({ ...pivotConfig, values: selected })
                  }}
                  style={{ minHeight: '140px' }}
                >
                  {columns.map((field, idx) => (
                    <option key={idx} value={field}>{field}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted small">
                  Hold Ctrl/Cmd to select multiple
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label><strong>Calculation</strong></Form.Label>
                <Form.Select
                  value={pivotConfig.calculation}
                  onChange={(e) => setPivotConfig({...pivotConfig, calculation: e.target.value})}
                >
                  <option value="sum">Sum (Total)</option>
                  <option value="count">Count</option>
                  <option value="avg">Average</option>
                  <option value="min">Minimum</option>
                  <option value="max">Maximum</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={handleGeneratePivot} disabled={pivotLoading}>
              {pivotLoading ? <Spinner size="sm" animation="border" className="me-1"/> : <i className="bi bi-play-fill me-1"></i>}
              Generate Pivot
            </Button>
            <Button variant="secondary" onClick={() => {
              setPivotConfig({ groupBy: '', columns: '', values: [], calculation: 'sum' })
              setPivotResult({ columns: [], data: [] })
              setPivotError(null)
            }}>
              Clear
            </Button>
            {pivotResult.data.length > 0 && (
              <>
                <Button variant="success" onClick={() => handleExport('excel', 'pivot')} disabled={exportLoading}>
                  <i className="bi bi-file-earmark-excel me-1"></i> Export Pivot (Excel)
                </Button>
                <Button variant="info" className="text-white" onClick={() => handleExport('word', 'pivot')} disabled={exportLoading}>
                  <i className="bi bi-file-earmark-word me-1"></i> Export Pivot (Word)
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Pivot Result */}
      {pivotError && <Alert variant="danger" className="mb-4">{pivotError}</Alert>}

      {pivotResult && pivotResult.data && pivotResult.data.length > 0 && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-light">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            <strong>Pivot Result</strong>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table bordered size="sm" className="mb-0" style={{ fontSize: '0.85rem' }}>
                <thead className="bg-light">
                  <tr>
                    {pivotResult.columns.map((c, i) => (
                      <th key={i} style={{ minWidth: '100px', whiteSpace: 'nowrap' }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pivotResult.data.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {pivotResult.columns.map((col, cIdx) => (
                        <td key={cIdx} style={{ whiteSpace: 'nowrap' }}>{row[col] != null ? String(row[col]) : '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Filters Section */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-search me-2"></i>
            <strong>Filters & Search</strong>
          </div>
          <Button 
            variant="link" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide' : 'Show'}
          </Button>
        </Card.Header>
        <Collapse in={showFilters}>
          <Card.Body>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Control
                  type="text"
                  placeholder="Search by name, project, or any keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyFilter()}
                />
              </Col>
            </Row>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleApplyFilter}>
                Apply Filters
              </Button>
              <Button variant="outline-secondary" onClick={handleClearFilter}>
                Clear All
              </Button>
              <div className="vr mx-2"></div>
              <Button variant="success" onClick={() => handleExport('excel', 'data')} disabled={exportLoading}>
                {exportLoading ? <Spinner size="sm" animation="border"/> : <i className="bi bi-file-earmark-excel me-1"></i>}
                Export Data (Excel)
              </Button>
              <Button variant="info" className="text-white" onClick={() => handleExport('word', 'data')} disabled={exportLoading}>
                {exportLoading ? <Spinner size="sm" animation="border"/> : <i className="bi bi-file-earmark-word me-1"></i>}
                Export Data (Word)
              </Button>
            </div>
          </Card.Body>
        </Collapse>
      </Card>

      {/* Main Data Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <i className="bi bi-table me-2"></i>
          <strong>DATABASE Table</strong>
        </Card.Header>
        <Card.Body className="p-0">
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2 text-muted">Loading records...</p>
            </div>
          )}

          {error && <Alert variant="danger" className="m-3">{error}</Alert>}

          {!loading && !error && records.length === 0 && (
            <Alert variant="info" className="m-3">No records found matching your criteria.</Alert>
          )}

          {!loading && !error && records.length > 0 && (
            <>
              <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table striped bordered hover size="sm" className="mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}>
                    <tr>
                      {columns.map((col, idx) => (
                        <th key={idx} style={{ minWidth: '120px', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, idx) => (
                      <tr key={record.id || idx}>
                        {columns.map((col, colIdx) => (
                          <td key={colIdx} style={{ whiteSpace: 'nowrap' }}>
                            {record[col] != null ? String(record[col]) : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="p-3 bg-light border-top">
                <Row className="align-items-center">
                  <Col md={4} className="text-muted small">
                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, pagination.total)} of {pagination.total} entries
                  </Col>
                  <Col md={4} className="text-center">
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="me-2"
                    >
                      <i className="bi bi-chevron-left"></i> Previous
                    </Button>
                    <span className="mx-2 small fw-bold">Page {currentPage} of {pagination.pages}</span>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      disabled={currentPage === pagination.pages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="ms-2"
                    >
                      Next <i className="bi bi-chevron-right"></i>
                    </Button>
                  </Col>
                  <Col md={4} className="text-end">
                    <div className="d-inline-block">
                      <Form.Select 
                        size="sm" 
                        value={perPage} 
                        onChange={(e) => {
                          setPerPage(Number(e.target.value))
                          setCurrentPage(1)
                        }}
                      >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                      </Form.Select>
                    </div>
                  </Col>
                </Row>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TableAnalysis
