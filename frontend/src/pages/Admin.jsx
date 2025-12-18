import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecords, deleteRecord } from '../store/slices/dataSlice'
import api from '../services/api'

function Admin() {
  const dispatch = useDispatch()
  const { records, loading, pagination } = useSelector((state) => state.data)
  const safeRecords = Array.isArray(records) ? records : []
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    dispatch(fetchRecords({ page: 1, per_page: 10 }))
  }, [dispatch])

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) setUploadFile(f)
  }

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadMessage({ type: 'error', text: 'Please select a file' })
      return
    }

    const formData = new FormData()
    formData.append('file', uploadFile)

    setUploading(true)
    setUploadMessage(null)

    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadMessage({ type: 'success', text: `Uploaded: ${res.data.record_count || 0} records added.` })
      setUploadFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      dispatch(fetchRecords({ page: 1, per_page: 10 }))
    } catch (err) {
      setUploadMessage({ type: 'error', text: err.response?.data?.error || 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  const handleClearDatabase = async () => {
    if (!window.confirm('Clear entire database? This cannot be undone.')) return
    try {
      await api.post('/api/clear-database')
      setUploadMessage({ type: 'success', text: 'Database cleared.' })
      dispatch(fetchRecords({ page: 1, per_page: 10 }))
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Failed to clear database' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return
    await dispatch(deleteRecord(id))
    dispatch(fetchRecords({ page: 1, per_page: 10 }))
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 mb-4">
        <div className="rounded-lg border bg-card p-6 shadow-default border-stroke">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="#6366F1"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold">{pagination.total || 0}</div>
              <div className="text-sm text-gray-500">Total Records</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-default border-stroke">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" fill="#10B981"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold">Active</div>
              <div className="text-sm text-gray-500">System Status</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-default border-stroke">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l4 8-4 2-4-2 4-8z" fill="#F59E0B"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold">Admin</div>
              <div className="text-sm text-gray-500">Current Role</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-lg border bg-card shadow-default border-stroke">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-medium">Upload Excel Database</h3>
            </div>
            <div className="p-6">
              {uploadMessage && (
                <div className={`mb-4 p-3 rounded ${uploadMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {uploadMessage.text}
                </div>
              )}

              <div className="mb-4">
                <div className="relative rounded border-dashed border p-6 text-center">
                  <input type="file" ref={fileInputRef} accept=".xlsb,.xlsx,.xls" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center">
                    <div className="mb-2 text-sm font-medium text-gray-700">Click to upload or drag and drop</div>
                    <div className="text-xs text-gray-400">XLSB or XLSX</div>
                  </div>
                </div>
                {uploadFile && <div className="mt-3 text-sm">Selected: <strong>{uploadFile.name}</strong></div>}
              </div>

              <div className="flex justify-end gap-3">
                <button className="rounded bg-red-600 px-4 py-2 text-white" onClick={handleClearDatabase}>Clear Database</button>
                <button className="rounded bg-indigo-600 px-4 py-2 text-white" onClick={handleUpload} disabled={!uploadFile || uploading}>{uploading ? 'Processing...' : 'Upload & Process'}</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-sm border bg-white shadow">
            <div className="px-6 py-4 border-b">
              <h4 className="text-lg font-semibold">Recent Records</h4>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-3 bg-gray-50 p-3 text-sm font-medium text-gray-700">
                    <div>ID</div>
                    <div className="text-center">Name</div>
                    <div className="text-center">Project</div>
                  </div>

                  {loading && <div className="p-4 text-center">Loading...</div>}

                  {!loading && safeRecords.length === 0 && <div className="p-4 text-center text-sm">No records found.</div>}

                  {safeRecords.slice(0, 8).map((r, i) => (
                    <div key={r.id || i} className={`grid grid-cols-3 p-3 items-center border-b ${i === safeRecords.length - 1 ? '' : ''}`}>
                      <div>{r.id}</div>
                      <div className="text-center">{r.personel || r['Name Surname'] || '-'}</div>
                      <div className="text-center">{r['Projects/Group'] || '-'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
