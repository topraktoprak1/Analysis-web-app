import { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Table } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecords } from '../store/slices/dataSlice'
import api from '../services/api'

function Dashboard() {
  const { user } = useSelector((state) => state.auth)
  const { records, pagination, loading, error } = useSelector((state) => state.data)
  const dispatch = useDispatch()
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Fetch records when component mounts
    dispatch(fetchRecords({ page: 1, per_page: 10 }))
  }, [dispatch])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFile(file)
      setUploadMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadMessage({ type: 'danger', text: 'Please select a file first' })
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)

    setUploading(true)
    setUploadMessage(null)

    try {
      const response = await api.post('/api/process_empty_cells', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setUploadMessage({ 
        type: 'success', 
        text: `File processed successfully! ${response.data.filled_count} cells filled.` 
      })
      
      // Refresh records
      dispatch(fetchRecords({ page: 1, per_page: 10 }))
      
      // Clear file input
      setUploadFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setUploadMessage({ 
        type: 'danger', 
        text: err.response?.data?.error || 'File upload failed' 
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Container fluid>
      <h1 className="mb-4">Dashboard</h1>
      <p>Welcome, {user}!</p>
      
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Upload Excel File</Card.Title>
              <Card.Text className="mb-3">
                Upload an Excel file (.xlsb or .xlsx) to process and fill empty cells using formulas
              </Card.Text>
              
              {uploadMessage && (
                <Alert variant={uploadMessage.type} dismissible onClose={() => setUploadMessage(null)}>
                  {uploadMessage.text}
                </Alert>
              )}
              
              <Form>
                <Row className="align-items-end">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Control 
                        type="file" 
                        ref={fileInputRef}
                        accept=".xlsb,.xlsx" 
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Button 
                      variant="primary" 
                      onClick={handleUpload}
                      disabled={!uploadFile || uploading}
                      className="w-100"
                    >
                      {uploading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            className="me-2"
                          />
                          Processing...
                        </>
                      ) : (
                        'Upload & Process'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Database Records</Card.Title>
              <h2 className="mb-0">{pagination.total || 0}</h2>
              <Card.Text className="text-muted">
                Total records in database
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Analysis Tools</Card.Title>
              <Card.Text>
                Create pivot tables and analyze data
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Visualizations</Card.Title>
              <Card.Text>
                Generate charts and graphs
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Recent Records</Card.Title>
              
              {loading && (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}

              {error && (
                <Alert variant="danger">{error}</Alert>
              )}

              {!loading && !error && records.length === 0 && (
                <Alert variant="info">
                  No records found. Upload an Excel file to get started.
                </Alert>
              )}

              {!loading && !error && records.length > 0 && (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Person Name</th>
                        <th>Project Name</th>
                        <th>Week</th>
                        <th>Total MH</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.slice(0, 5).map((record) => (
                        <tr key={record.id}>
                          <td>{record.id}</td>
                          <td>{record.personel || record['Name Surname'] || 'N/A'}</td>
                          <td>{record['Projects/Group'] || 'N/A'}</td>
                          <td>{record['(Week / Month)'] || 'N/A'}</td>
                          <td>{record['Total MH'] || 'N/A'}</td>
                          <td>{new Date(record.created_at || Date.now()).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
