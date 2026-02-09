import { useMemo, useState } from "react";
import MiniCard from "../components/MiniCard.jsx";
import ChartCard from "../components/ChartCard.jsx";

import { groupRevenueByDay, movingAverage } from "../utils/sales.js";

function euroTick(value) {
  const n = Number(value ?? 0);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)} €`;
}

export default function Trends({ filteredSales }) {
  const [windowSize, setWindowSize] = useState(7);

  const daily = useMemo(() => groupRevenueByDay(filteredSales), [filteredSales]);
  const revenues = daily.map((d) => d.revenue);
  const ma = useMemo(() => movingAverage(revenues, windowSize), [revenues, windowSize]);

  const chartData = {
    labels: daily.map((d) => d.date),
    datasets: [
      { label: "Revenu journalier", data: daily.map((d) => Number(d.revenue.toFixed(2))) },
      { label: `Moyenne mobile (${windowSize}j)`, data: ma.map((x) => Number(x.toFixed(2))) },
    ],
  };

  const options = {
    plugins: { legend: { display: true } },
    scales: {
      x: { ticks: { maxTicksLimit: 10 } },
      y: {
        title: { display: true, text: "€" },
        ticks: { callback: euroTick },
      },
    },
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Tendances</h2>
        <div className="muted">Lecture de la série temporelle</div>
      </div>

      <div className="cards-2">
        <MiniCard
          title="Revenu journalier"
          text="Courbe principale : revenu total par jour (selon les filtres)."
        />
        <MiniCard
          title="Moyenne mobile"
          text="Ligne de tendance : lissage sur N jours pour mieux lire l’évolution."
        />
      </div>

      <div className="row" style={{ marginTop: 14, alignItems: "flex-end" }}>
        <div style={{ minWidth: 240 }}>
          <div className="label">Fenêtre de moyenne mobile</div>
          <select
            className="input"
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
          >
            <option value={3}>3 jours</option>
            <option value={7}>7 jours</option>
            <option value={14}>14 jours</option>
            <option value={30}>30 jours</option>
          </select>
        </div>
      </div>

      <div className="charts-1" style={{ marginTop: 14 }}>
        <ChartCard
          title="Revenu journalier et moyenne mobile"
          subtitle="Même unité, deux lectures : brut vs lissé"
          type="line"
          data={chartData}
          options={options}
          height={300}
        />
      </div>
    </section>
  );
}