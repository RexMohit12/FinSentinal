import os
import sys
import json
import time
import random
import requests
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the FraudDetectionAgent
from agents.core import FraudDetectionAgent

class TransactionService:
    def __init__(self):
        # Initialize the fraud detection agent
        self.agent = FraudDetectionAgent()
        
        # API configurations
        self.api_configs = {
            'plaid': {
                'base_url': 'https://sandbox.plaid.com',
                'client_id': os.environ.get('PLAID_CLIENT_ID', ''),
                'secret': os.environ.get('PLAID_SECRET', ''),
            },
            'stripe': {
                'base_url': 'https://api.stripe.com/v1',
                'api_key': os.environ.get('STRIPE_API_KEY', ''),
            }
        }
    
    def generate_mock_transaction(self) -> Dict[str, Any]:
        """
        Generate a mock transaction with the new attribute structure
        """
        # User and Transaction IDs
        transaction_id = random.randint(10000000, 99999999)
        user_id = f'USER_{random.randint(100000, 999999)}'
        
        # Transaction Details
        amount = round(random.uniform(10, 10000), 2)
        currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD']
        product_categories = ['Electronics', 'Clothing', 'Food', 'Travel', 'Entertainment']
        payment_methods = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer']
        
        # Card Details
        card_types = ['Visa', 'MasterCard', 'American Express', 'Discover']
        card_issuers = ['Chase', 'Citi', 'Bank of America', 'Wells Fargo']
        card_countries = ['US', 'UK', 'CA', 'DE', 'FR']
        
        # Location Details
        countries = ['US', 'UK', 'CA', 'DE', 'FR', 'JP']
        states = ['CA', 'NY', 'TX', 'FL', 'IL']
        cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
        
        # Device Details
        device_types = ['Mobile', 'Desktop', 'Tablet']
        operating_systems = ['iOS', 'Android', 'Windows', 'macOS', 'Linux']
        browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
        screen_resolutions = ['1920x1080', '1366x768', '2560x1440', '3840x2160']
        
        # Generate transaction datetime within last 30 days
        current_time = datetime.now()
        random_days = random.randint(0, 30)
        random_hours = random.randint(0, 23)
        random_minutes = random.randint(0, 59)
        transaction_datetime = (current_time - timedelta(days=random_days, hours=random_hours, minutes=random_minutes)).isoformat()
        
        # Generate mock transaction data
        transaction = {
            'TransactionID': transaction_id,
            'UserID': user_id,
            'TransactionDateTime': transaction_datetime,
            'TransactionAmount': amount,
            'ProductCategory': random.choice(product_categories),
            'Currency': random.choice(currencies),
            'PaymentMethod': random.choice(payment_methods),
            
            # Card Information
            'CardNumber': f'{random.randint(4000, 4999)} **** **** {random.randint(1000, 9999)}',
            'CardType': random.choice(card_types),
            'CardIssuer': random.choice(card_issuers),
            'CardCountry': random.choice(card_countries),
            'CardCVV': random.randint(100, 999),
            'CardExpiry': f'{random.randint(1, 12):02d}/{random.randint(24, 28)}',
            
            # Billing Information
            'BillingAddress': f'{random.randint(100, 9999)} Main St',
            'BillingZIP': random.randint(10000, 99999),
            'BillingCity': random.choice(cities),
            'BillingState': random.choice(states),
            'BillingCountry': random.choice(countries),
            
            # IP and Location
            'IPAddress': f'{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}',
            'IPCountry': random.choice(countries),
            'DistanceFromHome': round(random.uniform(0, 5000), 2),
            
            # Device Information
            'DeviceType': random.choice(device_types),
            'DeviceOS': random.choice(operating_systems),
            'Browser': random.choice(browsers),
            'ScreenResolution': random.choice(screen_resolutions),
            
            # Transaction History
            'TransactionsLast1Hr': random.randint(0, 5),
            'TransactionsLast24Hr': random.randint(0, 20),
            'AvgTransactionAmount': round(random.uniform(50, 500), 2),
            'TimeSinceLastTransaction': round(random.uniform(0, 24), 2),
            'UserAccountAgeDays': random.randint(1, 3650),
            
            # Merchant Information
            'MerchantID': random.randint(1000, 9999),
            'MerchantCategory': random.choice(['Retail', 'Travel', 'Food', 'Services']),
            'MerchantCountry': random.choice(countries),
            'IsHighRiskMerchant': random.choice([True, False]),
            
            # Risk Indicators
            'IsFraud': random.randint(0, 1),
            'IPIsProxy': random.choice([True, False]),
            'IsNewDevice': random.choice([True, False]),
            'UserEmail': f'user_{random.randint(100, 999)}@{random.choice(["gmail.com", "yahoo.com", "hotmail.com"])}',
            'IsEmailGeneric': random.choice([True, False]),
            'AmountDeviationFromAvg': round(random.uniform(-200, 200), 2),
            'IsHoliday': random.choice([True, False])
        }
        
        return transaction