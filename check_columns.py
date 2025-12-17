import pyxlsb
import pandas as pd

# Open the Excel file
wb = pyxlsb.open_workbook('uploads/DATABASE_2025_W46_R0.xlsb')

# Read Info sheet
with wb.get_sheet('Info') as sheet:
    rows = list(sheet.rows())
    
    print("=== COLUMN HEADERS ===")
    headers = rows[0]
    for i, cell in enumerate(headers):
        val = cell.v if cell else None
        # Print columns around AU (46), AV (47), AQ (42)
        if i >= 40 and i <= 50:
            print(f"Column {i} (Excel: {chr(65 + i//26 - 1) if i >= 26 else ''}{chr(65 + i % 26)}): {val}")
    
    print("\n=== SAMPLE DATA ===")
    print("Looking for 'GBS-3 Base Scope' in columns AU and AV")
    print("\nFirst 10 data rows:")
    for row_idx in range(1, min(11, len(rows))):
        row = rows[row_idx]
        if len(row) > 47:
            au_val = row[46].v if row[46] else None  # Column AU (index 46)
            av_val = row[47].v if row[47] else None  # Column AV (index 47)
            aq_val = row[42].v if row[42] else None  # Column AQ (index 42)
            
            if au_val == 'GBS-3 Base Scope' or av_val == 'GBS-3 Base Scope':
                print(f"Row {row_idx}: AU={au_val}, AV={av_val}, AQ={aq_val} *** MATCH ***")
            else:
                print(f"Row {row_idx}: AU={au_val}, AV={av_val}, AQ={aq_val}")

print("\n=== SEARCHING FOR EXACT MATCHES ===")
with wb.get_sheet('Info') as sheet:
    rows = list(sheet.rows())
    for row_idx in range(1, len(rows)):
        row = rows[row_idx]
        if len(row) > 47:
            au_val = row[46].v if row[46] else None
            av_val = row[47].v if row[47] else None
            aq_val = row[42].v if row[42] else None
            
            if au_val == 'GBS-3 Base Scope':
                print(f"Found in AU: Row {row_idx}, AQ value = {aq_val}")
            if av_val == 'GBS-3 Base Scope':
                print(f"Found in AV: Row {row_idx}, AQ value = {aq_val}")
