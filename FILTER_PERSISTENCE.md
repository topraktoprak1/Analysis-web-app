# Persistent Filter System - Cross-Page Filter Memory

## Overview
The application now features a **global filter persistence system** that saves your filter selections across all analysis pages (Index, Pivot Table, and Graph Analysis). When you select filters on one page, they automatically apply to all other pages.

## Key Features

### 1. **Cross-Page Filter Persistence**
- Filter selections are saved in browser localStorage
- Filters persist when navigating between pages:
  - **Index (Database View)** ↔ **Pivot Analysis** ↔ **Graph Analysis**
- Filters remain active even after page refresh
- Admin Panel excluded (filters don't apply there)

### 2. **Added Filters to Graph Analysis Page**
- New collapsible filter section with same functionality as other pages
- Cascading filters work identically
- Real-time filter updates affect chart data

### 3. **Automatic Filter Application**
- When you load any page, saved filters are automatically applied
- No need to re-select filters on each page
- Seamless experience across the application

## How It Works

### Saving Filters
Filters are automatically saved when you:
1. Check/uncheck any filter checkbox
2. Navigate to another page
3. Apply filters

### Loading Filters
Filters are automatically loaded when you:
1. Open any analysis page (Index, Table, Graphs)
2. Refresh the page
3. Return from another page

### Clearing Filters
Filters can be cleared by:
1. Clicking **"Clear All Filters"** button on any page
2. Using the global reset function
3. All pages will reflect the cleared state

## Page-Specific Behavior

### Index Page (Database View)
- ✅ Filters saved automatically
- ✅ Filters persist across sessions
- ✅ "Clear All" button clears global filters
- 🔄 Filters apply to data table display

### Pivot Analysis Page
- ✅ Filters saved automatically
- ✅ Cascading filters enabled
- ✅ Hidden irrelevant options
- 🔄 Filters apply to pivot table data

### Graph Analysis Page (NEW!)
- ✅ **New filter section added**
- ✅ Collapsible filter panel
- ✅ Same cascading behavior as Pivot page
- ✅ Filters saved automatically
- 🔄 Filters apply to all charts

### Admin Panel
- ❌ Filters NOT applied here
- Independent from global filters
- Used for record management only

## Technical Implementation

### New Files Created
**`static/js/filter-persistence.js`**
- Global filter state management
- localStorage integration
- Cross-page synchronization functions

### Key Functions

#### `saveGlobalFilters(filters)`
```javascript
// Saves current filter state to localStorage
saveGlobalFilters({
  "Company": ["AP-CB", "ABCB"],
  "Discipline": ["ELECTRICAL"]
});
```

#### `loadGlobalFilters()`
```javascript
// Loads saved filters from localStorage
const savedFilters = loadGlobalFilters();
// Returns: { "Company": ["AP-CB", "ABCB"], ... }
```

#### `applySavedFiltersToCheckboxes(savedFilters)`
```javascript
// Applies saved filters to page checkboxes
applySavedFiltersToCheckboxes(savedFilters);
```

#### `resetAllFiltersGlobally()`
```javascript
// Clears all filters across all pages
resetAllFiltersGlobally();
```

#### `initFilterPersistence()`
```javascript
// Initialize filter system on page load
initFilterPersistence();
```

### Integration Points

**All Pages Include:**
```html
<script src="{{ url_for('static', filename='js/filter-persistence.js') }}"></script>
```

**After Filter Population:**
```javascript
// In table.html, index.html, graphs.html
populateFilters(filterCols);
// ...filters created...
initFilterPersistence(); // Initialize persistence
```

## Usage Examples

### Example 1: Filter Once, Use Everywhere
1. Go to **Database View** (index.html)
2. Select filters:
   - Company: "AP-CB"
   - Discipline: "ELECTRICAL"
3. Navigate to **Pivot Analysis**
   - Filters automatically applied ✓
   - Data shows only AP-CB electrical engineers
4. Navigate to **Graph Analysis**
   - Same filters applied ✓
   - Charts show filtered data

### Example 2: Modify Filters on Any Page
1. On **Pivot Analysis**, change filters:
   - Add "CONSULTANCY" to Discipline
2. Navigate to **Database View**
   - New filter selections applied ✓
3. Navigate to **Graph Analysis**
   - Updated filters applied ✓

### Example 3: Clear Filters Globally
1. On any page, click **"Clear All Filters"**
2. Navigate to any other page
   - All filters reset ✓
   - Full dataset visible

## Data Storage

### localStorage Schema
```javascript
{
  "veriAnalizi_globalFilters": {
    "filters": {
      "Name Surname": ["Andrey Kurenkov", "Anil Kirit"],
      "Company": ["AP-CB"],
      "Discipline": ["ELECTRICAL", "CONSULTANCY"]
    },
    "timestamp": "2025-12-15T10:30:00.000Z",
    "page": "/table.html"
  }
}
```

### Storage Properties
- **filters**: Object with column names as keys
- **timestamp**: When filters were last saved
- **page**: Which page saved the filters
- **Persistence**: Survives browser refresh
- **Scope**: Per-domain (your application only)

## Graph Analysis Page Enhancements

### New Filter Section
Located below the active filters alert:
```
┌─────────────────────────────────────┐
│ 🔍 Data Filters                     │
│ [Toggle Filters]                    │
├─────────────────────────────────────┤
│ ┌─ Name Surname ─┐ ┌─ Discipline ─┐│
│ │ □ Person 1     │ │ ☑ ELECTRICAL ││
│ │ □ Person 2     │ │ □ CIVIL      ││
│ └────────────────┘ └──────────────┘│
│                                     │
│ [Clear All Filters]                 │
└─────────────────────────────────────┘
```

### Features:
- Collapsible panel (click "Toggle Filters")
- Same cascading behavior as Pivot page
- Filter count indicators
- Select all/none per column
- Real-time data filtering

## Benefits

### 1. **Seamless Workflow**
- Set filters once, use everywhere
- No repetitive filter selection
- Faster analysis workflow

### 2. **Consistency**
- Same data subset across all views
- Reduced errors from mismatched filters
- Clear understanding of active filters

### 3. **Time Savings**
- No re-selecting filters on each page
- Instant filter application
- Quick navigation between pages

### 4. **User Experience**
- Intuitive behavior
- Automatic synchronization
- Visual feedback on all pages

## Browser Compatibility

Works on all modern browsers:
- ✅ Chrome / Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Requires JavaScript and localStorage enabled.

## Privacy & Security

- **Local Storage Only**: Filters stored in browser only
- **No Server Storage**: Not sent to server
- **Per-Browser**: Different browsers have separate filters
- **Clear on Logout**: Can be cleared anytime

## Troubleshooting

### Filters Not Persisting
**Issue**: Filters reset when navigating pages
**Solution**: 
- Check that JavaScript is enabled
- Ensure localStorage is not disabled
- Clear browser cache and retry

### Filters Not Matching Between Pages
**Issue**: Different filters on different pages
**Solution**:
- Click "Clear All Filters" on any page
- Refresh all open tabs
- Re-select desired filters

### Too Many Filters Saved
**Issue**: Performance degradation
**Solution**:
- Clear all filters regularly
- Browser localStorage has 5-10MB limit
- Current implementation uses <1KB typically

## Future Enhancements

Possible improvements:
- Named filter sets (save multiple configurations)
- Share filter links with colleagues
- Export/import filter configurations
- Filter history (undo/redo)
- Server-side filter storage for team sharing
