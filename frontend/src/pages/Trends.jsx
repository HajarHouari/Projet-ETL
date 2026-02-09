import MiniCard from "../components/MiniCard.jsx";

export default function Trends() {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Tendances</h2>
        <div className="muted">Time-series / Forecasting (à brancher)</div>
      </div>

      <div className="cards-2">
        <MiniCard
          title="CA par jour"
          text="À brancher: série temporelle CA quotidien/hebdo."
        />
        <MiniCard
          title="Prévisions"
          text="À brancher: forecasting simple (moyenne mobile / modèle)."
        />
      </div>

      <div className="chart-skeleton">
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>

      <div className="muted" style={{ marginTop: 10 }}>
        Skeleton UI : le graphe réel viendra après.
      </div>
    </section>
  );
}
