from sqlalchemy.orm import Session
from app.models import Sale

def load_data(df, db: Session):
    # 1. On vide la table proprement
    db.query(Sale).delete()

    # 2. On transforme le DataFrame en liste de dictionnaires
    # C'est beaucoup plus rapide que d'itérer sur les lignes
    data_to_insert = df.to_dict(orient="records")

    # 3. On utilise bulk_insert_mappings
    # Cela génère une seule grosse transaction SQL
    db.bulk_insert_mappings(Sale, data_to_insert)

    # 4. On valide
    db.commit()