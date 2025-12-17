import json
import sys
sys.path.insert(0, r'c:\Users\refik.toprak\Desktop\deneme')

from app import app, DatabaseRecord, db

with app.app_context():
    # Get the record for ID 900128
    records = DatabaseRecord.query.filter_by(personel='Gülçe Hazal Ak').all()
    
    if records:
        # Get the latest one
        record = records[-1]
        print(f"Record ID: {record.id}")
        
        data = json.loads(record.data)
        
        print(f"\nInput values:")
        print(f"  TOTAL MH variations:")
        for key in data.keys():
            if 'TOTAL' in key.upper() or 'MH' in key.upper():
                print(f"    '{key}': {data[key]}")
        
        print(f"\nCalculated values:")
        print(f"  Hourly Rate: {data.get('Hourly Rate')}")
        print(f"  Cost: {data.get('Cost')}")
        print(f"  General Total Cost (USD): {data.get('General Total Cost (USD)')}")
        
        # Check what TOTAL MH should be for 16.50 cost with rate 100
        print(f"\nExpected TOTAL MH for 16.50 cost = 16.50 / 100 = 0.165 hours")
    else:
        print("No records found for Gülçe Hazal Ak")
