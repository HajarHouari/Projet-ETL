from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    item = Column(String)
    quantity = Column(Integer)
    price_per_unit = Column(Float)
    total_spent = Column(Float)
    transaction_date = Column(Date)
