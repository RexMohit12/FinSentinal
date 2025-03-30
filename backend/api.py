from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import os
import sys
import json
import time
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the transaction service
from backend.transaction_service import TransactionService

app = FastAPI(title="Transaction API", 
              description="API for handling automated transaction feeding",
              version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the transaction service
transaction_service = TransactionService()

# Store results in memory (in a real application, this would be a database)
results_store = []

class AutomatedFeedRequest(BaseModel):
    api_source: str
    api_key: Optional[str] = None
    use_real_api: bool = False
    limit: Optional[int] = 5

class TransactionResult(BaseModel):
    fraud_probability: float
    compliance_risk: float
    behavior_anomaly: float
    overall_risk: float
    details: Dict[str, Any]
    timestamp: str
    transaction_amount: float
    transaction_text: str
    api_source: str

@app.post("/api/automated-feed/start")
async def start_automated_feed(request: AutomatedFeedRequest, background_tasks: BackgroundTasks):
    try:
        # Start the automated feed in the background
        background_tasks.add_task(
            process_automated_feed,
            request.api_source,
            request.api_key if request.use_real_api else None,
            request.limit
        )
        
        return {"status": "started", "message": f"Automated feed from {request.api_source} started successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting automated feed: {str(e)}")

@app.get("/api/automated-feed/results")
async def get_automated_feed_results():
    return {"results": results_store}

@app.post("/api/automated-feed/stop")
async def stop_automated_feed():
    # In a real implementation, this would stop the background task
    return {"status": "stopped", "message": "Automated feed stopped successfully"}

@app.get("/api/automated-feed/status")
async def get_automated_feed_status():
    # In a real implementation, this would return the status of the background task
    return {"status": "running" if len(results_store) > 0 else "idle", "count": len(results_store)}

@app.post("/api/generate-mock-transaction")
async def generate_mock_transaction():
    try:
        # Generate a mock transaction
        mock_transaction = transaction_service.generate_mock_transaction()
        
        # Process the transaction
        result = transaction_service.process_transaction(mock_transaction)
        
        # Add the API source to the result
        result["api_source"] = "mock"
        
        # Add the result to the results store
        results_store.append(result)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating mock transaction: {str(e)}")

# Background task to process automated feed
def process_automated_feed(api_source: str, api_key: str = None, limit: int = 5):
    try:
        # Start the automated feed
        feed_results = transaction_service.start_automated_feed(api_source, api_key, limit=limit)
        
        # Add the API source to each result
        for result in feed_results:
            result["api_source"] = api_source
        
        # Add the results to the results store
        results_store.extend(feed_results)
        
        print(f"Automated feed from {api_source} completed successfully")
    except Exception as e:
        print(f"Error in automated feed background task: {e}")

if __name__ == "__main__":
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=8001)