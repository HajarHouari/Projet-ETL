FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 1. Créer le dossier qui contiendra le CSV source
# Ce dossier ne doit PAS être le même que celui du volume (mountPath)
RUN mkdir -p /app/raw_data

# 2. Copier le dataset dans ce nouveau dossier protégé
COPY data/dataset_cafe.csv /app/raw_data/dataset_cafe.csv

# 3. Copier le reste de l'application
COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]