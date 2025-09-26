#!/usr/bin/env python3
"""
Script to generate 50 dummy quotations with London postcodes for the map view.
"""

import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any
import sqlite3
import os

# London postcodes with approximate coordinates
LONDON_POSTCODES = [
    {"postcode": "E1 6AN", "lat": 51.5118, "lng": -0.0755, "area": "Whitechapel"},
    {"postcode": "E2 8HD", "lat": 51.5309, "lng": -0.0553, "area": "Bethnal Green"},
    {"postcode": "E3 4DY", "lat": 51.5254, "lng": -0.0209, "area": "Bow"},
    {"postcode": "E14 5AB", "lat": 51.5074, "lng": -0.0118, "area": "Canary Wharf"},
    {"postcode": "E17 9JN", "lat": 51.5816, "lng": -0.0287, "area": "Walthamstow"},
    {"postcode": "N1 9AG", "lat": 51.5454, "lng": -0.1059, "area": "Islington"},
    {"postcode": "N4 3HF", "lat": 51.5707, "lng": -0.1127, "area": "Finsbury Park"},
    {"postcode": "N7 6PA", "lat": 51.5519, "lng": -0.1165, "area": "Holloway"},
    {"postcode": "N16 8JH", "lat": 51.5622, "lng": -0.0751, "area": "Stoke Newington"},
    {"postcode": "N22 6BG", "lat": 51.5988, "lng": -0.1037, "area": "Wood Green"},
    {"postcode": "NW1 8NH", "lat": 51.5290, "lng": -0.1255, "area": "Camden"},
    {"postcode": "NW3 6SS", "lat": 51.5581, "lng": -0.1759, "area": "Hampstead"},
    {"postcode": "NW5 1TL", "lat": 51.5519, "lng": -0.1406, "area": "Kentish Town"},
    {"postcode": "NW8 7NE", "lat": 51.5341, "lng": -0.1692, "area": "St John's Wood"},
    {"postcode": "NW10 2XE", "lat": 51.5341, "lng": -0.2349, "area": "Willesden"},
    {"postcode": "W1F 9DU", "lat": 51.5154, "lng": -0.1410, "area": "Fitzrovia"},
    {"postcode": "W2 1NY", "lat": 51.5154, "lng": -0.1755, "area": "Paddington"},
    {"postcode": "W4 5YA", "lat": 51.4946, "lng": -0.2529, "area": "Chiswick"},
    {"postcode": "W6 9SH", "lat": 51.4827, "lng": -0.2291, "area": "Hammersmith"},
    {"postcode": "W11 1NN", "lat": 51.5154, "lng": -0.2085, "area": "Notting Hill"},
    {"postcode": "SW1A 1AA", "lat": 51.4994, "lng": -0.1270, "area": "Westminster"},
    {"postcode": "SW3 6NP", "lat": 51.4925, "lng": -0.1687, "area": "Chelsea"},
    {"postcode": "SW7 2AZ", "lat": 51.4946, "lng": -0.1678, "area": "South Kensington"},
    {"postcode": "SW11 1HT", "lat": 51.4613, "lng": -0.1707, "area": "Battersea"},
    {"postcode": "SW15 2RS", "lat": 51.4613, "lng": -0.2085, "area": "Putney"},
    {"postcode": "SE1 9RT", "lat": 51.5074, "lng": -0.0877, "area": "Southwark"},
    {"postcode": "SE5 8TR", "lat": 51.4741, "lng": -0.0929, "area": "Camberwell"},
    {"postcode": "SE10 9NN", "lat": 51.4934, "lng": 0.0098, "area": "Greenwich"},
    {"postcode": "SE15 4QL", "lat": 51.4741, "lng": -0.0648, "area": "Peckham"},
    {"postcode": "SE22 8EF", "lat": 51.4613, "lng": -0.0648, "area": "East Dulwich"},
    {"postcode": "EC1A 4HD", "lat": 51.5154, "lng": -0.0929, "area": "City of London"},
    {"postcode": "EC2A 3LT", "lat": 51.5238, "lng": -0.0856, "area": "Shoreditch"},
    {"postcode": "EC3N 4AB", "lat": 51.5118, "lng": -0.0856, "area": "Bank"},
    {"postcode": "EC4Y 8EN", "lat": 51.5118, "lng": -0.1037, "area": "Fleet Street"},
    {"postcode": "WC1E 6BT", "lat": 51.5238, "lng": -0.1255, "area": "Bloomsbury"},
    {"postcode": "WC2E 9RZ", "lat": 51.5118, "lng": -0.1255, "area": "Covent Garden"},
    {"postcode": "CR0 2YR", "lat": 51.3762, "lng": -0.0982, "area": "Croydon"},
    {"postcode": "BR1 3XX", "lat": 51.4063, "lng": 0.0140, "area": "Bromley"},
    {"postcode": "DA1 1RT", "lat": 51.4467, "lng": 0.2188, "area": "Dartford"},
    {"postcode": "HA1 2LT", "lat": 51.5948, "lng": -0.3370, "area": "Harrow"},
    {"postcode": "IG1 1NB", "lat": 51.5590, "lng": 0.0729, "area": "Ilford"},
    {"postcode": "KT1 1EU", "lat": 51.4118, "lng": -0.3031, "area": "Kingston upon Thames"},
    {"postcode": "RM1 3BD", "lat": 51.5590, "lng": 0.1821, "area": "Romford"},
    {"postcode": "SM1 4RP", "lat": 51.3762, "lng": -0.1982, "area": "Sutton"},
    {"postcode": "TW1 3QS", "lat": 51.4467, "lng": -0.3370, "area": "Twickenham"},
    {"postcode": "UB1 1FG", "lat": 51.5341, "lng": -0.4776, "area": "Southall"},
    {"postcode": "EN1 3UZ", "lat": 51.6523, "lng": -0.0831, "area": "Enfield"},
    {"postcode": "WD6 3BX", "lat": 51.6240, "lng": -0.2349, "area": "Borehamwood"},
    {"postcode": "AL1 1RN", "lat": 51.7520, "lng": -0.3370, "area": "St Albans"},
    {"postcode": "SL1 1XY", "lat": 51.5095, "lng": -0.5906, "area": "Slough"}
]

# Company names for variety
COMPANY_NAMES = [
    "Thames Valley Construction Ltd",
    "London Power Solutions",
    "Metropolitan Electrical Services",
    "Capital City Developments",
    "Royal Borough Properties",
    "East London Enterprises",
    "West End Commercial Ltd",
    "South London Builders",
    "North Thames Contractors",
    "City Centre Developments",
    "Greenwich Power Networks",
    "Camden Electrical Works",
    "Islington Property Group",
    "Hackney Development Co",
    "Tower Hamlets Construction",
    "Westminster Commercial Ltd",
    "Kensington Properties",
    "Chelsea Development Group",
    "Battersea Power Solutions",
    "Canary Wharf Enterprises"
]

# Service descriptions
SERVICE_DESCRIPTIONS = [
    "New electrical connection for residential development",
    "Commercial building power upgrade",
    "Industrial electrical installation",
    "Temporary construction supply",
    "Underground cable installation",
    "Substation connection works",
    "Three-phase supply installation",
    "Electrical meter upgrade",
    "Distribution network connection",
    "High voltage cable works",
    "Street lighting installation",
    "Emergency power supply setup",
    "Solar panel grid connection",
    "EV charging point installation",
    "Data centre power supply"
]

# Status options
STATUSES = ["draft", "submitted", "approved", "rejected", "under_review", "accepted"]

def generate_service_order_id():
    """Generate a unique service order quotation ID"""
    return f"{random.randint(10000000, 99999999)}/{random.randint(1000000, 9999999)}"

def generate_dummy_quotations(count: int = 50) -> List[Dict[str, Any]]:
    """Generate dummy quotations with London postcodes"""
    quotations = []
    
    for i in range(count):
        # Select random postcode
        location = random.choice(LONDON_POSTCODES)
        company = random.choice(COMPANY_NAMES)
        service = random.choice(SERVICE_DESCRIPTIONS)
        
        # Generate dates
        created_date = datetime.now() - timedelta(days=random.randint(1, 90))
        valid_from = created_date + timedelta(days=random.randint(0, 5))
        valid_to = valid_from + timedelta(days=random.randint(30, 180))
        
        quotation = {
            "service_order_quotation_id": generate_service_order_id(),
            "description": f"{service} - {location['area']}",
            "customer_name": company,
            "customer_email": f"contact@{company.lower().replace(' ', '').replace('ltd', '').replace('.', '')}.co.uk",
            "customer_phone": f"020 {random.randint(7000, 8999)} {random.randint(1000, 9999)}",
            "sold_to_party": f"{company} {location['postcode']}",
            "site_address": f"{random.randint(1, 999)} {random.choice(['High Street', 'Church Lane', 'Victoria Road', 'King Street', 'Queen Avenue', 'Park Road', 'Mill Lane', 'Station Road'])}, {location['area']}, London {location['postcode']}",
            "external_reference": f"REF{random.randint(100000, 999999)}",
            "status": random.choice(STATUSES),
            "template_type": random.choice(["standard", "ukpn", "industrial"]),
            "total_amount": round(random.uniform(5000, 50000), 2),
            "quotation_valid_from": valid_from.isoformat(),
            "quotation_valid_to": valid_to.isoformat(),
            "location_data": {
                "lat": location["lat"] + random.uniform(-0.01, 0.01),  # Add small random offset
                "lng": location["lng"] + random.uniform(-0.01, 0.01),
                "postcode": location["postcode"],
                "area": location["area"],
                "address": f"{random.randint(1, 999)} {random.choice(['High Street', 'Church Lane', 'Victoria Road'])}, {location['area']}, London {location['postcode']}"
            },
            "created_by": 1,  # Assuming admin user ID is 1
            "created_at": created_date.isoformat(),
            "updated_at": created_date.isoformat()
        }
        
        quotations.append(quotation)
    
    return quotations

def insert_quotations_to_db(quotations: List[Dict[str, Any]]):
    """Insert quotations into the SQLite database"""
    db_path = os.path.join(os.path.dirname(__file__), "clickquote.db")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        for quotation in quotations:
            # Convert location_data to JSON string
            location_json = json.dumps(quotation["location_data"])
            
            cursor.execute("""
                INSERT INTO quotations (
                    service_order_quotation_id, description, customer_name, 
                    customer_email, customer_phone, sold_to_party, site_address,
                    external_reference, status, template_type, total_amount,
                    quotation_valid_from, quotation_valid_to, location_data,
                    created_by, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                quotation["service_order_quotation_id"],
                quotation["description"],
                quotation["customer_name"],
                quotation["customer_email"],
                quotation["customer_phone"],
                quotation["sold_to_party"],
                quotation["site_address"],
                quotation["external_reference"],
                quotation["status"],
                quotation["template_type"],
                quotation["total_amount"],
                quotation["quotation_valid_from"],
                quotation["quotation_valid_to"],
                location_json,
                quotation["created_by"],
                quotation["created_at"],
                quotation["updated_at"]
            ))
        
        conn.commit()
        print(f"Successfully inserted {len(quotations)} quotations into the database.")
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()

def main():
    """Main function to generate and insert dummy data"""
    print("Generating 50 dummy quotations with London postcodes...")
    
    # Generate quotations
    quotations = generate_dummy_quotations(50)
    
    # Save to JSON file for reference
    with open("dummy_quotations.json", "w") as f:
        json.dump(quotations, f, indent=2)
    print("Saved quotations to dummy_quotations.json")
    
    # Insert into database
    insert_quotations_to_db(quotations)
    
    print("Done! The quotations should now appear on the map view.")

if __name__ == "__main__":
    main()