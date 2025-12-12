"""Quick script to check date format in database"""
import json
from app import app, db, DatabaseRecord

with app.app_context():
    # Get first record from database
    record = DatabaseRecord.query.first()
    if record:
        data = json.loads(record.data)
        
        print("=" * 60)
        print("CHECKING DATE FORMAT IN DATABASE")
        print("=" * 60)
        
        if '(Week / Month)' in data:
            date_value = data['(Week / Month)']
            print(f"\n(Week / Month) value: '{date_value}'")
            print(f"Length: {len(date_value)}")
            print(f"Type: {type(date_value)}")
            
            # Check if it has year
            if '/' in date_value:
                parts = date_value.split('/')
                print(f"\nSplit by '/': {parts}")
                print(f"Number of parts: {len(parts)}")
                
                if len(parts) == 3:
                    print(f"✓ Date HAS year: Day={parts[0]}, Month={parts[1]}, Year={parts[2]}")
                elif len(parts) == 2:
                    print(f"✗ Date MISSING year: Day={parts[0]}, Month={parts[1]}")
        else:
            print("\n✗ Column '(Week / Month)' not found!")
            print(f"Available columns: {list(data.keys())[:10]}")
        
        # Show first 5 records
        print("\n" + "=" * 60)
        print("FIRST 5 RECORDS")
        print("=" * 60)
        records = DatabaseRecord.query.limit(5).all()
        for i, rec in enumerate(records, 1):
            rec_data = json.loads(rec.data)
            date_val = rec_data.get('(Week / Month)', 'N/A')
            print(f"{i}. {date_val}")
    else:
        print("No records in database!")
