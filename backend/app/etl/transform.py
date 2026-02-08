import pandas as pd

def transform_data(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = [
        "transaction_id",
        "item",
        "quantity",
        "price_per_unit",
        "total_spent",
        "transaction_date"
    ]

    df["item"] = df["item"].str.lower().str.strip()
    df = df[df["item"] != "unknown"]

    df["quantity"] = df["quantity"].astype(int)
    df["price_per_unit"] = df["price_per_unit"].astype(float)
    df["total_spent"] = df["total_spent"].astype(float)

    df["transaction_date"] = pd.to_datetime(df["transaction_date"]).dt.date

    df["total_spent"] = (
        df["quantity"] * df["price_per_unit"]
    ).round(2)

    return df
