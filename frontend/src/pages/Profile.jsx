import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import api from '../services/api'

function Profile() {
  const { user, role } = useSelector((state) => state.auth)
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  })
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [message, setMessage] = useState(null)
  const [dbInfo, setDbInfo] = useState({ records: 0, columns: 0 })

  useEffect(() => {
    loadProfileData()
    loadDbInfo()
  }, [])

  const loadProfileData = async () => {
    try {
      const response = await api.get('/api/profile')
      setProfileData({
        username: response.data.username || '',
        email: response.data.email || '',
        firstName: response.data.first_name || '',
        lastName: response.data.last_name || ''
      })
    } catch (err) {
      console.error('Failed to load profile', err)
    }
  }

  const loadDbInfo = async () => {
    try {
      const response = await api.get('/api/get-records?page=1&per_page=1')
      setDbInfo({
        records: response.data.total || 0,
        columns: 47 // Based on your database structure
      })
    } catch (err) {
      console.error('Failed to load DB info', err)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put('/api/profile', profileData)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setMessage({ type: 'danger', text: 'Failed to update profile' })
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) {
      setMessage({ type: 'danger', text: 'New passwords do not match!' })
      return
    }
    if (passwordData.new.length < 6) {
      setMessage({ type: 'danger', text: 'Password must be at least 6 characters long' })
      return
    }

    try {
      await api.post('/api/change-password', {
        current_password: passwordData.current,
        new_password: passwordData.new
      })
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.error || 'Failed to change password' })
    }
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h2>
            <i className="bi bi-person-circle me-2"></i>
            Profile
          </h2>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <Card className="mb-4 border-0 shadow-sm text-center">
            <Card.Body className="py-4">
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                  style={{ width: '120px', height: '120px' }}
                >
                  <i className="bi bi-person-fill text-white" style={{ fontSize: '60px' }}></i>
                </div>
              </div>
              <h5 className="mb-1">{profileData.username || user}</h5>
              <p className="text-muted mb-3">{profileData.email || 'user@example.com'}</p>
              <div className="mb-3">
                <Button variant="primary" size="sm">
                  <i className="bi bi-camera me-1"></i>
                  Change Photo
                </Button>
              </div>
              <div className="text-start mt-4">
                <h6 className="mb-3">User Information</h6>
                <div className="mb-2">
                  <strong>Name:</strong> {user || 'Administrator'}
                </div>
                <div className="mb-2">
                  <strong>Role:</strong>{' '}
                  <span className="badge bg-primary">{role}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {/* My Database Information */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <i className="bi bi-database me-2"></i>
              <strong>📊 My Database Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Total Records</div>
                    <h3 className="mb-0 text-primary">{dbInfo.records}</h3>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="border rounded p-3 text-center">
                    <div className="text-muted small">Total Columns</div>
                    <h3 className="mb-0 text-info">{dbInfo.columns}</h3>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* User Settings */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <i className="bi bi-gear me-2"></i>
              <strong>User Settings</strong>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleProfileUpdate}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        placeholder="admin"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="user@example.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        placeholder="John"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        placeholder="Doe"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary">
                  <i className="bi bi-save me-1"></i>
                  Save Settings
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Change Password */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <i className="bi bi-shield-lock me-2"></i>
              <strong>🔒 Change Password</strong>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    placeholder="Enter current password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    placeholder="Enter new password"
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    placeholder="Re-enter new password"
                  />
                </Form.Group>
                <Button type="submit" variant="primary">
                  <i className="bi bi-key me-1"></i>
                  Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-4 text-muted small">
        Copyright © Branzi 2025
      </div>
    </Container>
  )
}

export default Profile
