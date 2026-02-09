export default function SalesFilters({ items, filters, setFilters }) {
  const f = filters || {};

  function patch(p) {
    setFilters({ ...f, ...p });
  }

  return (
    <div className="filters">
      <div className="field">
        <label className="label">Item</label>
        <select
          className="input"
          value={f.item || ""}
          onChange={(e) => patch({ item: e.target.value })}
        >
          <option value="">Tous</option>
          {(items || []).map((it) => (
            <option key={it} value={it}>
              {it}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="label">Date début</label>
        <input
          className="input"
          type="date"
          value={f.startDate || ""}
          onChange={(e) => patch({ startDate: e.target.value })}
        />
      </div>

      <div className="field">
        <label className="label">Date fin</label>
        <input
          className="input"
          type="date"
          value={f.endDate || ""}
          onChange={(e) => patch({ endDate: e.target.value })}
        />
      </div>

      <div className="field">
        <label className="label">Min total (€)</label>
        <input
          className="input"
          type="number"
          step="0.01"
          value={f.minTotal ?? ""}
          onChange={(e) => patch({ minTotal: e.target.value })}
          placeholder="ex: 10"
        />
      </div>

      <div className="field">
        <label className="label">Max total (€)</label>
        <input
          className="input"
          type="number"
          step="0.01"
          value={f.maxTotal ?? ""}
          onChange={(e) => patch({ maxTotal: e.target.value })}
          placeholder="ex: 50"
        />
      </div>

      <div className="field wide">
        <label className="label">Recherche</label>
        <input
          className="input"
          value={f.search || ""}
          onChange={(e) => patch({ search: e.target.value })}
          placeholder="item, date (YYYY-MM), transaction id..."
        />
      </div>

      <div className="field" style={{ alignSelf: "flex-end" }}>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() =>
            setFilters({
              item: "",
              startDate: "",
              endDate: "",
              minTotal: "",
              maxTotal: "",
              search: "",
            })
          }
        >
          Reset filtres
        </button>
      </div>
    </div>
  );
}
