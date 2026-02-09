import { useState } from "react";
import { apiTestConnection } from "../services/api.js";
import {
  getApiBaseUrl,
  getApiBaseUrlOverride,
  setApiBaseUrlOverride,
  clearApiBaseUrlOverride,
  getFetchLimit,
  setFetchLimit,
} from "../services/config.js";

export default function Settings({ onSettingsChanged, setBanner }) {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || "").trim() || "(vide)";

  const [override, setOverride] = useState(getApiBaseUrlOverride());
  const [fetchLimit, setFetchLimitState] = useState(String(getFetchLimit()));
  const [testing, setTesting] = useState(false);

  const effective = getApiBaseUrl();

  async function onTest() {
    setTesting(true);
    try {
      const res = await apiTestConnection();
      setBanner({
        type: "success",
        message: `Connexion OK. /sales/ retourne ${res.count} lignes (selon la limite backend actuelle).`,
      });
    } catch (e) {
      setBanner({
        type: "error",
        message: `Test KO: ${e.message}`,
      });
    } finally {
      setTesting(false);
    }
  }

  function onApply() {
    // API override
    if (override.trim()) setApiBaseUrlOverride(override);
    else clearApiBaseUrlOverride();

    // fetch limit
    setFetchLimit(fetchLimit);

    onSettingsChanged?.();

    setBanner({
      type: "success",
      message: `Paramètres appliqués. API = ${getApiBaseUrl()} • Chargement = ${getFetchLimit() === "all" ? "Toutes les ventes" : `${getFetchLimit()} ventes`}`,
    });
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Settings</h2>
        <div className="muted">Connexion API et paramètres de chargement</div>
      </div>

      <div className="settings">
        <div className="label">API Base URL (effective)</div>
        <input className="input" value={effective} readOnly />
        <div className="muted">
          Valeur env (build): <strong>{envUrl}</strong>
        </div>

        <div className="divider" />

        <div className="label">Override API Base URL</div>
        <input
          className="input"
          value={override}
          onChange={(e) => setOverride(e.target.value)}
          placeholder="ex: http://192.168.1.20:8000  (ou /api)"
        />

        <div className="divider" />

        <div className="label">Nombre de ventes à charger</div>
        <select
          className="input"
          value={fetchLimit}
          onChange={(e) => setFetchLimitState(e.target.value)}
        >
          <option value="all">Toutes</option>
          <option value="200">200</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="5000">5000</option>
        </select>
        <div className="muted" style={{ marginTop: 6 }}>
          “Toutes” récupère les ventes via pagination (limit/offset) jusqu’à la fin.
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="button" onClick={onApply}>
            Appliquer
          </button>
          <button className="btn btn-ghost" type="button" onClick={onTest} disabled={testing}>
            {testing ? "Test..." : "Tester la connexion"}
          </button>
        </div>
      </div>
    </section>
  );
}