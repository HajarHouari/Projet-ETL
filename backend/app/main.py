from fastapi import FastAPI
from app.database import Base, engine
from app.routes.data import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cafe Sales ETL API")

app.include_router(router)

app.include_router(router, prefix="/api")