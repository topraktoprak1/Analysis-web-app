// Data Analysis JavaScript for Flask App
let currentData = null;
let currentFilters = {};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
    initializeFavorites();
    loadUserProfilePhoto();
    // Load existing data if on index page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadExistingData();
    }
});

// Load existing data from session
async function loadExistingData() {
    try {
        console.log('Loading existing data...');
        const response = await fetch('/api/check-session');
        const result = await response.json();
        
        console.log('Check session result:', result);
        
        if (result.hasData) {
            currentData = result;
            console.log('Data loaded, displaying...');
            
            // Show sections first
            const sections = ['statsSection', 'filtersCard', 'dataCard', 'favoritesCard'];
            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.style.display = 'block';
                    console.log(`Showing section: ${id}`);
                } else {
                    console.log(`Section not found: ${id}`);
                }
            });
            
            const saveBtn = document.getElementById('saveReportBtn');
            if (saveBtn) saveBtn.style.display = 'inline-block';
            
            // Update stats if elements exist
            console.log('Updating stats with shape:', result.shape);
            const totalRows = document.getElementById('totalRows');
            const totalCols = document.getElementById('totalCols');
            
            if (totalRows) {
                totalRows.textContent = result.shape[0];
                console.log('Updated totalRows:', result.shape[0]);
            } else {
                console.log('totalRows element not found');
            }
            
            if (totalCols) {
                totalCols.textContent = result.shape[1];
                console.log('Updated totalCols:', result.shape[1]);
            } else {
                console.log('totalCols element not found');
            }
            
            // Count unique staff
            const nameCol = result.columns.find(col => 
                col.toLowerCase().includes('name') && col.toLowerCase().includes('surname')
            );
            const staffCount = document.getElementById('staffCount');
            console.log('Name column found:', nameCol);
            
            if (nameCol && result.data && staffCount) {
                const uniqueStaff = new Set(result.data.map(row => row[nameCol])).size;
                staffCount.textContent = uniqueStaff;
                console.log('Updated staffCount:', uniqueStaff);
            } else {
                console.log('staffCount update failed - nameCol:', nameCol, 'has data:', !!result.data, 'element exists:', !!staffCount);
            }
            
            // Display data if table exists
            if (typeof displayData === 'function') {
                console.log('Calling displayData...');
                displayData(result.data);
            }
            
            // Create filters if function exists
            if (typeof createFilters === 'function') {
                console.log('Calling createFilters...');
                createFilters(result.filter_columns);
            }
        } else {
            console.log('No data in session');
        }
    } catch (error) {
        console.error('Error loading existing data:', error);
    }
}

// Load user profile photo in navbar
function loadUserProfilePhoto() {
    const navPhoto = document.getElementById('navProfilePhoto');
    if (navPhoto) {
        fetch('/api/profile')
            .then(response => response.json())
            .then(data => {
                if (data.profile_photo) {
                    navPhoto.src = '/static/' + data.profile_photo;
                }
            })
            .catch(error => console.log('Profile photo not loaded'));
    }
}

// File upload handling
function initializeFileUpload() {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileUpload);
    }
}

async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    showLoading('Uploading and processing file...');
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentData = result;
            displayData(result.data);
            createFilters(result.filter_columns);
            showSuccess(`File uploaded! ${result.shape[0]} rows, ${result.shape[1]} columns`);
        } else {
            showError(result.error || 'Upload failed');
        }
    } catch (error) {
        showError('Error uploading file: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Display data in table
function displayData(data) {
    const tableContainer = document.getElementById('dataTable');
    if (!tableContainer || !data || data.length === 0) return;
    
    // Show only first 10 rows for performance
    const displayData = data.slice(0, 10);
    const totalRows = data.length;
    
    const columns = Object.keys(data[0]);
    
    let html = '<div class="table-responsive"><table class="table table-bordered table-hover">';
    
    // Header
    html += '<thead class="table-primary"><tr>';
    columns.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += '</tr></thead>';
    
    // Body - only first 10 rows
    html += '<tbody>';
    displayData.forEach(row => {
        html += '<tr>';
        columns.forEach(col => {
            const value = row[col] !== null && row[col] !== undefined ? row[col] : '';
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    // Add info about total rows
    if (totalRows > 10) {
        html += `<div class="alert alert-info mt-2">
            <i class="fas fa-info-circle"></i> Showing 10 of ${totalRows} rows. Use filters to narrow down results.
        </div>`;
    }
    
    tableContainer.innerHTML = html;
}

// Create filter controls - Streamlit style with checkboxes
function createFilters(filterColumns) {
    const filtersContainer = document.getElementById('filtersContainer');
    if (!filtersContainer || !filterColumns) return;
    
    let html = '<div class="row g-2">';
    
    filterColumns.forEach((filter, index) => {
        const uniqueId = `filter_${index}`;
        html += `
            <div class="col-md-3 col-sm-6">
                <div class="card">
                    <div class="card-header py-2 bg-light">
                        <button class="btn btn-sm w-100 text-start d-flex justify-content-between align-items-center p-0 border-0 bg-transparent" 
                                type="button" data-bs-toggle="collapse" data-bs-target="#${uniqueId}">
                            <strong class="small">${filter.name}</strong>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </div>
                    <div id="${uniqueId}" class="collapse">
                        <div class="card-body p-2">
                            <input type="text" class="form-control form-control-sm mb-2" 
                                   placeholder="🔍 Search..." 
                                   onkeyup="searchFilter('${uniqueId}', this.value)">
                            <div class="form-check mb-2">
                                <input class="form-check-input select-all" type="checkbox" id="${uniqueId}_all" 
                                       onchange="toggleAllOptions('${uniqueId}', this.checked)">
                                <label class="form-check-label small fw-bold" for="${uniqueId}_all">
                                    Select All
                                </label>
                            </div>
                            <hr class="my-1">
                            <div id="${uniqueId}_options" style="max-height: 200px; overflow-y: auto;">
                                ${filter.values.map((v, i) => `
                                    <div class="form-check filter-option">
                                        <input class="form-check-input filter-checkbox" type="checkbox" 
                                               id="${uniqueId}_${i}" value="${v}" data-column="${filter.name}">
                                        <label class="form-check-label small" for="${uniqueId}_${i}">
                                            ${v}
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += `
        <div class="mt-3 d-flex gap-2">
            <button class="btn btn-primary" onclick="applyFilters()">
                <i class="fas fa-filter"></i> Apply Filters
            </button>
            <button class="btn btn-secondary" onclick="clearFilters()">
                <i class="fas fa-times"></i> Clear All
            </button>
            <button class="btn btn-info" onclick="selectAllFilters()">
                <i class="fas fa-check-double"></i> Select All
            </button>
        </div>
    `;
    
    filtersContainer.innerHTML = html;
    
    // Initialize filter persistence after filters are created
    if (typeof initFilterPersistence === 'function') {
        initFilterPersistence();
    }
}

// Search filter options
function searchFilter(filterId, searchTerm) {
    const optionsContainer = document.getElementById(filterId + '_options');
    if (!optionsContainer) return;
    
    const searchLower = searchTerm.toLowerCase();
    const options = optionsContainer.querySelectorAll('.filter-option');
    
    options.forEach(option => {
        const label = option.querySelector('label');
        const text = label.textContent.toLowerCase();
        option.style.display = text.includes(searchLower) ? '' : 'none';
    });
}

// Toggle all options in a filter
function toggleAllOptions(filterId, checked) {
    const container = document.getElementById(filterId);
    const checkboxes = container.querySelectorAll('.filter-checkbox');
    // Only toggle visible checkboxes
    checkboxes.forEach(cb => {
        const option = cb.closest('.filter-option');
        if (option && option.style.display !== 'none') {
            cb.checked = checked;
        }
    });
}

// Select all filters
function selectAllFilters() {
    const selectAllCheckboxes = document.querySelectorAll('.select-all');
    selectAllCheckboxes.forEach(cb => {
        cb.checked = true;
        const filterId = cb.id.replace('_all', '');
        toggleAllOptions(filterId, true);
    });
}

// Apply filters
async function applyFilters() {
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    currentFilters = {};
    
    checkboxes.forEach(cb => {
        const column = cb.dataset.column;
        const value = cb.value;
        if (!currentFilters[column]) {
            currentFilters[column] = [];
        }
        currentFilters[column].push(value);
    });
    
    console.log('Applying filters:', currentFilters);
    
    // Store filters in sessionStorage for cross-page persistence
    sessionStorage.setItem('activeFilters', JSON.stringify(currentFilters));
    
    showLoading('Applying filters...');
    
    try {
        const response = await fetch('/api/filter', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({filters: currentFilters})
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayData(result.data);
            showSuccess(`Filtered to ${result.shape[0]} rows (filters applied across all pages)`);
        } else {
            showError(result.error || 'Filter failed');
        }
    } catch (error) {
        showError('Error applying filters: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Clear filters
function clearFilters() {
    const checkboxes = document.querySelectorAll('.filter-checkbox, .select-all');
    checkboxes.forEach(cb => cb.checked = false);
    currentFilters = {};
    
    // Clear from sessionStorage
    sessionStorage.removeItem('activeFilters');
    
    // Clear global filters
    if (typeof clearGlobalFilters === 'function') {
        clearGlobalFilters();
    }
    
    loadExistingData(); // Reload original data
}

// Create pivot table
async function createPivot() {
    const index = document.getElementById('pivotIndex').value;
    const columns = document.getElementById('pivotColumns').value;
    const values = Array.from(document.getElementById('pivotValues').selectedOptions).map(opt => opt.value);
    const aggFunc = document.getElementById('pivotAggFunc').value;
    
    if (!index || values.length === 0) {
        showError('Please select index and at least one value column');
        return;
    }
    
    showLoading('Creating pivot table...');
    
    try {
        const response = await fetch('/api/pivot', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                index, columns, values, agg_func: aggFunc,
                filters: currentFilters
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayData(result.data);
            showSuccess('Pivot table created');
        } else {
            showError(result.error || 'Pivot creation failed');
        }
    } catch (error) {
        showError('Error creating pivot: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Create chart
async function createChart() {
    const chartType = document.getElementById('chartType').value;
    const xCol = document.getElementById('chartX').value;
    const yCol = document.getElementById('chartY').value;
    const colorCol = document.getElementById('chartColor').value;
    
    if (!xCol || !yCol) {
        showError('Please select X and Y columns');
        return;
    }
    
    showLoading('Creating chart...');
    
    try {
        const response = await fetch('/api/chart', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                chart_type: chartType,
                x: xCol, y: yCol, color: colorCol,
                filters: currentFilters
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const chartData = JSON.parse(result.chart);
            Plotly.newPlot('chartContainer', chartData.data, chartData.layout);
            showSuccess('Chart created');
        } else {
            showError(result.error || 'Chart creation failed');
        }
    } catch (error) {
        showError('Error creating chart: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Favorites management
async function initializeFavorites() {
    try {
        const response = await fetch('/api/favorites');
        const data = await response.json();
        displayFavorites(data.reports || {});
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    if (!container) return;
    
    const favoritesList = Object.keys(favorites);
    
    if (favoritesList.length === 0) {
        container.innerHTML = '<p class="text-muted">No saved reports</p>';
        return;
    }
    
    let html = '<div class="list-group">';
    favoritesList.forEach(name => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${name}</span>
                <div>
                    <button class="btn btn-sm btn-primary" onclick="loadFavorite('${name}')">Load</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteFavorite('${name}')">Delete</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

async function saveFavorite() {
    const name = prompt('Enter report name:');
    if (!name) return;
    
    const config = {
        filters: currentFilters,
        // Add more config as needed
    };
    
    try {
        const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, config})
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Report saved');
            initializeFavorites();
        } else {
            showError(result.error || 'Save failed');
        }
    } catch (error) {
        showError('Error saving: ' + error.message);
    }
}

async function deleteFavorite(name) {
    if (!confirm(`Delete report "${name}"?`)) return;
    
    try {
        const response = await fetch(`/api/favorites/${name}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Report deleted');
            initializeFavorites();
        } else {
            showError(result.error || 'Delete failed');
        }
    } catch (error) {
        showError('Error deleting: ' + error.message);
    }
}

// Export functionality
async function exportReport(format) {
    showLoading('Generating comprehensive report...');
    
    try {
        // Gather active filters
        const filters = currentFilters || {};
        
        // Try to get stored pivot configuration
        let pivotConfig = null;
        try {
            const storedPivot = sessionStorage.getItem('lastPivotConfig');
            if (storedPivot) {
                pivotConfig = JSON.parse(storedPivot);
            }
        } catch (e) {
            console.log('No pivot config found');
        }
        
        // Try to get stored chart configurations
        let chartConfigs = [];
        try {
            const storedCharts = sessionStorage.getItem('lastChartConfigs');
            if (storedCharts) {
                chartConfigs = JSON.parse(storedCharts);
            }
        } catch (e) {
            console.log('No chart configs found');
        }
        
        const response = await fetch('/api/export', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                format, 
                filters,
                pivot_config: pivotConfig,
                chart_configs: chartConfigs
            })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `comprehensive_report_${new Date().getTime()}.${format === 'word' ? 'docx' : 'xlsx'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showSuccess(`${format === 'word' ? 'Word' : 'Excel'} report downloaded successfully!`);
        } else {
            const result = await response.json();
            showError(result.error || 'Export failed');
        }
    } catch (error) {
        showError('Error exporting: ' + error.message);
    } finally {
        hideLoading();
    }
}

// UI helpers
function showLoading(message = 'Loading...') {
    const toast = document.getElementById('loadingToast');
    if (toast) {
        toast.querySelector('.toast-body').textContent = message;
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

function hideLoading() {
    const toast = document.getElementById('loadingToast');
    if (toast) {
        const bsToast = bootstrap.Toast.getInstance(toast);
        if (bsToast) bsToast.hide();
    }
}

function showSuccess(message) {
    showAlert(message, 'success');
}

function showError(message) {
    showAlert(message, 'danger');
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}
