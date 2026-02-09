import { useMemo, useState } from "react";
import "./App.css";

import SidebarTabs from "./components/SidebarTabs.jsx";
import Banner from "./components/Banner.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Products from "./pages/Products.jsx";
import Trends from "./pages/Trends.jsx";
import Settings from "./pages/Settings.jsx";

export const COLS = [
  "Transaction ID",
  "Item",
  "Quantity",
  "Price Per Unit",
  "Total Spent",
  "Transaction Date",
];

export const DEMO_ROWS = []; 

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "transactions", label: "Transactions" },
  { key: "products", label: "Produits" },
  { key: "trends", label: "Tendances" },
  { key: "settings", label: "Settings" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [limit] = useState(25);

  const [banner, setBanner] = useState({
    type: "info",
    message:
      "Front prêt Backend plus tard (API /etl, /kpis, /transactions). Aucun calcul de 0 ici.",
  });

  const rows = useMemo(() => {
    if (!search) return DEMO_ROWS;
    const s = search.toLowerCase();
    return DEMO_ROWS.filter((r) =>
      COLS.some((c) => String(r?.[c] ?? "").toLowerCase().includes(s))
    );
  }, [search]);

  function onRunETL() {
    setBanner({
      type: "info",
      message:
        "Run ETL (mock). Ici on branchera le backend plus tard, mais l’UI est prête.",
    });
  }

  function onRefresh() {
    setBanner({
      type: "info",
      message:
        "Refresh (mock). Ici on rechargera les données du backend plus tard, mais l’UI est prête.",
    });
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <div className="kicker">ETL + SQLite</div>
          <h1>Cafe Sales Dashboard</h1>
          <p className="subtitle">Déclencher l’ETL et afficher les données persistées.</p>
        </div>

        <div className="actions">
          <button className="btn btn-primary" onClick={onRunETL}>
            Run ETL
          </button>
          <button className="btn btn-ghost" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </header>

      <SidebarTabs tabs={TABS} active={tab} onChange={setTab} />

      <Banner type={banner.type} message={banner.message} />

      {tab === "dashboard" && (
        <Dashboard
          rows={rows}
          limit={limit}
          search={search}
          setSearch={setSearch}
        />
      )}

      {tab === "transactions" && (
        <Transactions rows={rows} search={search} setSearch={setSearch} />
      )}

      {tab === "products" && <Products />}

      {tab === "trends" && <Trends />}

      {tab === "settings" && <Settings />}

      <footer className="footer">
        <span className="muted">UI only — le backend sera connecté après.</span>
      </footer>
    </div>
  );
}
