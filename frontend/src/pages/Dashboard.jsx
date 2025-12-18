import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecords } from '../store/slices/dataSlice';
import api from '../services/api';

// Components
import CardDataStats from '../components/CardDataStats'; // We will create this simple component inline or separately later. 
// For now, I will include the SVGs and card structure directly to ensure it works immediately.

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Default records to [] so it never crashes even if API hasn't loaded yet
  const { records, pagination = {}, loading, error } = useSelector((state) => state.data || {});
  const safeRecords = Array.isArray(records) ? records : [];
  
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchRecords({ page: 1, per_page: 10 }));
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    setUploading(true);
    setUploadMessage(null);

    try {
      const response = await api.post('/api/process_empty_cells', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadMessage({ 
        type: 'success', 
        text: `File processed successfully! ${response.data.filled_count} cells filled.` 
      });
      
      dispatch(fetchRecords({ page: 1, per_page: 10 }));
      setUploadFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'File upload failed' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Card 1: Total Records */}
        <div className="rounded-lg border border-stroke bg-card py-6 px-7.5 shadow-default">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 0L0 5L11 10L22 5L11 0ZM11 2.25L18.8 5L11 7.75L3.2 5L11 2.25Z" fill=""/>
              <path d="M11 11.5L3.2 8.75L0 10.25L11 15.25L22 10.25L18.8 8.75L11 11.5Z" fill=""/>
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-2xl font-semibold text-gray-900">
                {pagination.total || 0}
              </h4>
              <span className="text-sm font-medium">Total Records</span>
            </div>
          </div>
        </div>

        {/* Card 2: User Status */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg className="fill-primary dark:fill-white" width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                Active
              </h4>
              <span className="text-sm font-medium">System Status</span>
            </div>
          </div>
        </div>

        {/* Card 3: Role */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
             <svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
             </svg>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {user?.role || 'Admin'}
              </h4>
              <span className="text-sm font-medium">Current Role</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        
        {/* File Upload Section */}
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-lg border border-stroke bg-card shadow-default">
            <div className="border-b border-stroke py-4 px-7.5">
              <h3 className="font-medium text-gray-900 flex items-center gap-2"><i className="fa-solid fa-upload text-sm text-gray-500"></i> Upload Excel File</h3>
            </div>
            <div className="p-6">
              <div className="mb-5">
                <p className="mb-2 text-sm text-black dark:text-white">
                  Upload an Excel file (.xlsb or .xlsx) to process and fill empty cells.
                </p>
                
                {uploadMessage && (
                  <div className={`mb-4 flex w-full border-l-6 px-7 py-3 shadow-md ${
                    uploadMessage.type === 'success' 
                      ? 'border-[#34D399] bg-[#34D399] bg-opacity-[15%] text-[#34D399]' 
                      : 'border-[#F87171] bg-[#F87171] bg-opacity-[15%] text-[#F87171]'
                  }`}>
                    <div className="w-full">
                      <h5 className="mb-3 font-bold truncate">
                        {uploadMessage.type === 'success' ? 'Success!' : 'Error!'}
                      </h5>
                      <p className="leading-relaxed text-sm">
                        {uploadMessage.text}
                      </p>
                    </div>
                  </div>
                )}

                <div className="relative mb-5.5 block w-full appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 sm:py-7.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsb,.xlsx"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z" fill="#3C50E0"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z" fill="#3C50E0"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z" fill="#3C50E0"/>
                      </svg>
                    </span>
                    <p className="text-sm font-medium">
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1.5 text-xs">XLSB or XLSX</p>
                  </div>
                </div>

                {uploadFile && (
                   <p className="text-sm text-black dark:text-white mb-4 text-center">
                     Selected: <span className="font-semibold">{uploadFile.name}</span>
                   </p>
                )}
              </div>

              <div className="flex justify-end gap-4.5">
                <button
                  className="flex justify-center rounded bg-indigo-600 py-2 px-6 font-medium text-white hover:shadow-sm disabled:opacity-50"
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                >
                  {uploading ? 'Processing...' : 'Upload & Process'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Records Table */}
        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-lg border border-stroke bg-card px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-gray-900 flex items-center gap-2"><i className="fa-regular fa-clock mr-1 text-gray-500"></i> Recent Records</h4>

            <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-t-md bg-gray-2 sm:grid-cols-5">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500">ID</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Project</h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Hours</h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Date</h5>
                </div>
              </div>

              {loading && <div className="p-4 text-center">Loading...</div>}
              
              {!loading && safeRecords.length === 0 && (
                 <div className="p-4 text-center text-sm text-black dark:text-white">
                   No records found.
                 </div>
              )}
              {safeRecords.slice(0, 5).map((record, key) => (
                <div
                  className={`grid grid-cols-3 sm:grid-cols-5 ${
                    key === safeRecords.length - 1
                      ? ''
                      : 'border-b border-stroke dark:border-strokedark'
                  }`}
                  key={key}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{record.id}</p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">
                      {record.personel || record['Name Surname'] || '-'}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">
                      {record['Projects/Group'] || '-'}
                    </p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <p className="text-black dark:text-white">
                      {record['Total MH'] || '0'}
                    </p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <p className="text-meta-5">
                       {new Date(record.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;