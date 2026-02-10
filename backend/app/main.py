from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes.data import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cafe Sales ETL API")

# AJOUT DU MIDDLEWARE CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AJOUT DU PRÉFIXE /api POUR CORRESPONDRE À L'INGRESS
app.include_router(router, prefix="/api")