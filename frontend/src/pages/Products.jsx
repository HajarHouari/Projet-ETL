import MiniCard from "../components/MiniCard.jsx";

export default function Products() {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Produits</h2>
        <div className="muted">Analyse produit (à brancher côté backend)</div>
      </div>

      <div className="cards-2">
        <MiniCard
          title="Top items"
          text="À brancher: top ventes (quantité / CA) par item."
        />
        <MiniCard
          title="Inventaire"
          text="À brancher: alertes de rupture, produits lents, coûts."
        />
      </div>

      <div className="placeholder">
        <div className="ph-title">Zone d’analyse produits</div>
        <div className="ph-text">
          Exemples: Top 10 items, contribution au CA, prix moyen, panier par produit…
        </div>
      </div>
    </section>
  );
}
