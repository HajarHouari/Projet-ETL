import { useEffect, useMemo, useState } from "react";
import "./App.css";

import SidebarTabs from "./components/SidebarTabs.jsx";
import Banner from "./components/Banner.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Products from "./pages/Products.jsx";
import Trends from "./pages/Trends.jsx";
import Settings from "./pages/Settings.jsx";

import { apiGetSales, apiGetAllSales, apiRunEtl } from "./services/api.js";
import { getApiBaseUrl, getFetchLimit } from "./services/config.js";
import { normalizeSales, applyFilters, uniqueItems } from "./utils/sales.js";
import { fmtNumber } from "./utils/format.js";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "transactions", label: "Transactions" },
  { key: "products", label: "Produits" },
  { key: "trends", label: "Tendances" },
  { key: "settings", label: "Settings" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runningEtl, setRunningEtl] = useState(false);

  const [apiBaseUrlLabel, setApiBaseUrlLabel] = useState(getApiBaseUrl());

  const [filters, setFilters] = useState({
    item: "",
    startDate: "",
    endDate: "",
    minTotal: "",
    maxTotal: "",
    search: "",
  });

  const [banner, setBanner] = useState({
    type: "info",
    message: "Cliquez sur Run ETL pour charger les données et sur refresh pour afficher",
  });

  const items = useMemo(() => uniqueItems(sales), [sales]);

  const filteredSales = useMemo(() => {
    return applyFilters(sales, filters);
  }, [sales, filters]);

  async function loadSales({ silent = false } = {}) {
    setLoading(true);
    try {
      const fetchLimit = getFetchLimit();

      let raw;
      if (fetchLimit === "all") {
        raw = await apiGetAllSales({ pageSize: 1000 });
      } else {
        raw = await apiGetSales({ limit: fetchLimit, offset: 0 });
      }

      const norm = normalizeSales(raw);
      setSales(norm);

      if (!silent) {
        setBanner({
          type: norm.length ? "success" : "info",
          message: norm.length
            ? `Données chargées: ${fmtNumber(norm.length)} ventes`
            : "0 vente retournée. Lance Run ETL puis refresh",
        });
      }
    } catch (e) {
      setBanner({
        type: "error",
        message:
          `Erreur chargement /sales/. Vérifiez: backend ON + API Base URL (${getApiBaseUrl()}). Détail: ${e.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRunETL() {
    setRunningEtl(true);
    setBanner({ type: "info", message: "ETL en cours…" });

    try {
      const res = await apiRunEtl();
      setBanner({
        type: "success",
        message: `ETL OK. rows_loaded: ${res?.rows_loaded ?? "?"}. Refresh des données…`,
      });
      await loadSales({ silent: true });
      setBanner({ type: "success", message: "ETL OK + données rafraîchies." });
    } catch (e) {
      setBanner({ type: "error", message: `ETL KO: ${e.message}` });
    } finally {
      setRunningEtl(false);
    }
  }

  async function onRefresh() {
    await loadSales();
  }

  function onSettingsChanged() {
    setApiBaseUrlLabel(getApiBaseUrl());
    loadSales({ silent: false });
  }

  useEffect(() => {
    loadSales({ silent: true });
  }, []);

  const fetchLabel =
    getFetchLimit() === "all" ? "Toutes" : `${getFetchLimit()}`;

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Cafe Sales Dashboard</h1>
        </div>

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={onRunETL}
            disabled={runningEtl}
            type="button"
          >
            {runningEtl ? "Run ETL…" : "Run ETL"}
          </button>

          <button className="btn btn-ghost" onClick={onRefresh} type="button">
            Refresh
          </button>
        </div>
      </header>

      <SidebarTabs tabs={TABS} active={tab} onChange={setTab} />

      <Banner
        type={banner.type}
        message={banner.message}
        onClose={() => setBanner({ type: "info", message: "" })}
      />

      {tab === "dashboard" && (
        <Dashboard
          sales={sales}
          filteredSales={filteredSales}
          filters={filters}
          setFilters={setFilters}
          items={items}
          loading={loading}
        />
      )}

      {tab === "transactions" && (
        <Transactions
          filteredSales={filteredSales}
          filters={filters}
          setFilters={setFilters}
          items={items}
          loading={loading}
          onRefresh={onRefresh}
        />
      )}

      {tab === "products" && <Products filteredSales={filteredSales} items={items} />}

      {tab === "trends" && <Trends filteredSales={filteredSales} />}

      {tab === "settings" && (
        <Settings onSettingsChanged={onSettingsChanged} setBanner={setBanner} />
      )}

      <footer className="footer">
        <span className="muted">{}</span>
      </footer>
    </div>
  );
}