import { useRef } from "react";
import Card from "../components/Card.jsx";
import Table from "../components/Table.jsx";
import ChartCard from "../components/ChartCard.jsx";
import SalesFilters from "../components/SalesFilters.jsx";

import { fmtMoney, fmtNumber } from "../utils/format.js";
import {
  computeKpis,
  groupRevenueByDay,
  groupRevenueByMonth,
  groupByItem,
} from "../utils/sales.js";

function euroTick(value) {
  const n = Number(value ?? 0);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)} €`;
}

export default function Dashboard({
  sales,
  filteredSales,
  filters,
  setFilters,
  items,
  loading,
}) {
  const kpisAll = computeKpis(sales);
  const kpisFiltered = computeKpis(filteredSales);

  const daily = groupRevenueByDay(filteredSales);
  const monthly = groupRevenueByMonth(filteredSales);
  const byItem = groupByItem(filteredSales).slice(0, 10);

  const monthWrapRef = useRef(null);
  const dayWrapRef = useRef(null);

  function scrollWrap(ref, dx) {
    if (!ref?.current) return;
    ref.current.scrollBy({ left: dx, behavior: "smooth" });
  }

  const dayChartData = {
    labels: daily.map((d) => d.date),
    datasets: [{ label: "Revenu / jour", data: daily.map((d) => Number(d.revenue.toFixed(2))) }],
  };

  const monthChartData = {
    labels: monthly.map((m) => m.month),
    datasets: [{ label: "Revenu / mois", data: monthly.map((m) => Number(m.revenue.toFixed(2))) }],
  };

  const topItemChartData = {
    labels: byItem.map((x) => x.item),
    datasets: [{ label: "Top 10 items (revenu)", data: byItem.map((x) => Number(x.revenue.toFixed(2))) }],
  };

  const chartOptionsEuroLine = {
    plugins: { legend: { display: true } },
    scales: {
      x: { ticks: { maxTicksLimit: 10 } },
      y: {
        title: { display: true, text: "€" },
        ticks: { callback: euroTick },
      },
    },
  };

  const chartOptionsEuroBar = {
    plugins: { legend: { display: true } },
    scales: {
      y: {
        title: { display: true, text: "€" },
        ticks: { callback: euroTick },
      },
    },
  };

  const colsInvoicesMonth = [
    { key: "month", label: "Mois" },
    { key: "revenue", label: "Revenu (facture)", render: (r) => fmtMoney(r.revenue) },
  ];

  const colsInvoicesDay = [
    { key: "date", label: "Jour" },
    { key: "revenue", label: "Revenu (facture)", render: (r) => fmtMoney(r.revenue) },
  ];

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>Dashboard</h2>
          <div className="muted">
            {loading ? "Chargement…" : `Source: ${fmtNumber(sales.length)} ventes`}
          </div>
        </div>

        <SalesFilters items={items} filters={filters} setFilters={setFilters} />

        <div className="grid">
          <Card
            title="Transactions (filtrées)"
            value={fmtNumber(kpisFiltered.tx)}
            subtext={`Total: ${fmtNumber(kpisAll.tx)}`}
          />
          <Card
            title="Revenu (filtré)"
            value={fmtMoney(kpisFiltered.revenue)}
            subtext={`Total: ${fmtMoney(kpisAll.revenue)}`}
          />
          <Card
            title="Panier moyen (filtré)"
            value={fmtMoney(kpisFiltered.avgBasket)}
            subtext="Revenu / transaction"
          />
          <Card
            title="Quantité totale (filtrée)"
            value={fmtNumber(kpisFiltered.qty)}
            subtext={`Revenu / unité: ${fmtMoney(kpisFiltered.avgPerUnit)}`}
          />
        </div>

        <div className="charts-2">
          <ChartCard
            title="Revenus par jour"
            subtitle="Filtre appliqué"
            type="line"
            data={dayChartData}
            options={chartOptionsEuroLine}
            height={280}
          />
          <ChartCard
            title="Revenus par mois"
            subtitle="Filtre appliqué"
            type="bar"
            data={monthChartData}
            options={chartOptionsEuroBar}
            height={280}
          />
        </div>

        <div className="charts-1">
          <ChartCard
            title="Top items"
            subtitle="Top 10 items par revenu (filtre appliqué)"
            type="bar"
            data={topItemChartData}
            options={chartOptionsEuroBar}
            height={280}
          />
        </div>
      </section>

      <section className="panel" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <h2>Facturés</h2>
          <div className="muted">Sommes des ventes par jour et par mois</div>
        </div>

        <div className="cards-2">
          <div className="invoice-block">
            <div className="invoice-head">
              <div className="muted">Par mois</div>
              <div className="scroll-btns">
                <button className="btn btn-ghost" type="button" onClick={() => scrollWrap(monthWrapRef, -320)}>
                  ←
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => scrollWrap(monthWrapRef, 320)}>
                  →
                </button>
              </div>
            </div>

            <Table
              cols={colsInvoicesMonth}
              rows={monthly.map((m) => ({ month: m.month, revenue: m.revenue }))}
              emptyText="Aucune donnée (essayez Run ETL + Refresh)."
              wrapRef={monthWrapRef}
            />
          </div>

          <div className="invoice-block">
            <div className="invoice-head">
              <div className="muted">Par jour (dernier 30 jours du filtre)</div>
              <div className="scroll-btns">
                <button className="btn btn-ghost" type="button" onClick={() => scrollWrap(dayWrapRef, -320)}>
                  ←
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => scrollWrap(dayWrapRef, 320)}>
                  →
                </button>
              </div>
            </div>

            <Table
              cols={colsInvoicesDay}
              rows={daily.slice(Math.max(0, daily.length - 30))}
              emptyText="Aucune donnée (essayez Run ETL + Refresh)."
              wrapRef={dayWrapRef}
            />
          </div>
        </div>
      </section>
    </>
  );
}