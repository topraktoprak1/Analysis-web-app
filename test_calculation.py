import sys
sys.path.insert(0, r'c:\Users\refik.toprak\Desktop\deneme')

# Test the calculate_auto_fields function
test_record = {
    'ID': 905166,
    'Name Surname': 'Jean-Baptiste Etienne',
    'Discipline': 'PROJECT MNG',
    '(Week /\nMonth)': 'W46',
    'Company': 'AP-CB',
    'Projects/Group': 'RHI-USTLUGA',
    'Scope': 'USTLUGA - G1-2710RX0 DCR072',
    'Projects': 'USTLUGA - G1-2710RX0 DCR072',
    'Nationality': 'French',
    'Office Location': 'French',
    'TOTAL\n MH': 30,
    'Kuzey MH': 0,
    'Kuzey MH-Person': 0,
    'Status': 'Reported',
    'PP': 'AP-CB/PP-01',
    'Actual Value': 0
}

# Import required modules
import os
os.chdir(r'c:\Users\refik.toprak\Desktop\deneme')

from app import calculate_auto_fields

print("Testing calculate_auto_fields...")
print(f"Input Scope: {test_record['Scope']}")

result = calculate_auto_fields(test_record)

print(f"\nCalculated North/South values:")
for key in result:
    if 'North' in key or 'north' in key:
        print(f"  {repr(key)}: {result[key]}")
