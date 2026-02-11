from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Sale
from app.schema import SaleResponse, SaleCreate
from app.etl.extract import extract_data
from app.etl.transform import transform_data
from app.etl.load import load_data

# On définit le prefixe /sales ici
router = APIRouter(prefix="/sales", tags=["Sales"])

# Dépendance pour la session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/etl")
def run_etl(db: Session = Depends(get_db)):
    """Lance le processus ETL : Extraction, Transformation et Chargement."""
    try:
        df = extract_data()
        df = transform_data(df)
        load_data(df, db)
        return {"status": "ETL executed", "rows_loaded": len(df)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=list[SaleResponse])
def get_sales(
    limit: int = 1000,          # Augmenté pour le dashboard
    offset: int = 0,
    item: str = None,           # Changé 'str | None' en 'str = None' pour compatibilité
    min_total: float = None,    # Idem pour float
    db: Session = Depends(get_db)
):
    """Récupère la liste des ventes avec filtres et pagination."""
    query = db.query(Sale)

    if item:
        query = query.filter(Sale.item == item)

    if min_total:
        query = query.filter(Sale.total_spent >= min_total)

    # L'ordre est important : filter -> offset -> limit
    return query.offset(offset).limit(limit).all()

@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    """Récupère une vente spécifique par son ID."""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.put("/{sale_id}", response_model=SaleResponse)
def update_sale(
    sale_id: int,
    sale_data: SaleCreate,
    db: Session = Depends(get_db)
):
    """Met à jour une vente existante."""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    for key, value in sale_data.dict().items():
        setattr(sale, key, value)

    db.commit()
    db.refresh(sale)
    return sale

@router.delete("/{sale_id}")
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    """Supprime une vente."""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()

    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    db.delete(sale)
    db.commit()
    return {"message": f"Sale {sale_id} deleted"}