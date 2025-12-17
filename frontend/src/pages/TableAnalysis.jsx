import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Form, Button, Spinner, Alert, Badge, Collapse } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecords } from '../store/slices/dataSlice'
import api from '../services/api'

function TableAnalysis() {
  const { records, pagination, loading, error } = useSelector((state) => state.data)
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [showPivot, setShowPivot] = useState(false)
  
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

  useEffect(() => {
    loadRecords()
  }, [currentPage, perPage])

  const loadRecords = () => {
    dispatch(fetchRecords({ page: currentPage, per_page: perPage, search: searchTerm }))
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadRecords()
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCurrentPage(1)
    dispatch(fetchRecords({ page: 1, per_page: perPage, search: '' }))
  }

  // Get available fields from first record
  const availableFields = records.length > 0 ? Object.keys(records[0]).filter(key => key !== 'created_at') : []
  const columns = availableFields

  // For react-select options
  const valueOptions = columns.map(col => ({ value: col, label: col }))

  return (
    <Container fluid className="py-3">
      <Row className="mb-4">
        <Col>
          <h2>📊 DATABASE Information</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">TOTAL ROWS</div>
              <h2 className="mb-0 text-primary">{pagination.total || 0}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">TOTAL COLUMNS</div>
              <h2 className="mb-0 text-info">{columns.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">STAFF MEMBERS</div>
              <h2 className="mb-0 text-success">
                {[...new Set(records.map(r => r.personel || r['Name Surname']).filter(Boolean))].length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm">
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
        <Collapse in={!showPivot}>
          <Card.Body>
            <Alert variant="info" className="mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Showing first 5 rows from your uploaded file. Use filters and pivot below to analyze.
            </Alert>
            {records.length > 0 && (
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
          <Alert variant="info" className="mb-3">
            <strong>▼ Filters (Optional - Click to expand)</strong>
          </Alert>
          
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label><strong>Group By (Rows)</strong></Form.Label>
                <Form.Select 
                  value={pivotConfig.groupBy}
                  onChange={(e) => setPivotConfig({...pivotConfig, groupBy: e.target.value})}
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
                  size={6}
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
                  Select one or more values (hold Ctrl/Cmd to select multiple)
                </Form.Text>
                {/* Show small sample preview of selected value columns to help pick numeric fields */}
                {pivotConfig.values && pivotConfig.values.length > 0 && records.length > 0 && (
                  <div className="mt-2 small">
                    <strong>Sample values:</strong>
                    <div className="mt-1">
                      {pivotConfig.values.map((val, i) => (
                        <div key={i} className="mb-1">
                          <em>{val}:</em> {records.slice(0,5).map(r => r[val] != null ? String(r[val]) : '-').join(' | ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label><strong>Calculation Method</strong></Form.Label>
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

          <div className="d-flex gap-2">
            <Button variant="primary" onClick={async () => {
              // Generate pivot
              setPivotLoading(true)
              setPivotError(null)
              try {
                const payload = {
                  index: pivotConfig.groupBy,
                  columns: pivotConfig.columns || null,
                  values: pivotConfig.values,
                  agg_func: pivotConfig.calculation,
                  filters: {}
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
            }}>
              <i className="bi bi-play-fill me-1"></i>
              {pivotLoading ? 'Generating...' : 'Generate Pivot'}
            </Button>
            <Button variant="secondary" onClick={() => {
              setPivotConfig({ groupBy: '', columns: '', values: [], calculation: 'sum' })
              setPivotResult({ columns: [], data: [] })
              setPivotError(null)
            }}>
              <i className="bi bi-x-circle me-1"></i>
              Clear
            </Button>
            <Button variant="success">
              <i className="bi bi-download me-1"></i>
              Export to Excel
            </Button>
            <Button variant="info">
              <i className="bi bi-file-word me-1"></i>
              Export to Word
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Pivot Result */}
      {pivotError && (
        <Alert variant="danger" className="mt-3">{pivotError}</Alert>
      )}

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
            <strong>Filters</strong>
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
                  placeholder="Search in table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </Col>
            </Row>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={handleSearch}>
                Apply Filters
              </Button>
              <Button variant="secondary" onClick={clearFilters}>
                Clear All
              </Button>
              <Button variant="success">
                <i className="bi bi-download me-1"></i>
                Export Excel
              </Button>
              <Button variant="info">
                <i className="bi bi-file-word me-1"></i>
                Export Word
              </Button>
            </div>
          </Card.Body>
        </Collapse>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <i className="bi bi-table me-2"></i>
          <strong>DATABASE Table</strong>
        </Card.Header>
        <Card.Body className="p-0">
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="m-3">{error}</Alert>
          )}

          {!loading && !error && records.length === 0 && (
            <Alert variant="info" className="m-3">No records found.</Alert>
          )}

          {!loading && !error && records.length > 0 && (
            <>
              <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <Table striped bordered hover size="sm" className="mb-0" style={{ fontSize: '0.85rem' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}>
                    <tr>
                      {columns.slice(0, 15).map((col, idx) => (
                        <th key={idx} style={{ minWidth: '100px', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, idx) => (
                      <tr key={record.id || idx}>
                        {columns.slice(0, 15).map((col, colIdx) => (
                          <td key={colIdx} style={{ whiteSpace: 'nowrap' }}>
                            {record[col] != null ? String(record[col]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="p-3 bg-light border-top">
                <Row className="align-items-center">
                  <Col md={4}>
                    <small>
                      Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, pagination.total)} of {pagination.total} entries
                    </small>
                  </Col>
                  <Col md={4} className="text-center">
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="me-2"
                    >
                      Previous
                    </Button>
                    <span className="mx-2 small">Page {currentPage} of {pagination.pages}</span>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      disabled={currentPage === pagination.pages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="ms-2"
                    >
                      Next
                    </Button>
                  </Col>
                  <Col md={4} className="text-end">
                    <Form.Select 
                      size="sm" 
                      value={perPage} 
                      onChange={(e) => {
                        setPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      style={{ width: '120px', display: 'inline-block' }}
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </Form.Select>
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
