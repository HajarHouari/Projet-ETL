import Card from "../components/Card.jsx";
import Table from "../components/Table.jsx";
import { COLS } from "../App.jsx";

export default function Dashboard({ rows, limit, search, setSearch }) {
  const filteredCountLabel = `${rows.length} lignes (filtrées)`;

  return (
    <>
      <section className="grid">
        <Card title="Transactions" value="—" />
        <Card title="Revenu" value="—" />
        <Card title="Panier moyen" value="—" />

        <div className="card">
          <div className="card-title">Recherche</div>
          <input
            className="input"
            placeholder="ex: latte, espresso, 2025-01..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="muted">{filteredCountLabel}</div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Transactions</h2>
          <div className="muted">Affichage: {limit} premières lignes</div>
        </div>

        <Table cols={COLS} rows={rows.slice(0, limit)} />
      </section>
    </>
  );
}
