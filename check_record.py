import json
import sys
sys.path.insert(0, r'c:\Users\refik.toprak\Desktop\deneme')

from app import app, DatabaseRecord, db

with app.app_context():
    # Get the latest record
    record = DatabaseRecord.query.order_by(DatabaseRecord.id.desc()).first()
    
    if record:
        print(f"Latest record ID: {record.id}")
        print(f"Personel: {record.personel}")
        
        data = json.loads(record.data)
        
        print(f"\nHourly Additional Rates field:")
        print(f"  Value: {data.get('Hourly Additional Rates')}")
        print(f"  Type: {type(data.get('Hourly Additional Rates'))}")
        print(f"  Is None: {data.get('Hourly Additional Rates') is None}")
        print(f"  Is 0: {data.get('Hourly Additional Rates') == 0}")
        
        print(f"\nOther calculated fields:")
        print(f"  Cost: {data.get('Cost')}")
        print(f"  Hourly Rate: {data.get('Hourly Rate')}")
        print(f"  LS/Unit Rate: {data.get('LS/Unit Rate')}")
        print(f"  Company: {data.get('Company')}")
    else:
        print("No records found")
