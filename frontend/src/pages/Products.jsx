import { useMemo, useState } from "react";
import ChartCard from "../components/ChartCard.jsx";
import Table from "../components/Table.jsx";

import { fmtMoney, fmtNumber } from "../utils/format.js";
import { groupByItem, revenueByDayForItem } from "../utils/sales.js";

function euroTick(value) {
  const n = Number(value ?? 0);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)} €`;
}

function unitTick(value) {
  const n = Number(value ?? 0);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)}`;
}

export default function Products({ filteredSales, items }) {
  const [topN, setTopN] = useState(10);
  const [focusItem, setFocusItem] = useState(items?.[0] || "");

  const byItem = useMemo(() => groupByItem(filteredSales), [filteredSales]);
  const top = useMemo(() => byItem.slice(0, topN), [byItem, topN]);

  const focusSeries = useMemo(() => {
    if (!focusItem) return [];
    return revenueByDayForItem(filteredSales, focusItem);
  }, [filteredSales, focusItem]);

  const focusChart = {
    labels: focusSeries.map((d) => d.date),
    datasets: [
      {
        label: `Revenu / jour (${focusItem || "—"})`,
        data: focusSeries.map((d) => Number(d.revenue.toFixed(2))),
      },
    ],
  };

  const topRevenueChart = {
    labels: top.map((x) => x.item),
    datasets: [
      {
        label: `Top ${topN} items (revenu)`,
        data: top.map((x) => Number(x.revenue.toFixed(2))),
      },
    ],
  };

  const topQtyChart = {
    labels: top.map((x) => x.item),
    datasets: [
      {
        label: `Top ${topN} items (quantité)`,
        data: top.map((x) => x.qty),
      },
    ],
  };

  const optionsEuroLine = {
    plugins: { legend: { display: true } },
    scales: {
      x: { ticks: { maxTicksLimit: 10 } },
      y: {
        title: { display: true, text: "€" },
        ticks: { callback: euroTick },
      },
    },
  };

  const optionsEuroBar = {
    plugins: { legend: { display: true } },
    scales: {
      y: {
        title: { display: true, text: "€" },
        ticks: { callback: euroTick },
      },
    },
  };

  const optionsUnitsBar = {
    plugins: { legend: { display: true } },
    scales: {
      y: {
        title: { display: true, text: "Unités" },
        ticks: { callback: unitTick },
      },
    },
  };

  const colsSummary = [
    { key: "item", label: "Item" },
    { key: "tx", label: "Transactions", render: (r) => fmtNumber(r.tx) },
    { key: "qty", label: "Quantité", render: (r) => fmtNumber(r.qty) },
    { key: "revenue", label: "Revenu", render: (r) => fmtMoney(r.revenue) },
    { key: "avg", label: "Panier moyen", render: (r) => fmtMoney(r.revenue / (r.tx || 1)) },
  ];

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Produits</h2>
        <div className="muted">Analyse par item : focus + top items</div>
      </div>

      <div className="row" style={{ alignItems: "flex-end" }}>
        <div style={{ minWidth: 260 }}>
          <div className="label">Item à analyser</div>
          <select
            className="input"
            value={focusItem}
            onChange={(e) => setFocusItem(e.target.value)}
          >
            <option value="">Choisir…</option>
            {(items || []).map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: 260 }}>
          <div className="label">Nombre d’items affichés</div>
          <select
            className="input"
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="charts-1" style={{ marginTop: 14 }}>
        <ChartCard
          title="Focus item : revenu par jour"
          subtitle={focusItem ? `Item: ${focusItem}` : "Choisissez un item"}
          type="line"
          data={focusChart}
          options={optionsEuroLine}
          height={300}
        />
      </div>

      <div className="charts-2" style={{ marginTop: 14 }}>
        <ChartCard
          title="Top items : revenu"
          subtitle="Classement par chiffre d’affaires"
          type="bar"
          data={topRevenueChart}
          options={optionsEuroBar}
          height={280}
        />
        <ChartCard
          title="Top items : quantité"
          subtitle="Classement par volume vendu"
          type="bar"
          data={topQtyChart}
          options={optionsUnitsBar}
          height={280}
        />
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="muted" style={{ margin: "8px 0" }}>
          Résumé par item (revenu décroissant)
        </div>
        <Table
          cols={colsSummary}
          rows={byItem.map((x) => ({ ...x, avg: x.revenue / (x.tx || 1) }))}
          emptyText="Aucune donnée."
        />
      </div>
    </section>
  );
}