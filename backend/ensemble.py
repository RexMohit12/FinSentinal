import os
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

class FraudEnsembleModel:
    def __init__(self, model_dir="models"):
        """
        Initialize the ensemble model by loading models and setting up preprocessing.
        """
        self.model_dir = os.path.join(os.path.dirname(__file__), model_dir)

        # ✅ Define model weights
        self.weights = {
            "xgb_fraud_model.pkl": 0.20,
            "catboost_fraud_model.pkl": 0.25,
            "lgbm_fraud_model.pkl": 0.15,
            "isolation_forest_fraud_model.pkl": 0.30,
        }

        self.models = self.load_models()

        # ✅ Define preprocessing columns
        self.CATEGORICAL_COLS = [
            "ProductCategory", "Currency", "PaymentMethod", "CardType",
            "CardIssuer", "CardCountry", "BillingState", "IPCountry",
            "DeviceType", "DeviceOS", "Browser", "MerchantCategory",
            "MerchantCountry", "UserEmail"
        ]

        self.NUMERICAL_COLS = [
            "TransactionAmount", "DistanceFromHome", "TransactionsLast1Hr",
            "TransactionsLast24Hr", "AvgTransactionAmount",
            "TimeSinceLastTransaction", "UserAccountAgeDays",
            "AmountDeviationFromAvg"
        ]

        # ✅ Initialize scaler
        self.scaler = StandardScaler()

    def load_models(self):
        """
        Load the latest trained models from the models directory.
        """
        models = {}
        for model_name in self.weights.keys():
            model_path = os.path.join(self.model_dir, model_name)
            if os.path.exists(model_path):
                models[model_name] = joblib.load(model_path)
            else:
                print(f"⚠️ Warning: Model {model_name} not found. Skipping...")

        return models

    def preprocess_transaction(self, transaction_data):
        """
        Preprocess a single transaction dynamically.
        """
        df = pd.DataFrame([transaction_data])

        # ✅ Handle missing values
        df.fillna(df.median(numeric_only=True), inplace=True)

        # ✅ Encode categorical columns dynamically
        for col in self.CATEGORICAL_COLS:
            if col in df.columns:
                df[col] = df[col].astype(str)  # Ensure string type
                df[col] = LabelEncoder().fit_transform(df[col])  # Fit dynamically

        # ✅ Standardize numerical columns
        df[self.NUMERICAL_COLS] = self.scaler.fit_transform(df[self.NUMERICAL_COLS])

        return df.values[0]  # Convert to numpy array for prediction

    def predict(self, transaction_data):
        """
        Get fraud probability using a weighted stacked ensemble.
        Also, return anomaly score from Isolation Forest.
        """
        if not self.models:
            raise ValueError("❌ No models found! Please check the models directory.")

        # ✅ Preprocess the input transaction
        processed_data = self.preprocess_transaction(transaction_data)

        weighted_sum = 0
        total_weight = sum(self.weights.values())
        anomaly_score = None  # Initialize anomaly score

        for model_name, model in self.models.items():
            try:
                if "isolation_forest" in model_name:
                    anomaly_score = model.decision_function([processed_data])[0]
                    anomaly_score = (1 - anomaly_score) * 100  # Convert to percentage
                elif hasattr(model, "predict_proba"):
                    proba = model.predict_proba([processed_data])[:, 1][0]
                else:
                    proba = model.predict([processed_data])[0]

                weighted_sum += proba * self.weights[model_name]

            except Exception as e:
                print(f"⚠️ Error in model {model_name}: {str(e)}")

        if total_weight == 0:
            raise ValueError("❌ Total weight is zero, invalid ensemble.")

        final_fraud_probability = weighted_sum / total_weight  # Normalize

        return round(final_fraud_probability * 100, 2), round(anomaly_score, 2) if anomaly_score is not None else "N/A"
