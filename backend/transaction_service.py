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
        Generate a mock transaction for testing purposes
        """
        # Generate random transaction amount between $10 and $10000
        amount = round(random.uniform(10, 10000), 2)
        
        # Generate random card IDs
        card1 = random.randint(1000, 9999)
        card2 = random.randint(100, 999)
        card3 = random.randint(100, 999)
        card5 = random.randint(100, 999)
        
        # Generate random address and distance
        addr1 = random.randint(100, 999)
        dist1 = random.randint(0, 5000)
        
        # Generate other random values
        C1 = random.randint(0, 9)
        C2 = random.randint(0, 4)
        D1 = random.randint(0, 29)
        D15 = random.randint(0, 4)
        
        # Generate random V values
        V95 = round(random.uniform(-2, 2), 2)
        V96 = round(random.uniform(-2, 2), 2)
        V97 = round(random.uniform(-2, 2), 2)
        V126 = round(random.uniform(-2, 2), 2)
        V127 = round(random.uniform(-2, 2), 2)
        
        # Generate transaction timestamp
        TransactionDT = int(time.time())
        
        # Generate email domain
        email_domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru', 'protonmail.com']
        P_emaildomain = random.choice(email_domains)
        
        # Generate product code
        product_codes = ['H', 'C', 'S', 'R', 'W']
        ProductCD = random.choice(product_codes)
        
        # Generate transaction sequence (previous transactions)
        transaction_sequence = []
        for _ in range(5):
            seq_amount = round(random.uniform(50, 2000), 2)
            transaction_sequence.append([seq_amount, card1, card2, card3, card5, addr1, dist1, C1, C2, D1, D15])
        
        # Generate transaction description
        descriptions = [
            "Purchase at online retailer",
            "Subscription payment",
            "Wire transfer to business account",
            "International payment",
            "ATM withdrawal",
            "Mobile payment to peer",
            "Bill payment",
            "Recurring payment to service provider",
            "International wire transfer",
            "Large purchase at electronics store"
        ]
        transaction_text = random.choice(descriptions)
        
        # Generate network data
        user_id = f'user_{random.randint(0, 999)}'
        recipient_id = f'recipient_{random.randint(0, 999)}'
        bank_id = f'bank_{random.randint(0, 99)}'
        
        network_data = {
            "nodes": {
                user_id: {
                    "transaction_count": random.randint(1, 50),
                    "total_amount": round(random.uniform(0, 50000), 2),
                    "risk_score": round(random.uniform(0, 0.9), 2),
                    "age": random.randint(1, 1000),
                    "is_business": 1 if random.random() > 0.7 else 0
                },
                recipient_id: {
                    "transaction_count": random.randint(1, 500),
                    "total_amount": round(random.uniform(0, 1000000), 2),
                    "risk_score": round(random.uniform(0, 0.9), 2),
                    "age": random.randint(30, 3650),
                    "is_business": 1 if random.random() > 0.3 else 0
                },
                bank_id: {
                    "transaction_count": random.randint(1000, 10000),
                    "total_amount": round(random.uniform(0, 100000000), 2),
                    "risk_score": round(random.uniform(0, 0.5), 2),
                    "age": random.randint(365, 10000),
                    "is_business": 1
                }
            },
            "edges": [
                {
                    "source": user_id,
                    "target": bank_id,
                    "amount": amount,
                    "timestamp": TransactionDT,
                    "frequency": random.randint(1, 100),
                    "is_international": 1 if random.random() > 0.7 else 0
                },
                {
                    "source": bank_id,
                    "target": recipient_id,
                    "amount": amount,
                    "timestamp": TransactionDT + 1,
                    "frequency": random.randint(1, 100),
                    "is_international": 1 if random.random() > 0.7 else 0
                }
            ]
        }
        
        # Generate metadata
        metadata = {
            "user_id": user_id,
            "device_fingerprint": f'device_{random.randint(0, 9999)}',
            "ip_address": f'{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}',
            "browser": random.choice(['Chrome', 'Firefox', 'Safari', 'Edge']),
            "login_time": datetime.now().isoformat(),
            "account_age_days": random.randint(1, 1000)
        }
        
        return {
            "transaction_data": {
                "TransactionAmt": amount,
                "ProductCD": ProductCD,
                "card1": card1,
                "card2": card2,
                "card3": card3,
                "card5": card5,
                "addr1": addr1,
                "dist1": dist1,
                "C1": C1,
                "C2": C2,
                "D1": D1,
                "D15": D15,
                "V95": V95,
                "V96": V96,
                "V97": V97,
                "V126": V126,
                "V127": V127,
                "TransactionDT": TransactionDT,
                "P_emaildomain": P_emaildomain
            },
            "transaction_sequence": transaction_sequence,
            "transaction_text": transaction_text,
            "network_data": network_data,
            "metadata": metadata
        }
    
    def get_plaid_transactions(self, access_token: str, start_date: str, end_date: str) -> List[Dict[str, Any]]:
        """
        Get transactions from Plaid API
        """
        try:
            # In a real implementation, this would make an actual API call to Plaid
            # For demo purposes, we'll generate mock transactions
            transactions = []
            for _ in range(5):  # Generate 5 transactions
                mock_transaction = self.generate_mock_transaction()
                transactions.append(mock_transaction)
            return transactions
        except Exception as e:
            print(f"Error fetching Plaid transactions: {e}")
            return []
    
    def get_stripe_transactions(self, api_key: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Get transactions from Stripe API
        """
        try:
            # In a real implementation, this would make an actual API call to Stripe
            # For demo purposes, we'll generate mock transactions
            transactions = []
            for _ in range(limit):  # Generate specified number of transactions
                mock_transaction = self.generate_mock_transaction()
                transactions.append(mock_transaction)
            return transactions
        except Exception as e:
            print(f"Error fetching Stripe transactions: {e}")
            return []
    
    def process_transaction(self, transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a transaction through the fraud detection agent
        """
        try:
            # Get predictions from the agent
            results = self.agent.predict(transaction_data)
            
            # Extract individual risk scores
            fraud_probability = results.get('fraud', 0.0)
            
            # For compliance, extract the risk from the FinBERT output
            compliance_scores = results.get('compliance', [0.5, 0.5])
            compliance_risk = compliance_scores[1] if len(compliance_scores) > 1 else 0.5
            
            # Behavior anomaly score
            behavior_anomaly = results.get('behavior', 0.0)
            
            # Network risk score
            network_risk = results.get('network', 0.0)
            
            # Calculate overall risk (weighted average)
            weights = {
                'fraud': 0.4,
                'compliance': 0.2,
                'behavior': 0.2,
                'network': 0.2
            }
            
            overall_risk = (
                weights['fraud'] * fraud_probability +
                weights['compliance'] * compliance_risk +
                weights['behavior'] * behavior_anomaly +
                weights['network'] * network_risk
            )
            
            # Prepare response
            response = {
                "fraud_probability": fraud_probability,
                "compliance_risk": compliance_risk,
                "behavior_anomaly": behavior_anomaly,
                "overall_risk": overall_risk,
                "details": results,
                "timestamp": datetime.now().isoformat(),
                "transaction_amount": transaction_data.get("transaction_data", {}).get("TransactionAmt", 0),
                "transaction_text": transaction_data.get("transaction_text", "")
            }
            
            return response
        except Exception as e:
            print(f"Error processing transaction: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def start_automated_feed(self, api_source: str, api_key: str = None, interval: int = 12, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Start an automated feed of transactions from the specified API source
        
        Args:
            api_source: The API source to fetch transactions from ('plaid' or 'stripe')
            api_key: The API key to use for authentication (if None, uses mock data)
            interval: The interval in hours between transaction fetches
            limit: The maximum number of transactions to fetch
            
        Returns:
            A list of processed transaction results
        """
        print(f"Starting automated transaction feed from {api_source} API")
        
        try:
            # Initialize results list
            results = []
            
            # Get current time
            current_time = datetime.now()
            
            # Calculate start and end dates for Plaid API
            end_date = current_time.strftime("%Y-%m-%d")
            start_date = (current_time - timedelta(hours=interval)).strftime("%Y-%m-%d")
            
            # Fetch transactions based on API source
            transactions = []
            if api_source.lower() == 'plaid':
                # For Plaid, we need an access token
                access_token = api_key if api_key else "mock_access_token"
                transactions = self.get_plaid_transactions(access_token, start_date, end_date)
            elif api_source.lower() == 'stripe':
                # For Stripe, we use the API key directly
                stripe_key = api_key if api_key else self.api_configs['stripe']['api_key']
                transactions = self.get_stripe_transactions(stripe_key, limit)
            else:
                print(f"Unsupported API source: {api_source}")
                return []
            
            # Process each transaction
            for transaction in transactions:
                # Process the transaction through the fraud detection agent
                result = self.process_transaction(transaction)
                results.append(result)
                
                # In a real implementation, we might want to add a delay between processing
                # to avoid overwhelming the system
                time.sleep(0.5)
            
            print(f"Processed {len(results)} transactions from {api_source} API")
            return results
            
        except Exception as e:
            print(f"Error in automated feed: {e}")
            return []