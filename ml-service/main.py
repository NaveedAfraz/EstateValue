from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from ml_model.model import predictor

app = FastAPI(title="EstateValue ML Service")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PropertyFeatures(BaseModel):
    location: str
    square_feet: float = Field(..., alias="square_feet")
    bedrooms: int
    bathrooms: int
    actual_price: Optional[float] = None # In Lakhs

class PredictionResponse(BaseModel):
    predicted_price: float
    status: str
    message: str
    location_found: bool

@app.get("/")
def home():
    return {"message": "EstateValue ML Prediction Service is running."}

@app.post("/predict", response_model=PredictionResponse)
def predict(features: PropertyFeatures):
    print(f"\n🧠 [ML REQUEST RECEIVED]")
    print(f"Features: {features.dict()}")
    
    if predictor.model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Try again later.")

    # Get prediction
    predicted_val, location_found = predictor.predict(
        features.location,
        features.square_feet,
        features.bathrooms,
        features.bedrooms
    )

    if predicted_val is None:
        raise HTTPException(status_code=500, detail="Prediction failed.")

    # Determine status
    status = predictor.get_price_status(predicted_val, features.actual_price)
    
    # Message formatting
    msg = f"The estimated value is approx. ₹{predicted_val:.2f} Lakhs."
    if not location_found:
        msg = f"Location '{features.location}' not found in our Bengaluru database."
    elif features.actual_price:
        if status == "overpriced":
            msg += " This property seems overpriced compared to market trends."
        elif status == "underpriced":
            msg += " This property is a great deal! It's priced below market value."
        else:
            msg += " The price is fair compared to similar properties."

    return {
        "predicted_price": round(predicted_val, 2),
        "status": status,
        "message": msg,
        "location_found": location_found
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
