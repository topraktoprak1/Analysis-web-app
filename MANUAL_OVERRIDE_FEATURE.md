# Manual Override Feature for Auto-Calculated Fields

## Overview
The system now supports **manual value entry** for all auto-calculated fields. This solves the problem of N/A values when the Excel lookup formulas fail due to data inconsistencies.

## How It Works

### 1. Auto-Calculated Fields Are Now Optional
All fields that were previously auto-calculated (North/South, Currency, Hourly Rate, etc.) now appear in the "Add New Record" form with a special indicator:
- **Label**: Shows `(auto-calculated if empty)` in gray text
- **Field Style**: Light gray background
- **Placeholder**: "Leave empty to auto-calculate"

### 2. Smart Value Handling
When you submit a record, the system follows this logic:

```
IF user entered a value:
    → Keep the user's value (no auto-calculation)
ELSE:
    → Try to auto-calculate the value
    IF auto-calculation succeeds:
        → Use the calculated value
    ELSE:
        → Field remains empty/N/A
```

### 3. Example Scenarios

#### Scenario A: Normal Operation
- User enters: `Scope = "FILYOS P2-FPU"`, `PERSON ID = 900375`
- User leaves `North/South` empty
- System auto-calculates: `North/South = "North"`
- Result: ✓ Field is filled automatically

#### Scenario B: Lookup Fails
- User enters: `Scope = "UNKNOWN PROJECT"`
- User leaves `North/South` empty
- System tries to auto-calculate but finds no match
- Result: ⚠️ `North/South = N/A` or empty

#### Scenario C: Manual Override
- User enters: `Scope = "UNKNOWN PROJECT"`
- User manually enters: `North/South = "South"`
- System sees user provided a value
- Result: ✓ `North/South = "South"` (user's value is kept)

## Benefits

### 1. No More N/A Records
You can now add records even when Excel lookups fail. Simply enter the values manually.

### 2. Data Consistency
The system still tries to auto-calculate when possible, maintaining data consistency with Excel formulas.

### 3. Flexibility
Handles edge cases and data inconsistencies gracefully without blocking record creation.

## Affected Fields

All these fields now support manual override:

**Basic Fields:**
- North/South
- Currency
- Hourly Rate
- Cost
- Hourly Base Rate
- Hourly Additional Rates
- AP-CB/Subcon
- LS/Unit Rate

**Cost Fields:**
- General Total Cost (USD)
- Hourly Unit Rate (USD)

**İşveren Fields:**
- İşveren-Hakediş Birim Fiyat
- İşveren- Hakediş
- İşveren- Hakediş (USD)
- İşveren-Hakediş Birim Fiyat (USD)

**Control Fields:**
- Control-1 TM Liste
- Control-1 TM Kod
- Kontrol-1
- Kontrol-2

**NO Fields:**
- NO-1
- NO-2
- NO-3
- NO-10

## System-Only Fields
These fields are NEVER shown in the form and are always calculated:
- KAR/ZARAR (always calculated from other fields)
- BF KAR/ZARAR (always calculated from other fields)

## Technical Implementation

### Backend (app.py)
```python
def set_field_if_valid(field_name, calculated_value, allow_zero=False):
    """Set field only if user didn't provide a value"""
    existing_value = record_data.get(field_name, '')
    
    # If user already provided a value, keep it
    if existing_value and str(existing_value).strip():
        print(f'DEBUG: Keeping user-provided value for {field_name}: {existing_value}')
        return
    
    # Set calculated value if it's valid
    if calculated_value or (allow_zero and calculated_value == 0):
        record_data[field_name] = calculated_value
```

### Frontend (admin.html)
- Auto-calculated fields have `bg-light` CSS class
- Labels include `<small class="text-muted">(auto-calculated if empty)</small>`
- Placeholders guide users: "Leave empty to auto-calculate"

## Best Practices

1. **Leave Fields Empty When Possible**: Let the system auto-calculate for consistency
2. **Manual Entry for Edge Cases**: Use manual entry only when auto-calculation fails
3. **Verify Calculated Values**: Check that auto-calculated values make sense before submitting
4. **Document Manual Entries**: Consider adding notes when you override auto-calculated values

## Debugging

When a field shows N/A after submission:
1. Check the console (F12) for debug messages like:
   ```
   DEBUG: TM Kod lookup - projects=FILYOS P2-FPU, result=
   ```
2. If result is empty, the lookup failed
3. Edit the record and manually enter the correct value
4. The system will preserve your manual entry

## Migration Notes

- All existing records remain unchanged
- New records can use either auto-calculation or manual entry
- No database schema changes required
- Backward compatible with existing Excel files
