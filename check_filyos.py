import pandas as pd

# Load the Excel file
df_info = pd.read_excel(r'c:\Users\refik.toprak\Desktop\deneme\uploads\20251210_120712_DATABASE_2025_W46_R0.xlsb', 
                        sheet_name='Info', engine='pyxlsb')

print("Searching for FILYOS in Info sheet...\n")

# Search in Scope column (column 13 - index 13)
print("=== Column N (Scope) - Index 13 ===")
scope_values = df_info.iloc[:, 13].dropna().unique()
filyos_scopes = [v for v in scope_values if 'FILYOS' in str(v).upper()]
print(f"Found {len(filyos_scopes)} FILYOS-related scopes:")
for i, val in enumerate(filyos_scopes[:10], 1):
    print(f"  {i}. '{val}'")

# Search in Projects column (column 14 - index 14)
print("\n=== Column O (Projects) - Index 14 ===")
project_values = df_info.iloc[:, 14].dropna().unique()
filyos_projects = [v for v in project_values if 'FILYOS' in str(v).upper()]
print(f"Found {len(filyos_projects)} FILYOS-related projects:")
for i, val in enumerate(filyos_projects[:10], 1):
    print(f"  {i}. '{val}'")

# Try exact match
print("\n=== Exact Match Test ===")
search_value = "FILYOS P2- FPU"
exact_scope = df_info[df_info.iloc[:, 13] == search_value]
exact_project = df_info[df_info.iloc[:, 14] == search_value]
print(f"Exact match in Scope column: {len(exact_scope)} rows")
print(f"Exact match in Projects column: {len(exact_project)} rows")

# Try partial match
print("\n=== Partial Match Test ===")
partial_scope = df_info[df_info.iloc[:, 13].astype(str).str.contains('FILYOS P2', case=False, na=False)]
partial_project = df_info[df_info.iloc[:, 14].astype(str).str.contains('FILYOS P2', case=False, na=False)]
print(f"Partial match 'FILYOS P2' in Scope: {len(partial_scope)} rows")
if len(partial_scope) > 0:
    print(f"  Example: '{partial_scope.iloc[0, 13]}'")
print(f"Partial match 'FILYOS P2' in Projects: {len(partial_project)} rows")
if len(partial_project) > 0:
    print(f"  Example: '{partial_project.iloc[0, 14]}'")
