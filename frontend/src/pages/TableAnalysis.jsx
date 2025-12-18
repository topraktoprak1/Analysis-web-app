import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchRecords } from '../store/slices/dataSlice'
import api from '../services/api'

function TableAnalysis() {
  const dispatch = useDispatch()
  const { records, pagination, loading, error } = useSelector((state) => state.data)
  const safeRecords = Array.isArray(records) ? records : []

  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(50)
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const [pivotConfig, setPivotConfig] = useState({ groupBy: '', columns: '', values: [], calculation: 'sum' })
  const [pivotLoading, setPivotLoading] = useState(false)
  const [pivotError, setPivotError] = useState(null)
  const [pivotResult, setPivotResult] = useState({ columns: [], data: [] })

  useEffect(() => { dispatch(fetchRecords({ page: currentPage, per_page: perPage, search: appliedSearch })) }, [dispatch, currentPage, perPage, appliedSearch])

  const handleApplyFilter = () => { setCurrentPage(1); setAppliedSearch(searchTerm) }
  const handleClearFilter = () => { setSearchTerm(''); setAppliedSearch(''); setCurrentPage(1) }
  const handlePageChange = (newPage) => setCurrentPage(newPage)

  const handleExport = async (format, type = 'data') => {
    try {
      setExportLoading(true)
      const endpoint = type === 'pivot' ? '/api/export-pivot' : '/api/export'
      const payload = { format, filters: appliedSearch ? { search: appliedSearch } : {}, pivot_config: type === 'pivot' ? { index: pivotConfig.groupBy, columns: pivotConfig.columns || null, values: pivotConfig.values, agg_func: pivotConfig.calculation } : null }
      const response = await api.post(endpoint, payload, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data])); const link = document.createElement('a'); link.href = url; const ext = format === 'excel' ? 'xlsx' : 'docx'; const prefix = type === 'pivot' ? 'pivot_table' : 'report'; link.setAttribute('download', `${prefix}_${new Date().toISOString().slice(0,19).replace(/[-T:]/g,'')}.${ext}`); document.body.appendChild(link); link.click(); link.parentNode.removeChild(link)
    } catch (err) { console.error('Export failed:', err); alert('Export failed. Check console.') } finally { setExportLoading(false) }
  }

  const handleGeneratePivot = async () => {
    if (!pivotConfig.groupBy || pivotConfig.values.length === 0) return setPivotError('Please select Group By and at least one Value')
    setPivotLoading(true); setPivotError(null)
    try { const payload = { index: pivotConfig.groupBy, columns: pivotConfig.columns || null, values: pivotConfig.values, agg_func: pivotConfig.calculation, filters: appliedSearch ? { search: appliedSearch } : {} }; const resp = await api.post('/api/pivot', payload); if (resp.data?.success) setPivotResult({ columns: resp.data.columns || [], data: resp.data.data || [] }); else setPivotError(resp.data?.error || 'Unknown error') } catch (err) { setPivotError(err?.response?.data?.error || err.message || String(err)) } finally { setPivotLoading(false) }
  }

  const availableFields = safeRecords.length > 0 ? Object.keys(safeRecords[0]).filter(k => k !== 'id' && k !== 'data') : []
  const columns = availableFields.length > 0 ? availableFields : []

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <div className="mb-4"><h2 className="text-2xl font-semibold flex items-center gap-2"><i className="fa-solid fa-database text-gray-500"></i> Database Information</h2></div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div className="bg-card rounded-lg shadow-default p-4 text-center border border-stroke">
          <div className="text-sm text-gray-500">TOTAL ROWS</div>
          <div className="text-2xl text-indigo-600">{pagination.total || 0}</div>
        </div>
        <div className="bg-card rounded-lg shadow-default p-4 text-center border border-stroke">
          <div className="text-sm text-gray-500">TOTAL COLUMNS</div>
          <div className="text-2xl text-teal-600">{columns.length || '-'}</div>
        </div>
        <div className="bg-card rounded-lg shadow-default p-4 text-center border border-stroke">
          <div className="text-sm text-gray-500">STAFF MEMBERS</div>
          <div className="text-2xl text-green-600">{safeRecords.length > 0 ? new Set(safeRecords.map(r => r.personel || r['Name Surname'] || r['PERSONEL'])).size : '-'}</div>
        </div>
        <div className="bg-card rounded-lg shadow-default p-4 text-center border border-stroke">
          <div className="text-sm text-gray-500">FILE STATUS</div>
          <div className="text-2xl text-green-600">✓ Loaded</div>
        </div>
      </div>

      <div className="bg-white rounded shadow mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Database Preview (First 5 Rows)</div>
          <button className="text-sm text-indigo-600" onClick={() => setShowPreview(!showPreview)}>{showPreview ? 'Hide' : 'Show'} Preview</button>
        </div>
        {showPreview && (
            <div className="p-4">
            <div className="mb-3 text-sm text-gray-600">Showing first 5 rows from your uploaded file.</div>
            {safeRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.slice(0, 12).map((col, idx) => (<th key={idx} className="px-3 py-2 text-left whitespace-nowrap text-xs uppercase tracking-wider text-gray-500">{col}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {safeRecords.slice(0, 5).map((record, idx) => (
                      <tr key={idx} className="border-t">
                        {columns.slice(0, 12).map((col, colIdx) => (<td key={colIdx} className="px-3 py-2 whitespace-nowrap">{record[col] != null ? String(record[col]) : '-'}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (<div className="text-center text-sm text-gray-500 py-3">No data available for preview</div>)}
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow mb-4">
        <div className="px-4 py-3 border-b font-semibold">Create Pivot Table</div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-sm">Group By (Rows)</label>
              <select value={pivotConfig.groupBy} onChange={(e) => setPivotConfig({...pivotConfig, groupBy: e.target.value})} className="mt-1 w-full rounded border px-2 py-1 text-sm">
                <option value="">-- Select Field --</option>
                {columns.map((field, idx) => (<option key={idx} value={field}>{field}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm">Columns (Optional)</label>
              <select value={pivotConfig.columns} onChange={(e) => setPivotConfig({...pivotConfig, columns: e.target.value})} className="mt-1 w-full rounded border px-2 py-1 text-sm">
                <option value="">-- None --</option>
                {columns.map((field, idx) => (<option key={idx} value={field}>{field}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm">Values to Analyze</label>
              <select multiple value={pivotConfig.values} onChange={(e) => { const selected = Array.from(e.target.selectedOptions).map(o => o.value); setPivotConfig({ ...pivotConfig, values: selected }) }} className="mt-1 w-full rounded border px-2 py-1 text-sm h-36">
                {columns.map((field, idx) => (<option key={idx} value={field}>{field}</option>))}
              </select>
              <div className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</div>
            </div>
            <div>
              <label className="text-sm">Calculation</label>
              <select value={pivotConfig.calculation} onChange={(e) => setPivotConfig({...pivotConfig, calculation: e.target.value})} className="mt-1 w-full rounded border px-2 py-1 text-sm">
                <option value="sum">Sum (Total)</option>
                <option value="count">Count</option>
                <option value="avg">Average</option>
                <option value="min">Minimum</option>
                <option value="max">Maximum</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={handleGeneratePivot} disabled={pivotLoading} className="bg-indigo-600 text-white px-3 py-1 rounded">{pivotLoading ? 'Generating...' : 'Generate Pivot'}</button>
            <button onClick={() => { setPivotConfig({ groupBy: '', columns: '', values: [], calculation: 'sum' }); setPivotResult({ columns: [], data: [] }); setPivotError(null) }} className="bg-gray-200 px-3 py-1 rounded">Clear</button>
            {pivotResult.data.length > 0 && (
              <>
                <button onClick={() => handleExport('excel', 'pivot')} disabled={exportLoading} className="bg-green-600 text-white px-3 py-1 rounded">Export Pivot (Excel)</button>
                <button onClick={() => handleExport('word', 'pivot')} disabled={exportLoading} className="bg-blue-600 text-white px-3 py-1 rounded">Export Pivot (Word)</button>
              </>
            )}
          </div>
        </div>
      </div>

      {pivotError && <div className="mb-4 text-red-600">{pivotError}</div>}

      {pivotResult?.data?.length > 0 && (
        <div className="bg-white rounded shadow mb-4">
          <div className="px-4 py-3 border-b font-semibold">Pivot Result</div>
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr>{pivotResult.columns.map((c,i)=>(<th key={i} className="px-3 py-2 whitespace-nowrap">{c}</th>))}</tr></thead>
              <tbody>{pivotResult.data.map((row,rIdx)=>(<tr key={rIdx} className="border-t">{pivotResult.columns.map((col,cIdx)=>(<td key={cIdx} className="px-3 py-2 whitespace-nowrap">{row[col] != null ? String(row[col]) : '-'}</td>))}</tr>))}</tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Filters & Search</div>
          <button className="text-sm text-indigo-600" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide' : 'Show'}</button>
        </div>
        {showFilters && (
          <div className="p-4">
            <div className="mb-3">
              <input type="text" placeholder="Search by name, project, or any keyword..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} onKeyPress={(e)=>e.key==='Enter'&&handleApplyFilter()} className="w-full rounded border px-3 py-2" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleApplyFilter} className="bg-indigo-600 text-white px-3 py-1 rounded">Apply Filters</button>
              <button onClick={handleClearFilter} className="bg-gray-200 px-3 py-1 rounded">Clear All</button>
              <div className="border-l mx-2" />
              <button onClick={()=>handleExport('excel','data')} disabled={exportLoading} className="bg-green-600 text-white px-3 py-1 rounded">Export Data (Excel)</button>
              <button onClick={()=>handleExport('word','data')} disabled={exportLoading} className="bg-blue-600 text-white px-3 py-1 rounded">Export Data (Word)</button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded shadow">
        <div className="px-4 py-3 border-b font-semibold">Database Table</div>
        <div className="p-0">
          {loading && (<div className="text-center py-6">Loading records...</div>)}
          {error && (<div className="m-3 text-red-600">{error}</div>)}
          {!loading && !error && safeRecords.length===0 && (<div className="m-3 text-sm">No records found matching your criteria.</div>)}

          {!loading && !error && safeRecords.length>0 && (
            <>
              <div className="overflow-auto" style={{ maxHeight: 600 }}>
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      {columns.map((col, idx) => (<th key={idx} className="px-3 py-2 text-left whitespace-nowrap" style={{ minWidth: 120 }}>{col}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {safeRecords.map((record, idx) => (
                      <tr key={record.id || idx} className="border-t">
                        {columns.map((col, colIdx) => (<td key={colIdx} className="px-3 py-2 whitespace-nowrap">{record[col] != null ? String(record[col]) : ''}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Showing {((currentPage-1)*perPage)+1} to {Math.min(currentPage*perPage, pagination.total)} of {pagination.total} entries</div>
                  <div className="flex items-center gap-2">
                    <button disabled={currentPage===1} onClick={()=>handlePageChange(currentPage-1)} className="px-3 py-1 rounded border">Previous</button>
                    <span className="text-sm font-semibold">Page {currentPage} of {pagination.pages}</span>
                    <button disabled={currentPage===pagination.pages} onClick={()=>handlePageChange(currentPage+1)} className="px-3 py-1 rounded border">Next</button>
                  </div>
                  <div>
                    <select value={perPage} onChange={(e)=>{ setPerPage(Number(e.target.value)); setCurrentPage(1) }} className="rounded border px-2 py-1">
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TableAnalysis
