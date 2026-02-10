import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Dossier pour le CSV (fixe dans l'image Docker)
RAW_DATA_PATH = os.path.join(BASE_DIR, "raw_data") 
CSV_PATH = os.path.join(RAW_DATA_PATH, "dataset_cafe.csv")

# Dossier pour la DB (monté via le volume Kubernetes)
DATA_PATH = os.getenv("DATA_PATH", os.path.join(BASE_DIR, "data"))
DB_PATH = os.getenv("SQLITE_PATH", os.path.join(DATA_PATH, "app.db"))

DATABASE_URL = f"sqlite:///{DB_PATH}"