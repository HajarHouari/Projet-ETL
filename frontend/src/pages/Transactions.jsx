import Table from "../components/Table.jsx";
import { COLS } from "../App.jsx";

export default function Transactions({ rows, search, setSearch }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Transactions</h2>
        <div className="muted">Filtres + pagination viendront du backend</div>
      </div>

      <div className="row">
        <input
          className="input wide"
          placeholder="Filtrer (item, date, id...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-ghost" onClick={() => {}}>
          Refresh
        </button>
      </div>

      <Table cols={COLS} rows={rows} />
    </section>
  );
}
