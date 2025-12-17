# Quick Start Guide - Fill Empty Cells Feature

## 📋 What This Does
Automatically fills empty cells in your Excel DATABASE sheet using formulas like XLOOKUP, calculating rates, costs, and client billing information.

## 🚀 Quick Start (3 Steps)

### Step 1: Upload Reference Data
First, upload a complete Excel file that contains:
- ✅ **Info** sheet (lookup data)
- ✅ **Hourly Rates** sheet (rate information)
- ✅ **Summary** sheet (optional)

**How**: Admin Panel → "Upload Excel Database" → Choose file

### Step 2: Upload File with Empty Cells
Upload your Excel file that has:
- ✅ **DATABASE** sheet with empty cells
- ✅ Required columns: ID, Scope, Projects, Company, Total MH, etc.

**How**: Admin Panel → "Fill Empty Cells with Formulas" → Upload

### Step 3: Download Result
- ⏳ Wait for processing (spinner appears)
- ✅ Click "Download Filled File" when ready
- 📥 Get your Excel file with all cells filled

## 📊 What Gets Filled Automatically

### Lookup Fields
- North/South (from Scope)
- Currency (from ID)
- AP-CB/Subcon (from Company)
- TM Kod, TM Liste (from Projects/ID)
- NO-1, NO-2, NO-3, NO-10 (various lookups)

### Calculated Fields
- Hourly Base Rate
- Hourly Additional Rate  
- Hourly Rate (Base + Additional)
- Cost (Rate × Hours)
- General Total Cost (USD)
- Hourly Unit Rate (USD)

### Client (İşveren) Fields
- İşveren Hakediş Birim Fiyat
- İşveren-Hakediş(USD)
- İşveren Hakediş (USD)
- İşveren Hakediş Birim Fiyatı (USD)

### Control Fields
- Control-1, Kontrol-1, Kontrol-2
- LS/Unit Rate

## ⚠️ Important Notes

### Before Upload
- ✅ Make sure you've uploaded a reference file first
- ✅ Your DATABASE sheet must have the correct column names
- ✅ Required columns: ID, Scope, Projects, Company, Total MH, (Week / Month)

### During Processing
- ⏳ Don't close the page while processing
- 📊 Larger files may take longer
- 🔄 Progress indicator shows when processing

### After Processing
- 📥 Download immediately (link expires after session)
- ✅ Verify filled cells match your expectations
- 💾 Save the file locally

## 🔧 Troubleshooting

### "Could not load reference sheets"
**Solution**: Upload a complete Excel file with Info and Hourly Rates sheets first

### Empty cells still empty
**Possible causes**:
- Column names don't match expected names
- Lookup values not found in reference sheets
- Wrong sheet name (must be "DATABASE")

**Check**:
- Column names match: "ID", "Scope", "Projects", etc.
- Reference data contains your IDs, Scopes, Projects
- Sheet is named exactly "DATABASE"

### Incorrect values
**Possible causes**:
- Old reference data loaded
- Wrong date format in (Week / Month)
- Lookup values have extra spaces

**Fix**:
- Upload latest reference file
- Use format: dd/mmm/yyyy (e.g., "01/Nov/2025")
- Check for trailing spaces in IDs/Scopes

## 📝 Column Names Required

Make sure your DATABASE sheet has these columns (exact names):
```
ID
Scope
Projects
Company
(Week / Month)
TOTAL MH
Kuzey MH-Person
Currency (can be empty - will be filled)
North/South (can be empty - will be filled)
... and others
```

## 🎯 Example Workflow

1. **Monday Morning**: Upload your latest master file with Info/Hourly Rates
   - This becomes your reference data

2. **During Week**: Receive partial files with empty cells
   - These might have IDs, Scopes, but missing rates/costs

3. **Processing**: Upload partial file via "Fill Empty Cells"
   - System fills all calculated fields automatically

4. **Result**: Download complete file with all cells filled
   - Ready for analysis or further processing

## 💡 Pro Tips

- **Keep reference file updated**: Re-upload when rates change
- **Batch process**: Can process multiple files one after another
- **Check first row**: Verify first few rows look correct before using whole file
- **Save originals**: Keep backup of original files before processing
- **Column flexibility**: System handles variations like "Week / Month" or "(Week /\nMonth)"

## 📞 Need Help?

1. Check [FILL_EMPTY_CELLS.md](FILL_EMPTY_CELLS.md) for detailed documentation
2. Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
3. Run `create_test_file.py` to generate test data
4. Verify your reference sheets have the expected data

## ✅ Success Checklist

Before uploading file with empty cells:
- [ ] Reference file uploaded (with Info sheet)
- [ ] DATABASE sheet exists in your file
- [ ] Column names match expected format
- [ ] At least ID, Scope, Projects columns have data
- [ ] (Week / Month) dates in correct format

After processing:
- [ ] Downloaded filled file
- [ ] Verified sample rows look correct
- [ ] Checked that empty cells are now filled
- [ ] Saved file locally

---

**Quick Access**: Admin Panel → http://localhost:5000/admin.html → "Fill Empty Cells with Formulas" section
