import requests
import json
import time

# Define the API endpoint
API_URL = "http://localhost:8000/api/detect-fraud"

# First, let's check if the server is healthy
health_url = "http://localhost:8000/api/health"
try:
    health_response = requests.get(health_url)
    print(f"Health check status: {health_response.status_code}")
    print(f"Health check response: {health_response.json()}")
except Exception as e:
    print(f"Error connecting to server: {e}")
    exit(1)

# Generate a mock transaction payload
def generate_mock_transaction():
    # This is a simplified version of the transaction data
    # based on the structure in transaction_service.py
    return {
        "transaction_data": {
            "TransactionAmt": 1250.75,
            "ProductCD": "H",
            "card1": 5438,
            "card2": 223,
            "card3": 150,
            "card5": 142,
            "addr1": 315,
            "dist1": 1500,
            "C1": 3,
            "C2": 2,
            "D1": 15,
            "D15": 3,
            "V95": 1.25,
            "V96": -0.75,
            "V97": 0.5,
            "V126": 1.1,
            "V127": -0.3,
            "TransactionDT": int(time.time()),
            "P_emaildomain": "gmail.com"
        },
        "transaction_sequence": [
            [500.25, 5438, 223, 150, 142, 315, 1500, 3, 2, 15, 3],
            [750.50, 5438, 223, 150, 142, 315, 1500, 3, 2, 15, 3],
            [1000.75, 5438, 223, 150, 142, 315, 1500, 3, 2, 15, 3],
            [1200.00, 5438, 223, 150, 142, 315, 1500, 3, 2, 15, 3],
            [900.25, 5438, 223, 150, 142, 315, 1500, 3, 2, 15, 3]
        ],
        "transaction_text": "Large purchase at electronics store",
        "network_data": {
            "nodes": {
                "user_123": {
                    "transaction_count": 25,
                    "total_amount": 15000.50,
                    "risk_score": 0.3,
                    "age": 450,
                    "is_business": 0
                },
                "recipient_456": {
                    "transaction_count": 250,
                    "total_amount": 500000.75,
                    "risk_score": 0.2,
                    "age": 1200,
                    "is_business": 1
                },
                "bank_12": {
                    "transaction_count": 5000,
                    "total_amount": 50000000.00,
                    "risk_score": 0.1,
                    "age": 3650,
                    "is_business": 1
                }
            },
            "edges": [
                {
                    "source": "user_123",
                    "target": "bank_12",
                    "amount": 1250.75,
                    "timestamp": int(time.time()),
                    "frequency": 50,
                    "is_international": 0
                },
                {
                    "source": "bank_12",
                    "target": "recipient_456",
                    "amount": 1250.75,
                    "timestamp": int(time.time()) + 1,
                    "frequency": 75,
                    "is_international": 0
                }
            ]
        },
        "metadata": {
            "user_id": "user_123",
            "device_fingerprint": "device_4567",
            "ip_address": "192.168.1.100",
            "browser": "Chrome",
            "login_time": "2023-11-15T10:30:45",
            "account_age_days": 365
        }
    }

# Send the transaction to the API
try:
    # Generate the transaction payload
    payload = generate_mock_transaction()
    
    # Print the payload for debugging
    print("\nSending transaction payload:")
    print(json.dumps(payload, indent=2)[:500] + "...")
    
    # Send the request
    response = requests.post(API_URL, json=payload)
    
    # Print the response
    print(f"\nResponse status code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\nFraud Detection Results:")
        print(f"Fraud Probability: {result['fraud_probability']:.4f}")
        print(f"Compliance Risk: {result['compliance_risk']:.4f}")
        print(f"Behavior Anomaly: {result['behavior_anomaly']:.4f}")
        print(f"Overall Risk: {result['overall_risk']:.4f}")
        print("\nDetails:")
        print(json.dumps(result['details'], indent=2))
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Error sending request: {e}")

print("\nTest completed.")