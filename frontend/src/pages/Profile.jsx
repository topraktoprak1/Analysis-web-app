import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../services/api'

function Profile() {
  const { user, role } = useSelector((state) => state.auth)
  const [profileData, setProfileData] = useState({ username: '', email: '', firstName: '', lastName: '' })
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [message, setMessage] = useState(null)
  const [dbInfo, setDbInfo] = useState({ records: 0, columns: 0 })

  useEffect(() => { loadProfileData(); loadDbInfo() }, [])

  const loadProfileData = async () => {
    try {
      const response = await api.get('/api/profile')
      setProfileData({ username: response.data.username || '', email: response.data.email || '', firstName: response.data.first_name || '', lastName: response.data.last_name || '' })
    } catch (err) {
      console.error('Failed to load profile', err)
    }
  }

  const loadDbInfo = async () => {
    try {
      const response = await api.get('/api/get-records?page=1&per_page=1')
      setDbInfo({ records: response.data.total || 0, columns: 47 })
    } catch (err) {
      console.error('Failed to load DB info', err)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try { await api.put('/api/profile', profileData); setMessage({ type: 'success', text: 'Profile updated successfully!' }) } catch (err) { setMessage({ type: 'error', text: 'Failed to update profile' }) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.new !== passwordData.confirm) return setMessage({ type: 'error', text: 'New passwords do not match!' })
    if (passwordData.new.length < 6) return setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
    try { await api.post('/api/change-password', { current_password: passwordData.current, new_password: passwordData.new }); setMessage({ type: 'success', text: 'Password changed successfully!' }); setPasswordData({ current: '', new: '', confirm: '' }) } catch (err) { setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to change password' }) }
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Profile</h2>
      </div>

      {message && <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-4 text-center">
          <div className="mb-4">
            <div className="mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center" style={{ width: 120, height: 120 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z" fill="#fff"/></svg>
            </div>
          </div>
          <h4 className="font-semibold">{profileData.username || user}</h4>
          <div className="text-sm text-gray-500 mb-3">{profileData.email || 'user@example.com'}</div>
          <button className="mb-3 bg-indigo-600 text-white px-3 py-1 rounded">Change Photo</button>
          <div className="text-left mt-4">
            <div className="mb-2"><strong>Name:</strong> {user || 'Administrator'}</div>
            <div className="mb-2"><strong>Role:</strong> <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{role}</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded shadow p-4">
            <div className="mb-3 font-semibold">📊 My Database Information</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded p-3 text-center">
                <div className="text-sm text-gray-500">Total Records</div>
                <div className="text-2xl text-indigo-600">{dbInfo.records}</div>
              </div>
              <div className="border rounded p-3 text-center">
                <div className="text-sm text-gray-500">Total Columns</div>
                <div className="text-2xl text-teal-600">{dbInfo.columns}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow p-4">
            <div className="mb-3 font-semibold">User Settings</div>
            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input value={profileData.username} onChange={(e) => setProfileData({...profileData, username: e.target.value})} className="mt-1 w-full rounded border px-2 py-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="mt-1 w-full rounded border px-2 py-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} className="mt-1 w-full rounded border px-2 py-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} className="mt-1 w-full rounded border px-2 py-1" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save Settings</button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded shadow p-4">
            <div className="mb-3 font-semibold">🔒 Change Password</div>
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Current Password</label>
                <input type="password" value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} className="mt-1 w-full rounded border px-2 py-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">New Password</label>
                <input type="password" value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} className="mt-1 w-full rounded border px-2 py-1" />
                <div className="text-xs text-gray-500">Password must be at least 6 characters long</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Confirm New Password</label>
                <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} className="mt-1 w-full rounded border px-2 py-1" />
              </div>
              <div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">Copyright © Veri Analizi 2025</div>
    </div>
  )
}

export default Profile
