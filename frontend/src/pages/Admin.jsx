import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecords, deleteRecord } from '../store/slices/dataSlice'
import { Container, Row, Col, Card, Table, Button, Badge, Alert, Form, Spinner } from 'react-bootstrap'
import api from '../services/api'

function Admin() {
  const dispatch = useDispatch()
  const { records, loading, pagination } = useSelector((state) => state.data)
  const [currentPage, setCurrentPage] = useState(1)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    dispatch(fetchRecords({ page: currentPage, per_page: 10, search: searchTerm }))
  }, [dispatch, currentPage])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await dispatch(deleteRecord(id))
      dispatch(fetchRecords({ page: currentPage, per_page: 10 }))
    }
  }

  const handleFileUpload = async () => {
    if (!uploadFile) {
      setUploadMessage({ type: 'danger', text: 'Please select a file' })
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)

    setUploading(true)
    setUploadMessage(null)

    try {
      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setUploadMessage({ 
        type: 'success', 
        text: `File uploaded successfully! ${response.data.record_count || 0} records added.` 
      })
      
      setUploadFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      dispatch(fetchRecords({ page: 1, per_page: 10 }))
    } catch (err) {
      setUploadMessage({ 
        type: 'danger', 
        text: err.response?.data?.error || 'Upload failed' 
      })
    } finally {
      setUploading(false)
    }
  }

  const handleClearDatabase = async () => {
    if (!window.confirm('Are you sure you want to clear the entire database? This cannot be undone!')) {
      return
    }

    try {
      await api.post('/api/clear-database')
      setUploadMessage({ type: 'success', text: 'Database cleared successfully!' })
      dispatch(fetchRecords({ page: 1, per_page: 10 }))
    } catch (err) {
      setUploadMessage({ type: 'danger', text: 'Failed to clear database' })
    }
  }

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h2>⚙️ Admin Panel</h2>
        </Col>
      </Row>

      {/* Upload Excel Database */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-warning text-dark">
          <i className="bi bi-folder-plus me-2"></i>
          <strong>Upload Excel Database</strong>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={8}>
              <Button variant="primary" className="me-2" onClick={() => fileInputRef.current?.click()}>
                <i className="bi bi-file-earmark me-1"></i>
                Choose Excel File
              </Button>
              <Button 
                variant="danger"
                onClick={handleClearDatabase}
              >
                <i className="bi bi-trash me-1"></i>
                Clear Database
              </Button>
              <div className="mt-2">
                <Badge bg="secondary">{pagination.total || 0} records in database</Badge>
              </div>
            </Col>
          </Row>

          <Form.Control
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls,.xlsb"
            onChange={(e) => setUploadFile(e.target.files[0])}
            style={{ display: 'none' }}
          />

          {uploadFile && (
            <Alert variant="info" className="mb-3">
              Selected: <strong>{uploadFile.name}</strong>
              <Button 
                size="sm" 
                variant="success" 
                className="ms-3"
                onClick={handleFileUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Now'}
              </Button>
            </Alert>
          )}

          {uploadMessage && (
            <Alert variant={uploadMessage.type} dismissible onClose={() => setUploadMessage(null)}>
              {uploadMessage.text}
            </Alert>
          )}

          <Alert variant="secondary" className="mb-0">
            <small>
              <strong>Note:</strong> Uploading a new file will ADD records to the existing database. 
              Use "Clear Database" to remove old data first.
            </small>
          </Alert>
        </Card.Body>
      </Card>

      {/* Fill Empty Cells with Formulas */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-success text-white">
          <i className="bi bi-calculator me-2"></i>
          <strong>Fill Empty Cells with Formulas</strong>
        </Card.Header>
        <Card.Body>
          <Button variant="success" className="me-2">
            <i className="bi bi-upload me-1"></i>
            Upload File with Empty Cells
          </Button>
          <Alert variant="info" className="mt-3 mb-0">
            <strong>How it works:</strong>
            <ul className="mb-0 mt-2">
              <li>The system will fill empty cells based on Excel formulas (XLOOKUP, IF, etc.)</li>
              <li>Reference data (Info, Hourly Rates, Summary sheets) is loaded from previously uploaded files</li>
              <li>A new file with filled cells will be generated and available for download</li>
            </ul>
            <p className="mt-2 mb-0">
              <strong>Formulas applied:</strong> North/South, Currency, Hourly Rate, Cost, General Total Cost, İşveren calculations, and more.
            </p>
          </Alert>
        </Card.Body>
      </Card>

      {/* Database Records */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-database me-2"></i>
            <strong>Database Records</strong>
          </div>
          <Button variant="primary" size="sm" onClick={() => dispatch(fetchRecords({ page: 1, per_page: 10 }))}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentPage(1)
                    dispatch(fetchRecords({ page: 1, per_page: 10, search: searchTerm }))
                  }
                }}
              />
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover size="sm">
                  <thead className="bg-dark text-white">
                    <tr>
                      <th>ID</th>
                      <th>Name Surname</th>
                      <th>Discipline</th>
                      <th>Week/Month</th>
                      <th>Company</th>
                      <th>Projects</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td>{record.id}</td>
                        <td>{record.personel || record['Name Surname'] || '-'}</td>
                        <td>{record.Discipline || '-'}</td>
                        <td>{record['(Week / Month)'] || '-'}</td>
                        <td>{record.Company || '-'}</td>
                        <td>{record['Projects/Group'] || '-'}</td>
                        <td>
                          <Badge bg="info">Reported</Badge>
                        </td>
                        <td>
                          <Button size="sm" variant="info" className="me-1">
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleDelete(record.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <small>Showing page {currentPage} of {pagination.pages} ({pagination.total} total records)</small>
                </div>
                <div>
                  <Button 
                    size="sm"
                    variant="outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="me-2"
                  >
                    Previous
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline-secondary"
                    disabled={currentPage === pagination.pages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Admin
