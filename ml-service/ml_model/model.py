import os
import json
import joblib
import numpy as np

class PricePredictor:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), "model.joblib")
        self.columns_path = os.path.join(os.path.dirname(__file__), "columns.json")
        self.model = None
        self.columns = None
        self.locations = None
        self.load_model()

    def load_model(self):
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.columns_path):
                self.model = joblib.load(self.model_path)
                with open(self.columns_path, "r") as f:
                    data = json.load(f)
                    self.columns = data["data_columns"]
                    # Locations start from index 3 (sqft, bath, bhk are first)
                    self.locations = self.columns[3:]
                print("Model and columns loaded successfully.")
            else:
                print("Model files not found. Please run training script.")
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict(self, location, sqft, bath, bhk):
        if self.model is None or self.columns is None:
            return None

        loc_index = -1
        try:
            loc_index = self.columns.index(location.lower())
            print(f"✅ Location match found: '{location}' at index {loc_index}")
        except ValueError:
            print(f"⚠️ Location '{location}' NOT found in model. Falling back to default.")
            loc_index = -1

        x = np.zeros(len(self.columns))
        x[0] = sqft
        x[1] = bath
        x[2] = bhk
        if loc_index >= 3:
            x[loc_index] = 1

        # Predict returns price in Lakhs
        prediction = self.model.predict([x])[0]
        return float(prediction), (loc_index >= 3)

    def get_price_status(self, predicted_price, actual_price=None):
        """
        Status logic:
        - If no actual_price provided, defaults to 'fair'
        - If actual_price > 110% of predicted_price -> overpriced
        - If actual_price < 90% of predicted_price -> underpriced
        - Otherwise -> fair
        """
        if actual_price is None:
            return "fair"
        
        # Prices are in Lakhs
        diff = decimal_percent = (actual_price - predicted_price) / predicted_price
        
        if decimal_percent > 0.1:
            return "overpriced"
        elif decimal_percent < -0.1:
            return "underpriced"
        else:
            return "fair"

# Singleton instance
predictor = PricePredictor()
