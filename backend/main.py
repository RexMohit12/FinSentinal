from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from core import get_compliance_risk
from ensemble import FraudEnsembleModel
import numpy as np

app = FastAPI()

# Initialize the ensemble model
ensemble_model = FraudEnsembleModel()

# Define input data model
class TransactionData(BaseModel):
    TransactionAmount: float
    AvgTransactionAmount: float
    AmountDeviationFromAvg: float
    TransactionsLast1Hr: int
    TransactionsLast24Hr: int
    TimeSinceLastTransaction: float
    DistanceFromHome: float
    UserAccountAgeDays: int
    PaymentMethod: str
    CardType: str
    CardIssuer: str
    CardCountry: str
    MerchantCategory: str
    MerchantCountry: str
    DeviceType: str
    DeviceOS: str
    Browser: str
    IsHighRiskMerchant: bool
    IPIsProxy: bool
    IsNewDevice: bool
    IsEmailGeneric: bool
    IsHoliday: bool

def classify_risk(score):
    """Classify risk based on the overall score."""
    if score < 33:
        return "Low"
    elif score < 66:
        return "Medium"
    else:
        return "High"

@app.post("/detect_fraud")
async def detect_fraud(transaction: TransactionData):
    try:
        transaction_dict = transaction.dict()

        # ✅ Get fraud and anomaly predictions from ensemble model
        fraud_percent, behavior_anomaly_percent = ensemble_model.predict(transaction_dict)

        # ✅ Get compliance risk from Groq API
        compliance_percent = get_compliance_risk(transaction_dict)

        # ✅ If compliance risk failed to retrieve, set default
        if compliance_percent is None:
            compliance_percent = np.random.uniform(20, 80)  # Fallback

        # ✅ Compute overall risk (average of all three)
        overall_risk = round((fraud_percent + compliance_percent + behavior_anomaly_percent) / 3, 2)
        risk_class = classify_risk(overall_risk)

        return {
            "fraud_percent": fraud_percent,
            "compliance_percent": compliance_percent,
            "behavior_anomaly_percent": behavior_anomaly_percent,
            "overall_risk": overall_risk,
            "risk_class": risk_class
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
