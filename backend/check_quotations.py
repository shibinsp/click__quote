import sqlite3
import json

def check_quotations():
    conn = sqlite3.connect('clickquote.db')
    cursor = conn.cursor()
    
    # Get total count
    cursor.execute('SELECT COUNT(*) FROM quotations')
    total_count = cursor.fetchone()[0]
    print(f'Total quotations in database: {total_count}')
    
    # Get quotations with location data
    cursor.execute('SELECT service_order_quotation_id, location_data FROM quotations WHERE location_data IS NOT NULL')
    rows = cursor.fetchall()
    
    valid_locations = 0
    invalid_locations = 0
    
    for row in rows:
        quotation_id, location_data = row
        try:
            data = json.loads(location_data)
            if 'lat' in data and 'lng' in data and data['lat'] is not None and data['lng'] is not None:
                valid_locations += 1
            else:
                invalid_locations += 1
                print(f'Invalid location data for quotation {quotation_id}: {data}')
        except Exception as e:
            invalid_locations += 1
            print(f'Error parsing location data for quotation {quotation_id}: {e}')
    
    print(f'Quotations with valid location data: {valid_locations}')
    print(f'Quotations with invalid location data: {invalid_locations}')
    print(f'Quotations without location data: {total_count - len(rows)}')
    
    # Check for London-specific quotations (our dummy data)
    cursor.execute("SELECT COUNT(*) FROM quotations WHERE customer_name LIKE '%London%' OR site_address LIKE '%London%'")
    london_count = cursor.fetchone()[0]
    print(f'London-related quotations: {london_count}')
    
    conn.close()

if __name__ == "__main__":
    check_quotations()