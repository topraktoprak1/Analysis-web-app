# Cascading Dynamic Filters

## Overview
The pivot table filters now work as **cascading dynamic filters**. When you select options in one filter, the other filters automatically update to show only relevant values based on your current selections.

## How It Works

### Before (Static Filters)
- All filter options were always visible
- Selecting values didn't affect other filters
- Could select combinations that return no data

### After (Cascading Filters)
- Filter options update dynamically based on your selections
- Only shows values that exist in the filtered dataset
- Prevents selecting invalid combinations
- Irrelevant options are **hidden completely**

## User Experience

### Example Workflow

**Step 1: Initial State**
- All filters show all available values
- All checkboxes are checked
- You see the full dataset

**Step 2: Select a Company**
- Uncheck all companies except "AP-CB"
- Other filters update automatically:
  - **Name Surname**: Shows only people who work for AP-CB
  - **Discipline**: Shows only disciplines used in AP-CB
  - **Projects**: Shows only AP-CB projects
  - **Office Location**: Shows only AP-CB locations
  - etc.

**Step 3: Narrow Down Further**
- Select "ELECTRICAL" in Discipline filter
- Filters update again:
  - **Name Surname**: Shows only AP-CB electrical engineers
  - **Projects**: Shows only projects with electrical work
  - Other irrelevant options disappear

**Step 4: Continue Refining**
- Each filter selection cascades to all others
- Options that don't exist in the filtered data are hidden
- Footer shows "X / Y available" where Y is total possible values

## Visual Feedback

### Available Options
- ✓ Checkbox enabled and visible
- Full opacity (100%)
- Can be checked/unchecked normally

### Unavailable Options (Hidden)
- Hidden completely (`display: none`)
- Not shown in the filter list
- Doesn't clutter the interface

### Filter Footer
Shows: `5 / 65 available`
- **5** = Currently selected
- **65** = Total possible values in this column

## Technical Implementation

### Backend (app.py)

**Endpoint**: `POST /api/get-filtered-options`

**Process**:
1. Receives current filter selections
2. Filters the dataset based on selections
3. Extracts unique values from filtered data
4. Returns available options for each column

**Example Request**:
```json
{
  "filters": {
    "Company": ["AP-CB", "ABCB"],
    "Discipline": ["ELECTRICAL"]
  }
}
```

**Example Response**:
```json
{
  "success": true,
  "filter_columns": [
    {
      "name": "Name Surname",
      "values": ["Andrey Kurenkov", "Anil Kirit", ...]  // Only AP-CB/ABCB electrical engineers
    },
    {
      "name": "Projects",
      "values": ["BALLAST NEDAM", "CEYHAN PORT", ...]  // Only projects with electrical work
    },
    ...
  ]
}
```

### Frontend (table.html)

**Key Functions**:

1. **`onFilterChange(changedColumn)`**
   - Triggered when any filter checkbox changes
   - Collects current selections
   - Sends request to backend
   - Updates all filters with new options

2. **`updateCascadingFilters(newFilterColumns, changedColumn)`**
   - Receives available values from backend
   - Hides options not in the available set
   - Shows options that are available
   - Unchecks hidden options automatically
   - Updates footer counts

3. **`clearAllFilters()`**
   - Shows all options again
   - Checks all checkboxes
   - Resets to initial state

## Benefits

### 1. No Invalid Selections
- Can't select combinations that return zero results
- Always guaranteed to have data when you create pivot

### 2. Faster Navigation
- Irrelevant options are hidden
- Smaller filter lists to scroll through
- Easier to find what you need

### 3. Data Discovery
- See what values exist for your selection
- Understand data relationships
- Find patterns in your dataset

### 4. Better Performance
- Backend filters data once
- Frontend only hides/shows elements
- Smooth and responsive

## Filter Order

Filters appear in this preferred order:
1. Name Surname
2. Discipline
3. (Week / Month)
4. Company
5. Projects/Group
6. Nationality
7. Office Location
8. Kuzey MH-Person
9. Status
10. North/South
11. Currency
12. PP

Then any additional columns from your data.

## Performance Notes

- Filters up to 500 unique values per column
- Processes ~20,000 rows efficiently
- Updates in <500ms typically
- Debug logs in browser console (F12)

## Debugging

Open browser console (F12) to see:
```
=== FILTER CHANGE DEBUG ===
Changed column: Company
Current filters after update: {Company: ['AP-CB'], Discipline: [...]}
Filter categories: 10
  Company: 1 values
  Discipline: 5 values
  ...
========================

Received filtered options: 15 columns
Updating cascading filters...
  Name Surname: 120 available values
    Hidden: 465, Unchecked: 465
  Discipline: 5 available values
    Hidden: 17, Unchecked: 17
  ...
Cascading filters updated
```

## Tips

1. **Start broad, then narrow**: Select major filters first (Company, Discipline), then refine
2. **Watch the counts**: Footer shows how many options are available
3. **Clear often**: Use "Clear All Filters" button to reset and start over
4. **Check the data**: Hidden options mean they don't exist for your selection

## Future Enhancements

Possible improvements:
- Show greyed-out count of hidden options
- Add search within filters
- Save common filter combinations
- Export filtered data
