from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Import the model loading & prediction logic
from ml_model.model import predict_property_price

load_dotenv()

app = FastAPI(title="EstateValue ML Service", description="Predicts real estate prices based on features")

# Basic CORS setup
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PropertyFeatures(BaseModel):
    bedrooms: int
    bathrooms: int
    square_feet: int
    location: str

@app.get("/")
def read_root():
    return {"message": "EstateValue ML Service is running"}

@app.post("/predict")
def predict(features: PropertyFeatures):
    try:
        # In a real app, you would pass the pydantic model to your ML predictor
        predicted_price = predict_property_price(
            features.bedrooms, 
            features.bathrooms, 
            features.square_feet, 
            features.location
        )
        return {"predicted_price": predicted_price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
