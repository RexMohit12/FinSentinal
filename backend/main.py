from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import os
import sys
import json
import numpy as np

# Add the agents directory to the path
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'agents'))

# Import the FraudDetectionAgent
from core import FraudDetectionAgent

app = FastAPI(title="Financial Fraud Detection API", 
              description="API for detecting fraud in financial transactions",
              version="1.0.0")

# Initialize the fraud detection agent
agent = FraudDetectionAgent()

class TransactionRequest(BaseModel):
    transaction_data: Dict[str, Any]
    transaction_sequence: Optional[List[List[float]]] = None
    transaction_text: Optional[str] = None
    network_data: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class TransactionResponse(BaseModel):
    fraud_probability: float
    compliance_risk: float
    behavior_anomaly: float
    overall_risk: float
    details: Dict[str, Any]

@app.post("/api/detect-fraud", response_model=TransactionResponse)
async def detect_fraud(request: TransactionRequest):
    try:
        # Prepare input for the agent
        agent_input = {
            "transaction_data": request.transaction_data
        }
        
        # Add optional fields if they exist
        if request.transaction_sequence:
            agent_input["transaction_sequence"] = request.transaction_sequence
        
        if request.transaction_text:
            agent_input["transaction_text"] = request.transaction_text
            
        if request.network_data:
            agent_input["network_data"] = request.network_data
        
        # Get predictions from the agent
        results = agent.predict(agent_input)
        
        # Extract individual risk scores
        fraud_probability = results.get('fraud', 0.0)
        
        # For compliance, we need to extract the risk from the FinBERT output
        # FinBERT typically returns probabilities for different classes
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
            "details": results
        }
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing transaction: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "models_loaded": all([
        agent.xgb_model is not None,
        agent.autoencoder is not None,
        agent.finbert is not None,
        agent.behavioral_model is not None
    ])}

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Log the request
    body = await request.body()
    if body:
        try:
            # Truncate large requests for logging
            body_str = body.decode('utf-8')
            if len(body_str) > 1000:
                body_str = body_str[:1000] + "... [truncated]"
            print(f"Request: {body_str}")
        except:
            pass
    
    # Process the request
    response = await call_next(request)
    
    return response

if __name__ == "__main__":
    # Create models directory if it doesn't exist
    os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models'), exist_ok=True)
    
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=8000)