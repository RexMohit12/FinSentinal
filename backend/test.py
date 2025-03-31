from tensorflow.keras.models import load_model

try:
    autoencoder = load_model("autoencoder_fraud_model.h5", compile=False)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
