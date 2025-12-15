/**
 * Global Filter Persistence System
 * Saves and loads filter selections across all pages (Index, Table, Graphs)
 */

// Global filter state storage key
const FILTER_STATE_KEY = 'veriAnalizi_globalFilters';

/**
 * Save current filter selections to localStorage
 * @param {Object} filters - Filter selections by column name
 */
function saveGlobalFilters(filters) {
    try {
        const filterState = {
            filters: filters,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
        localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(filterState));
        console.log('Global filters saved:', filterState);
    } catch (error) {
        console.error('Error saving global filters:', error);
    }
}

/**
 * Load saved filter selections from localStorage
 * @returns {Object|null} - Saved filter selections or null if none exist
 */
function loadGlobalFilters() {
    try {
        const savedState = localStorage.getItem(FILTER_STATE_KEY);
        if (savedState) {
            const filterState = JSON.parse(savedState);
            console.log('Global filters loaded:', filterState);
            return filterState.filters;
        }
    } catch (error) {
        console.error('Error loading global filters:', error);
    }
    return null;
}

/**
 * Clear saved filter selections
 */
function clearGlobalFilters() {
    try {
        localStorage.removeItem(FILTER_STATE_KEY);
        console.log('Global filters cleared');
    } catch (error) {
        console.error('Error clearing global filters:', error);
    }
}

/**
 * Apply saved filters to checkboxes
 * @param {Object} savedFilters - Filter selections by column name
 */
function applySavedFiltersToCheckboxes(savedFilters) {
    if (!savedFilters || Object.keys(savedFilters).length === 0) {
        console.log('No saved filters to apply');
        return;
    }
    
    console.log('Applying saved filters to checkboxes:', savedFilters);
    
    // First, uncheck all checkboxes
    const allCheckboxes = document.querySelectorAll('.filter-checkbox');
    allCheckboxes.forEach(cb => cb.checked = false);
    
    // Then, check only the saved ones
    Object.keys(savedFilters).forEach(columnName => {
        const values = savedFilters[columnName];
        if (!values || values.length === 0) return;
        
        values.forEach(value => {
            // Find checkbox with this column and value
            const checkboxes = document.querySelectorAll(`input[data-column="${columnName}"]`);
            checkboxes.forEach(cb => {
                if (cb.value === value) {
                    cb.checked = true;
                }
            });
        });
    });
    
    console.log('Saved filters applied to checkboxes');
}

/**
 * Get current filter selections from checkboxes
 * @returns {Object} - Current filter selections
 */
function getCurrentFiltersFromCheckboxes() {
    const filters = {};
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked:not(:disabled)');
    
    checkboxes.forEach(cb => {
        const column = cb.getAttribute('data-column');
        if (!filters[column]) {
            filters[column] = [];
        }
        filters[column].push(cb.value);
    });
    
    return filters;
}

/**
 * Initialize filter persistence for a page
 * Should be called after filters are populated
 */
function initFilterPersistence() {
    console.log('Initializing filter persistence...');
    
    // Load saved filters
    const savedFilters = loadGlobalFilters();
    
    if (savedFilters) {
        console.log('Found saved filters, applying...');
        // Apply saved filters after a short delay to ensure DOM is ready
        setTimeout(() => {
            applySavedFiltersToCheckboxes(savedFilters);
            
            // Trigger filter change to update cascading and data
            if (typeof onFilterChange === 'function') {
                onFilterChange(null);
            }
        }, 500);
    } else {
        console.log('No saved filters found');
    }
    
    // Save filters whenever they change
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('filter-checkbox')) {
            // Save current state after a short delay
            setTimeout(() => {
                const currentFilters = getCurrentFiltersFromCheckboxes();
                saveGlobalFilters(currentFilters);
            }, 100);
        }
    });
}

/**
 * Clear all filters and reset to default
 */
function resetAllFiltersGlobally() {
    // Clear from localStorage
    clearGlobalFilters();
    
    // Check all checkboxes
    const allCheckboxes = document.querySelectorAll('.filter-checkbox');
    allCheckboxes.forEach(cb => {
        cb.checked = true;
        cb.disabled = false;
        const parentDiv = cb.closest('.form-check');
        if (parentDiv) {
            parentDiv.style.display = '';
            parentDiv.style.opacity = '1';
        }
    });
    
    // Trigger update
    if (typeof onFilterChange === 'function') {
        onFilterChange(null);
    }
    
    console.log('All filters reset globally');
}
