import pandas as pd
from app.config import CSV_PATH

def extract_data():
    return pd.read_csv(CSV_PATH)
