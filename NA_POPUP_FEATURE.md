# N/A Values Popup Feature

## Overview
The system now automatically detects when calculated fields fail to populate (N/A values) and prompts you to manually enter those values through a popup modal before saving the record.

## How It Works

### Step 1: Enter Your Data
1. Go to the Admin Panel
2. Fill in the normal input fields (ID, Name Surname, Scope, Projects, etc.)
3. Click **Add Record**

### Step 2: Automatic Calculation
The system attempts to auto-calculate fields like:
- North/South
- Currency
- Control-1
- TM Liste
- TM Kod
- Kontrol-1
- NO-1, NO-2, NO-3, NO-10
- And all other formula-based fields

### Step 3: N/A Detection
If any calculated fields return empty or N/A values, the system:
- **Stops** the submission (doesn't save the incomplete record)
- **Shows a warning popup** listing all fields that couldn't be calculated
- **Provides input fields** for each N/A field in the popup

### Step 4: Manual Entry
In the popup modal:
1. You'll see a warning message: *"Auto-calculation failed for some fields"*
2. A list of fields that need values
3. Input fields for each N/A value
4. Two buttons:
   - **Cancel**: Closes popup, lets you modify the original form
   - **Save Record**: Saves the record with your manual values

### Step 5: Final Save
When you click **Save Record** in the popup:
- The system combines your original input with the manual N/A values
- Saves the complete record to the database
- Shows success message
- Refreshes the records list

## Example Workflow

### Example 1: All Calculations Succeed
```
User enters: Scope = "TBA 2 PIPELINE", ID = 900375
Click "Add Record"
→ All fields calculate successfully
→ Record saved immediately ✓
→ No popup shown
```

### Example 2: Some Calculations Fail
```
User enters: Scope = "FILYOS P2-FPU", ID = 900375
Click "Add Record"
→ System calculates all fields
→ Detects: Control-1, TM Kod, Kontrol-1, NO-2, NO-3 are empty
→ Shows popup: "Missing Values Detected"
→ User enters:
    • Control-1: TM
    • TM Kod: FP2-FPU
    • Kontrol-1: 405
    • NO-2: 405-TZ
    • NO-3: Z
→ Click "Save Record"
→ Record saved with manual values ✓
```

## Technical Details

### Backend (app.py)
**Modified `calculate_auto_fields()` function:**
- Returns a tuple: `(record_data, na_fields)`
- Tracks which fields failed to calculate
- Checks for empty, None, or 'N/A' values

**Modified `/api/add-record` endpoint:**
- First submission: Calculates and checks for N/A
- Returns status 202 if N/A fields exist
- Includes `na_fields` list in response
- Second submission: Accepts `manual_values` and saves record

### Frontend (admin.html)
**New modal: `naValuesModal`:**
- Bootstrap modal with warning styling
- Dynamically generates input fields for N/A values
- Prevents closing by clicking outside (static backdrop)

**New JavaScript functions:**
- `showNAModal(naFields)`: Displays the popup with input fields
- `submitWithManualValues()`: Sends second request with manual data

### Response Flow
```
First Request:
POST /api/add-record
{
  "record": { /* user input data */ }
}

Response (if N/A exists):
Status: 202 Accepted
{
  "na_fields": ["Control-1", "TM Kod", "NO-2"],
  "message": "Some fields could not be auto-calculated..."
}

Second Request (after user fills popup):
POST /api/add-record
{
  "record": { /* original user input */ },
  "manual_values_provided": true,
  "manual_values": {
    "Control-1": "TM",
    "TM Kod": "FP2-FPU",
    "NO-2": "405-TZ"
  }
}

Response:
Status: 200 OK
{
  "success": true,
  "message": "Record added successfully"
}
```

## Benefits

### 1. No More Incomplete Records
- Records are never saved with N/A values
- User is forced to provide missing data

### 2. Better User Experience
- Only shows problematic fields (not all 20+ calculated fields)
- Clear warning about what's missing
- Easy to fix on-the-spot

### 3. Data Quality
- Ensures complete records in the database
- Handles edge cases gracefully
- Preserves data integrity

### 4. Flexibility
- User can cancel and modify original input
- Can manually override any failed calculation
- No need to know which fields are calculated beforehand

## Checked N/A Fields

The system checks these fields for N/A values:
- North/South
- Currency
- Control-1
- TM Liste
- TM Kod
- Kontrol-1
- NO-1
- NO-2
- NO-3
- NO-10

Other calculated fields (Cost, Hourly Rate, etc.) are always computable from input data and won't appear in the popup.

## User Interface

### Popup Appearance
```
┌─────────────────────────────────────────┐
│ ⚠️ Missing Values Detected             │
├─────────────────────────────────────────┤
│ ⚠️ Auto-calculation failed for some     │
│    fields. Please provide values for    │
│    the following fields:                │
│                                         │
│  Control-1                              │
│  [________________]                     │
│                                         │
│  TM Kod                                 │
│  [________________]                     │
│                                         │
│  NO-2                                   │
│  [________________]                     │
│                                         │
│         [Cancel]  [💾 Save Record]      │
└─────────────────────────────────────────┘
```

## Troubleshooting

### Issue: Popup shows for fields that should calculate
**Solution**: Check that Excel lookup values match exactly (spacing, capitalization)

### Issue: Popup doesn't show even with N/A values
**Solution**: Check browser console for errors, ensure JavaScript is enabled

### Issue: Values don't save after filling popup
**Solution**: Check that you filled in all fields before clicking Save Record

## Future Enhancements

Possible improvements:
- Show suggestions based on similar records
- Highlight which input field caused the lookup to fail
- Add validation for manual entries (format checking)
- Remember previously entered values for similar records
