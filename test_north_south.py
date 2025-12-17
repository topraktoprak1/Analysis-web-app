import pandas as pd

# Load the Excel file
df_db = pd.read_excel(r'c:\Users\refik.toprak\Desktop\deneme\uploads\20251210_120712_DATABASE_2025_W46_R0.xlsb', 
                      sheet_name='DATABASE', engine='pyxlsb')
df_info = pd.read_excel(r'c:\Users\refik.toprak\Desktop\deneme\uploads\20251210_120712_DATABASE_2025_W46_R0.xlsb', 
                        sheet_name='Info', engine='pyxlsb')

print('DATABASE North/South column:')
print(f'Index 14: {repr(df_db.columns[14])}')

print('\nInfo sheet lookup columns:')
print(f'Column 13 (Scope): {repr(df_info.columns[13])}')
print(f'Column 16 (North/South): {repr(df_info.columns[16])}')

print('\nTest lookup with scope: USTLUGA - G1-2710RX0 DCR072')
scope_val = 'USTLUGA - G1-2710RX0 DCR072'

# Test exact match
matches = df_info[df_info.iloc[:, 13] == scope_val]
print(f'Exact match found: {len(matches)} matches')

if len(matches) > 0:
    print(f'North/South value: {matches.iloc[0, 16]}')
else:
    # Try to find similar values
    print('\nSearching for similar Scope values in Info sheet:')
    scope_values = df_info.iloc[:, 13].dropna().unique()
    for val in scope_values:
        if 'USTLUGA' in str(val) and 'G1-2710' in str(val):
            print(f'  Found: {val}')
            match = df_info[df_info.iloc[:, 13] == val]
            if len(match) > 0:
                print(f'    North/South: {match.iloc[0, 16]}')
