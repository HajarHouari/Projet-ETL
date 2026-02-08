import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_PATH = os.getenv("DATA_PATH")

if DATA_PATH is None:
    DATA_PATH = os.path.join(BASE_DIR, "data")

CSV_PATH = os.path.join(DATA_PATH, "dataset_cafe.csv")
DB_PATH = os.getenv("SQLITE_PATH", os.path.join(DATA_PATH, "app.db"))

DATABASE_URL = f"sqlite:///{DB_PATH}"
