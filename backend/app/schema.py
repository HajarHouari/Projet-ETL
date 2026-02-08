from pydantic import BaseModel
from datetime import date

class SaleBase(BaseModel):
    transaction_id: str
    item: str
    quantity: int
    price_per_unit: float
    total_spent: float
    transaction_date: date

class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int

    class Config:
        from_attributes = True
