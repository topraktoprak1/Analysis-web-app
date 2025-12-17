"""
Test script to verify the fill_empty_cells_with_formulas function

This script creates a sample DATABASE sheet with some empty cells
and tests the formula calculations.
"""

import pandas as pd
import numpy as np
from datetime import datetime

def create_test_database_sheet():
    """Create a sample DATABASE sheet with some fields filled and others empty"""
    data = {
        'ID': [101, 102, 103, 905264, 105],
        'Name Surname': ['John Doe', 'Jane Smith', 'Bob Johnson', 'Ali Yılmaz', 'Sara Connor'],
        'Discipline': ['Civil', 'Mechanical', 'Electrical', 'Civil', 'Mechanical'],
        '(Week / Month)': ['01/Nov/2025', '01/Nov/2025', '01/Nov/2025', '01/Nov/2025', '01/Nov/2025'],
        'Company': ['AP-CB', 'Subcon Co', 'DEGENKOLB', 'AP-CB / pergel', 'Subcon Co'],
        'Scope': ['Scope-A', 'Scope-B', 'Scope-C', 'Scope-A', 'Scope-B'],
        'Projects': ['Project-X', 'Project-Y', 'Project-Z', 'Project-X', 'Project-Y'],
        'TOTAL MH': [160, 180, 200, 150, 170],
        'Kuzey MH-Person': [0, 0, 0, 0, 100],
        'Status': ['Active', 'Active', 'Active', 'Active', 'Active'],
        'İşveren - Currency': ['USD', 'EUR', 'USD', 'TL', 'USD'],
        
        # These fields should be filled by formulas (set to NaN)
        'North/South': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Currency': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'AP-CB/Subcon': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'LS/Unit Rate': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Hourly Base Rate': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Hourly Additional Rates': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Hourly Rate': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Cost': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'General Total Cost (USD)': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Hourly Unit Rate (USD)': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'NO-1': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'NO-2': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'NO-3': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'NO-10': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'İşveren-Hakediş Birim Fiyat': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'İşveren- Hakediş': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'İşveren- Hakediş (USD)': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'İşveren-Hakediş Birim Fiyat\n(USD)': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Control-1': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'TM Liste': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'TM Kod': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Konrol-1': [np.nan, np.nan, np.nan, np.nan, np.nan],
        'Knrtol-2': [np.nan, np.nan, np.nan, np.nan, np.nan],
    }
    
    return pd.DataFrame(data)

def create_sample_info_sheet():
    """Create a sample Info sheet with lookup data"""
    data = {
        # Columns for various lookups
        # Column J (index 9), K (index 10) for NO-10 lookup
        'Col_J': [312, 313, 314, 315, 316],
        'Col_K': ['Val-J-1', 'Val-J-2', 'Val-J-3', 'Val-J-4', 'Val-J-5'],
        
        # Column L (index 11), M (index 12), N (index 13) for NO-2, NO-3, North/South
        'Col_L': ['NO2-A', 'NO2-B', 'NO2-C', 'NO2-D', 'NO2-E'],
        'Col_M': ['NO3-A', 'NO3-B', 'NO3-C', 'NO3-D', 'NO3-E'],
        'Scope': ['Scope-A', 'Scope-B', 'Scope-C', 'Scope-D', 'Scope-E'],
        
        # Column O (index 14), P (index 15), R (index 17), S (index 18) for Projects lookups
        'Projects': ['Project-X', 'Project-Y', 'Project-Z', 'Project-W', 'Project-V'],
        'Projects_Group': ['Group-1', 'Group-2', 'Group-3', 'Group-4', 'Group-5'],
        'Col_Q': ['North', 'South', 'North', 'South', 'North'],  # North/South (index 16)
        'TM_Kod': ['TM-001', 'TM-002', 'TM-003', 'TM-004', 'TM-005'],  # Index 17
        'Reporting': ['Rep-1', 'Rep-2', 'Rep-3', 'Rep-4', 'Rep-5'],  # Index 18
    }
    
    df = pd.DataFrame(data)
    
    # Add more columns to reach the required indices
    # We need up to column 60 (BI) for TM Liste
    for i in range(19, 61):
        if i == 20:  # Column U - Weeks/Month
            df[f'Col_{chr(65+i)}'] = ['01/Nov/2025', '08/Nov/2025', '15/Nov/2025', '22/Nov/2025', '29/Nov/2025']
        elif i == 22:  # Column W - TCMB USD/TRY
            df[f'Col_{chr(65+i)}'] = [35.0, 35.5, 36.0, 36.5, 37.0]
        elif i == 23:  # Column X - TCMB EUR/USD
            df[f'Col_{chr(65+i)}'] = [1.08, 1.09, 1.10, 1.11, 1.12]
        elif i == 28:  # Column AC - ID.1
            df[f'Col_{chr(65+i)}'] = [101, 102, 103, 104, 105]
        elif i == 33:  # Column AH - Special rates
            df[f'Col_{chr(65+i)}'] = [50.0, 55.0, 60.0, 65.0, 70.0]
        elif i == 42:  # Column AQ - NO values
            df[f'Col_{chr(65+i)}'] = [312, 313, 314, 315, 316]
        elif i == 46:  # Column AU - Scope lookup
            df[f'Col_{chr(65+i)}'] = ['Scope-A', 'Scope-B', 'Scope-C', 'Scope-D', 'Scope-E']
        elif i == 47:  # Column AV - Projects lookup for Kontrol-1
            df[f'Col_{chr(65+i)}'] = ['Project-X', 'Project-Y', 'Project-Z', 'Project-W', 'Project-V']
        elif i == 58:  # Column BG - ID for TM Liste
            df[f'Col_{chr(65+i)}'] = [101, 102, 103, 104, 105]
        elif i == 60:  # Column BI - TM Liste values
            df[f'Col_{chr(65+i)}'] = ['TM-List-1', 'TM-List-2', 'TM-List-3', 'TM-List-4', 'TM-List-5']
        else:
            df[f'Col_{chr(65+i) if i < 26 else "X"}'] = [f'Val{i}-{j}' for j in range(1, 6)]
    
    return df

def create_sample_hourly_rates_sheet():
    """Create a sample Hourly Rates sheet"""
    data = {
        'ID': [101, 102, 103, 104, 105, 905264],
        'Name': ['John Doe', 'Jane Smith', 'Bob Johnson', 'Dave Wilson', 'Sara Connor', 'Ali Yılmaz'],
        'Col_C': ['', '', '', '', '', ''],
        'Col_D': ['', '', '', '', '', ''],
        'Col_E': ['', '', '', '', '', ''],
        'Col_F': ['', '', '', '', '', ''],
        'Currency': ['USD', 'USD', 'USD', 'EUR', 'USD', 'TL'],  # Column G (index 6)
        'Base_Rate_2': [45.0, 50.0, 55.0, 60.0, 48.0, 40.0],  # Column H (index 7)
        'Col_I': ['', '', '', '', '', ''],
        'Base_Rate_3': [40.0, 45.0, 50.0, 55.0, 43.0, 35.0],  # Column J (index 9) - Subcon Unit Rate
        'Col_K': ['', '', '', '', '', ''],
        'Additional_Rate': [5.0, 7.0, 8.0, 10.0, 6.0, 5.0],  # Column L (index 11)
    }
    
    return pd.DataFrame(data)

def create_sample_summary_sheet():
    """Create a sample Summary sheet"""
    data = {
        'Col_A': ['', '', '', '', ''],
        'Col_B': ['', '', '', '', ''],
        'Code': ['999-A', '999-C', '414-C', '360-T', '517-A'],  # Column C (index 2)
    }
    
    df = pd.DataFrame(data)
    
    # Add columns up to AA (index 26)
    for i in range(3, 27):
        if i == 26:  # Column AA
            df[f'Col_{chr(65+i) if i < 26 else "AA"}'] = [100.0, 105.0, 110.0, 115.0, 120.0]
        else:
            df[f'Col_{chr(65+i)}'] = [f'Val{i}-{j}' for j in range(1, 6)]
    
    return df

def save_test_file(filename='test_database_with_empty_cells.xlsx'):
    """Create and save a test Excel file"""
    print("Creating test Excel file...")
    
    df_database = create_test_database_sheet()
    df_info = create_sample_info_sheet()
    df_rates = create_sample_hourly_rates_sheet()
    df_summary = create_sample_summary_sheet()
    
    with pd.ExcelWriter(filename, engine='openpyxl') as writer:
        df_database.to_excel(writer, sheet_name='DATABASE', index=False)
        df_info.to_excel(writer, sheet_name='Info', index=False)
        df_rates.to_excel(writer, sheet_name='Hourly Rates', index=False, startrow=1)
        df_summary.to_excel(writer, sheet_name='Summary', index=False)
    
    print(f"Test file created: {filename}")
    print(f"\nDATABASE sheet: {df_database.shape[0]} rows, {df_database.shape[1]} columns")
    print(f"Info sheet: {df_info.shape[0]} rows, {df_info.shape[1]} columns")
    print(f"Hourly Rates sheet: {df_rates.shape[0]} rows, {df_rates.shape[1]} columns")
    print(f"Summary sheet: {df_summary.shape[0]} rows, {df_summary.shape[1]} columns")
    
    print("\nSample data from DATABASE sheet:")
    print(df_database[['ID', 'Name Surname', 'Company', 'Scope', 'TOTAL MH', 'Currency', 'North/South']].head())
    
    return filename

if __name__ == '__main__':
    # Create test file
    test_file = save_test_file()
    
    print("\n" + "="*60)
    print("Test file created successfully!")
    print("="*60)
    print(f"\nYou can now upload '{test_file}' to test the fill empty cells feature.")
    print("\nSteps:")
    print("1. First upload a complete file with Info and Hourly Rates sheets")
    print("2. Then upload this test file using the 'Fill Empty Cells' feature")
    print("3. Download the result and verify that empty cells are filled")
    print("\nExpected results:")
    print("- North/South should be filled from Info sheet")
    print("- Currency should be filled (ID 905264 should get 'TL')")
    print("- AP-CB/Subcon should show 'AP-CB' for AP-CB companies")
    print("- LS/Unit Rate should show 'Lumpsum' for DEGENKOLB")
    print("- Hourly rates and costs should be calculated")
    print("- All XLOOKUP fields should be populated from reference sheets")
