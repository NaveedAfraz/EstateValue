"""
Training script for Bengaluru House Price Prediction Model.
Based on the Kaggle notebook approach: Linear Regression with one-hot encoded locations.
"""

import pandas as pd
import numpy as np
import json
import joblib
import os

# ─── 1. Load Dataset ────────────────────────────────────────────────
print("Loading dataset...")
df = pd.read_csv(os.path.join(os.path.dirname(__file__), "data", "Bengaluru_House_Data.csv"))
print(f"Raw dataset shape: {df.shape}")

# ─── 2. Drop unnecessary columns ────────────────────────────────────
df = df.drop(["area_type", "society", "balcony", "availability"], axis="columns")
print(f"After dropping columns: {df.shape}")

# ─── 3. Handle missing values ───────────────────────────────────────
df = df.dropna()
print(f"After dropping NaN: {df.shape}")

# ─── 4. Feature engineering: Extract BHK from 'size' ────────────────
df["bhk"] = df["size"].apply(lambda x: int(x.split(" ")[0]))

# ─── 5. Convert total_sqft to numeric ───────────────────────────────
def convert_sqft_to_num(x):
    tokens = x.split("-")
    if len(tokens) == 2:
        return (float(tokens[0]) + float(tokens[1])) / 2
    try:
        return float(x)
    except:
        return None

df["total_sqft"] = df["total_sqft"].apply(convert_sqft_to_num)
df = df.dropna()
print(f"After sqft conversion: {df.shape}")

# ─── 6. Price per sqft (for outlier removal) ────────────────────────
df["price_per_sqft"] = df["price"] * 100000 / df["total_sqft"]

# ─── 7. Dimensionality reduction on location ────────────────────────
# Group locations with fewer than 10 data points into "other"
location_stats = df.groupby("location")["location"].agg("count")
location_stats_less_than_10 = location_stats[location_stats <= 10]
df["location"] = df["location"].apply(
    lambda x: "other" if x in location_stats_less_than_10 else x
)
print(f"Unique locations after grouping: {df['location'].nunique()}")

# ─── 8. Outlier removal: price_per_sqft ─────────────────────────────
def remove_pps_outliers(df):
    df_out = pd.DataFrame()
    for key, subdf in df.groupby("location"):
        m = np.mean(subdf.price_per_sqft)
        st = np.std(subdf.price_per_sqft)
        reduced_df = subdf[(subdf.price_per_sqft > (m - st)) & (subdf.price_per_sqft <= (m + st))]
        df_out = pd.concat([df_out, reduced_df], ignore_index=True)
    return df_out

df = remove_pps_outliers(df)
print(f"After PPS outlier removal: {df.shape}")

# ─── 9. Outlier removal: sqft per bedroom ───────────────────────────
df = df[~(df.total_sqft / df.bhk < 300)]
print(f"After sqft/bhk outlier removal: {df.shape}")

# ─── 10. Outlier removal: bathrooms ─────────────────────────────────
df = df[df.bath < df.bhk + 2]
print(f"After bath outlier removal: {df.shape}")

# ─── 11. Prepare final features ─────────────────────────────────────
df = df.drop(["size", "price_per_sqft"], axis="columns")

# One-hot encode location
dummies = pd.get_dummies(df.location)
df = pd.concat([df, dummies.drop("other", axis="columns")], axis="columns")
df = df.drop("location", axis="columns")

print(f"Final dataset shape: {df.shape}")

# ─── 12. Split and Train ────────────────────────────────────────────
X = df.drop("price", axis="columns")
y = df["price"]

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=10)

model = LinearRegression()
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"\nModel R2 Score: {score:.4f}")

# ─── 13. Save model and columns ─────────────────────────────────────
model_dir = os.path.join(os.path.dirname(__file__), "ml_model")
os.makedirs(model_dir, exist_ok=True)

joblib.dump(model, os.path.join(model_dir, "model.joblib"))
print(f"Model saved to ml_model/model.joblib")

columns_data = {"data_columns": [col.lower() for col in X.columns]}
with open(os.path.join(model_dir, "columns.json"), "w") as f:
    json.dump(columns_data, f, indent=2)
print(f"Columns saved to ml_model/columns.json ({len(X.columns)} features)")

# ─── 14. Quick test predictions ─────────────────────────────────────
def predict_price(location, sqft, bath, bhk):
    cols = X.columns
    loc_index = -1
    try:
        loc_index = np.where(cols == location)[0][0]
    except:
        pass

    x = np.zeros(len(cols))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return model.predict([x])[0]

print("\n[Sample Predictions]")
print(f"1st Phase JP Nagar, 1000sqft, 2bath, 2bhk: Rs.{predict_price('1st Phase JP Nagar', 1000, 2, 2):.2f} Lakhs")
print(f"Indira Nagar, 1000sqft, 2bath, 2bhk:       Rs.{predict_price('Indira Nagar', 1000, 2, 2):.2f} Lakhs")
print(f"Hebbal, 1500sqft, 3bath, 3bhk:             Rs.{predict_price('Hebbal', 1500, 3, 3):.2f} Lakhs")
print("\nTraining complete!")
