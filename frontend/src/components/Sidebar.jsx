import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Nav } from 'react-bootstrap'
import './Sidebar.css'

function Sidebar() {
  const { role, user } = useSelector((state) => state.auth)

  return (
    <div className="sidebar-custom">
      <div className="sidebar-header text-center py-4">
        <i className="bi bi-database-fill" style={{ fontSize: '2rem' }}></i>
        <h5 className="mt-2 mb-0">VERI ANALIZI</h5>
      </div>
      
      <Nav className="flex-column px-3">
        <Nav.Link as={NavLink} to="/" end className="sidebar-link mb-2">
          <i className="bi bi-house-door me-2"></i>
          Database View
        </Nav.Link>
        <Nav.Link as={NavLink} to="/table" className="sidebar-link mb-2">
          <i className="bi bi-table me-2"></i>
          Pivot Analysis
        </Nav.Link>
        <Nav.Link as={NavLink} to="/graphs" className="sidebar-link mb-2">
          <i className="bi bi-graph-up me-2"></i>
          Graph Analysis
        </Nav.Link>
        {role === 'admin' && (
          <Nav.Link as={NavLink} to="/admin" className="sidebar-link mb-2">
            <i className="bi bi-shield-lock me-2"></i>
            Admin Panel
          </Nav.Link>
        )}
        <Nav.Link as={NavLink} to="/profile" className="sidebar-link mb-2">
          <i className="bi bi-person-circle me-2"></i>
          Profile
        </Nav.Link>
      </Nav>

      <div className="sidebar-footer px-3 py-3 mt-auto">
        <div className="text-center">
          <i className="bi bi-person-circle" style={{ fontSize: '2rem' }}></i>
          <div className="mt-2 small">{user || 'User'}</div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
