from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Sale
from app.schema import SaleResponse
from app.etl.extract import extract_data
from app.etl.transform import transform_data
from app.etl.load import load_data

router = APIRouter(prefix="/sales", tags=["Sales"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/etl")
def run_etl(db: Session = Depends(get_db)):
    df = extract_data()
    df = transform_data(df)
    load_data(df, db)
    return {"status": "ETL executed", "rows_loaded": len(df)}

@router.get("/", response_model=list[SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    return db.query(Sale).all()

@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    return db.query(Sale).filter(Sale.id == sale_id).first()
