# Fill Empty Cells Feature

## Overview
This feature allows you to upload an Excel file with empty cells in the DATABASE sheet, and the system will automatically fill those cells based on predefined Excel formulas using XLOOKUP and other functions.

## How It Works

### Prerequisites
1. **Reference Sheets Required**: Before processing a file with empty cells, you must have previously uploaded a file containing the following sheets:
   - **Info** sheet - Contains lookup data for projects, scopes, personnel, etc.
   - **Hourly Rates** sheet - Contains hourly rate information per personnel
   - **Summary** sheet - Contains summary data for certain calculations (optional)

2. The system will use the most recently uploaded file to load these reference sheets.

### Steps to Use

1. **Go to Admin Panel**
   - Navigate to `/admin.html` in your application
   - You must be logged in as an admin

2. **Upload File with Empty Cells**
   - In the "Fill Empty Cells with Formulas" section, click "Upload File with Empty Cells"
   - Select your Excel file (`.xlsx`, `.xls`, or `.xlsb`)
   - The file must contain a sheet named **DATABASE**

3. **Processing**
   - The system will process your file and fill empty cells based on the formulas
   - A progress indicator will show while processing

4. **Download Result**
   - Once complete, click "Download Filled File" to get your processed file
   - The file will be in `.xlsx` format (even if you uploaded `.xlsb`)

## Formulas Applied

The system applies the following formulas to fill empty cells:

### Basic Fields
1. **North/South** - `=XLOOKUP($G,Info!$N:$N,Info!$Q:$Q)`
   - Looks up Scope in Info sheet to get North/South designation

2. **Currency** - `=IF(A=905264,"TL",XLOOKUP($A,'Hourly Rates'!$A:$A,'Hourly Rates'!$G:$G))`
   - Sets currency based on personnel ID (special case for 905264 = TL)

3. **AP-CB/Subcon** - `=IF(ISNUMBER(SEARCH("AP-CB", E)), "AP-CB", "Subcon")`
   - Checks if Company contains "AP-CB"

4. **LS/Unit Rate** - Based on Scope and Company
   - "Lumpsum" if scope contains "lumpsum" or company is İ4/DEGENKOLB/Kilci Danışmanlık
   - Otherwise "Unit Rate"

### Rate Calculations
5. **Hourly Base Rate** - Conditional XLOOKUP from Hourly Rates sheet
   - Different columns based on AP-CB/Subcon and LS/Unit Rate

6. **Hourly Additional Rate** - Complex calculation with currency conversion
   - Based on LS/Unit Rate, Company, and Currency
   - Includes TCMB exchange rate conversion for TL

7. **Hourly Rate** - `=S + V` (Base Rate + Additional Rate)

8. **Cost** - `=Q * K` (Hourly Rate × Total MH)

### Cost Conversions
9. **General Total Cost (USD)** - Currency conversion to USD
   - Converts from TL or EURO using TCMB rates from Info sheet

10. **Hourly Unit Rate (USD)** - `=X / K` (General Total Cost / Total MH)

### İşveren (Client) Calculations
11. **İşveren Hakediş Birim Fiyat** - Complex nested IF/XLOOKUP
    - Based on NO-1, NO-2 codes from Info sheet
    - Uses Summary sheet for certain codes

12. **İşveren-Hakediş(USD)** - Client progress payment
    - `=IF($L>0,(L*AA),AA*K)`

13. **İşveren Hakediş (USD)** - With currency conversion
    - `=IF($Z="EURO",$AB*XLOOKUP($D,Info!$U:$U,Info!$X:$X),$AB)`

14. **İşveren Hakediş Birim Fiyatı (USD)** - Unit price in USD

### Control Fields
15. **Control-1** - `=XLOOKUP(H,Info!O:O,Info!S:S)`
16. **TM Liste** - `=IFERROR(XLOOKUP(A,Info!BG:BG,Info!BI:BI),"")`
17. **TM KOD** - `=XLOOKUP(H,Info!O:O,Info!R:R)`
18. **NO-1** - `=XLOOKUP($G,Info!$AU:$AU,Info!$AQ:$AQ,0)`
19. **NO-2** - `=XLOOKUP($G,Info!$N:$N,Info!$L:$L)`
20. **NO-3** - `=XLOOKUP($G,Info!$N:$N,Info!$M:$M)`
21. **NO-10** - `=XLOOKUP($AN,Info!$J:$J,Info!$K:$K)`
22. **Kontrol-1** - `=XLOOKUP(H,Info!AV:AV,Info!AQ:AQ)`
23. **Kontrol-2** - `=AN=AO` (Comparison check)

## Column References

The formulas use these Excel column references from the DATABASE sheet:
- **A** = ID (Personnel ID)
- **D** = (Week / Month)
- **E** = Company
- **G** = Scope
- **H** = Projects
- **K** = TOTAL MH
- **L** = Kuzey MH-Person
- **P** = Currency
- **Q** = Hourly Rate
- **R** = Cost
- **S** = Hourly Base Rate
- **V** = Hourly Additional Rate
- **W** = AP-CB/Subcon
- **X** = General Total Cost (USD)
- **Z** = İşveren - Currency
- **AA** = İşveren Hakediş Birim Fiyat
- **AB** = İşveren- Hakediş
- **AC** = İşveren- Hakediş (USD)
- **AN** = NO-1
- **AO** = Kontrol-1
- **AQ** = NO-2
- **AT** = LS/Unit Rate

## Important Notes

1. **Only Empty Cells Are Filled**: The system only fills cells that are empty (NA or blank). Existing values are preserved.

2. **Reference Sheets**: Make sure you have uploaded a complete file with Info, Hourly Rates, and Summary sheets before using this feature.

3. **File Format**: Output is always in `.xlsx` format for compatibility, even if you upload `.xlsb`.

4. **Column Names**: The system handles different variations of column names (e.g., "Week / Month" vs "(Week /\nMonth)").

5. **Error Handling**: If a lookup fails, the system will use default values (0 for numbers, empty string for text).

## Troubleshooting

### Error: "Could not load reference sheets"
- Make sure you have uploaded at least one complete Excel file with Info and Hourly Rates sheets
- The system uses the most recent upload for reference data

### Empty cells not being filled
- Check that the column names in your DATABASE sheet match the expected names
- Verify that the reference data (Info, Hourly Rates) contains the lookup values you're using

### Incorrect values
- Verify that the Scope, Projects, and ID values in your DATABASE sheet exist in the reference sheets
- Check that Week/Month dates match the format in the Info sheet

## Technical Details

- The XLOOKUP function performs exact matches
- String comparisons are normalized (whitespace and case handling)
- Dates should be in dd/mmm/yyyy format (e.g., "01/Nov/2025")
- Numeric lookups are converted to float for comparison
- Boolean fields (like Kontrol-2) are stored as true/false

## API Endpoint

For programmatic access:
```
POST /api/process_empty_cells
Content-Type: multipart/form-data

file: <Excel file with DATABASE sheet>
```

Response:
```json
{
  "success": true,
  "message": "File processed successfully!",
  "rows": 1000,
  "columns": 50,
  "download_url": "/api/download_filled/filled_20251217_120000_yourfile.xlsx"
}
```
