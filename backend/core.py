import os
import re
import json
import requests
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from dotenv import load_dotenv

# Load API Key from .env file
load_dotenv(dotenv_path=r"D:\\Projects\\HackNUthon6\\.env")
API_KEY = os.getenv("GROQ_API_KEY")

# Initialize encoders and scalers
scaler = StandardScaler()
encoder = OneHotEncoder(handle_unknown="ignore")

# Define numerical, categorical, and boolean features
numerical_features = [
    "TransactionAmount", "AvgTransactionAmount", "AmountDeviationFromAvg",
    "TransactionsLast1Hr", "TransactionsLast24Hr", "TimeSinceLastTransaction",
    "DistanceFromHome", "UserAccountAgeDays"
]

categorical_features = [
    "PaymentMethod", "CardType", "CardIssuer", "CardCountry", "MerchantCategory",
    "MerchantCountry", "DeviceType", "DeviceOS", "Browser"
]

boolean_features = [
    "IsHighRiskMerchant", "IPIsProxy", "IsNewDevice", "IsEmailGeneric", "IsHoliday"
]

# Dummy dataset for fitting encoders
dummy_data = pd.DataFrame([{
    "TransactionAmount": 500, "AvgTransactionAmount": 250, "AmountDeviationFromAvg": 250,
    "TransactionsLast1Hr": 2, "TransactionsLast24Hr": 8, "TimeSinceLastTransaction": 300,
    "DistanceFromHome": 50, "UserAccountAgeDays": 365,
    "PaymentMethod": "CreditCard", "CardType": "Visa", "CardIssuer": "BankA", "CardCountry": "US",
    "MerchantCategory": "Groceries", "MerchantCountry": "US", "DeviceType": "Desktop",
    "DeviceOS": "Windows", "Browser": "Chrome",
    "IsHighRiskMerchant": False, "IPIsProxy": False, "IsNewDevice": True, "IsEmailGeneric": False, "IsHoliday": False
}])

# Fit encoders and scalers on dummy data
scaler.fit(dummy_data[numerical_features])
encoder.fit(dummy_data[categorical_features])


def preprocess_transaction(transaction_data):
    """
    Preprocess transaction data by scaling numerical features, encoding categorical features,
    and combining them into a single array.
    """
    df = pd.DataFrame([transaction_data])

    # Scale numerical features
    df[numerical_features] = scaler.transform(df[numerical_features])

    # Encode categorical features
    encoded_cats = encoder.transform(df[categorical_features]).toarray()

    # Merge processed data
    processed_data = np.hstack([df[numerical_features].values, encoded_cats, df[boolean_features].values])

    return processed_data.tolist()


def extract_risk_score(response_text):
    """
    Extracts the risk score from the API response.
    """
    try:
        risk_score = float(response_text.strip())
        return risk_score * 100  # Convert to percentage
    except ValueError:
        match = re.search(r"risk score of \*\*(\d*\.?\d+)\*\*", response_text)
        return float(match.group(1)) * 100 if match else None


def get_compliance_risk(transaction_data):
    """
    Sends processed transaction data to the Groq API and returns the compliance risk score (0-100%).
    """
    processed_data = preprocess_transaction(transaction_data)

    # API Prompt
    prompt_text = """
    You are an AI system designed to assess financial transaction compliance risk.
    Given transaction details, assign a risk score (0.0 to 1.0) based on these factors...
    """

    json_payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": prompt_text},
            {"role": "user", "content": json.dumps({"features": processed_data})}
        ],
        "temperature": 0.3
    }

    API_URL = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    response = requests.post(API_URL, headers=headers, data=json.dumps(json_payload))

    if response.status_code == 200:
        response_text = response.json()["choices"][0]["message"]["content"]
        risk_score = extract_risk_score(response_text)
        return round(risk_score, 2) if risk_score is not None else None

    return None
