export default function Settings() {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Settings</h2>
        <div className="muted">Préparation du branchement backend</div>
      </div>

      <div className="settings">
        <label className="label">API Base URL (plus tard)</label>
        <input className="input" value="—" readOnly />
        <div className="muted">
          Ici on mettra VITE_API_BASE_URL quand on branchera le backend.
        </div>

        <div className="divider" />

        <label className="label">UI</label>
        <div className="toggle-row">
          <div className="toggle">
            <div className="dot" />
            <span>Mode clair (mock)</span>
          </div>
          <div className="toggle">
            <div className="dot" />
            <span>Mode sombre (mock)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
