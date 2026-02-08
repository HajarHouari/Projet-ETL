from sqlalchemy.orm import Session
from app.models import Sale

def load_data(df, db: Session):
    db.query(Sale).delete()

    for _, row in df.iterrows():
        sale = Sale(
            transaction_id=row["transaction_id"],
            item=row["item"],
            quantity=row["quantity"],
            price_per_unit=row["price_per_unit"],
            total_spent=row["total_spent"],
            transaction_date=row["transaction_date"]
        )
        db.add(sale)

    db.commit()
