import { useMemo, useState } from "react";
import Table from "../components/Table.jsx";
import SalesFilters from "../components/SalesFilters.jsx";

import { fmtMoney, fmtNumber } from "../utils/format.js";
import { sortSales, paginate, downloadCsv } from "../utils/sales.js";

export default function Transactions({
  filteredSales,
  filters,
  setFilters,
  items,
  loading,
  onRefresh,
}) {
  const [pageSize, setPageSize] = useState(25);
  const [pageIndex, setPageIndex] = useState(0);

  const [sortKey, setSortKey] = useState("transaction_date");
  const [sortDir, setSortDir] = useState("desc");

  const cols = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "transaction_id", label: "Transaction ID" },
      { key: "item", label: "Item" },
      { key: "quantity", label: "Qty" },
      { key: "price_per_unit", label: "Price", render: (r) => fmtMoney(r.price_per_unit) },
      { key: "total_spent", label: "Total", render: (r) => fmtMoney(r.total_spent) },
      { key: "transaction_date", label: "Date" },
    ],
    []
  );

  const sorted = useMemo(
    () => sortSales(filteredSales, sortKey, sortDir),
    [filteredSales, sortKey, sortDir]
  );

  const page = useMemo(
    () => paginate(sorted, pageIndex, pageSize),
    [sorted, pageIndex, pageSize]
  );

  function onSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPageIndex(0);
  }

  const countLabel = `${fmtNumber(sorted.length)} lignes (après filtres)`;

  const canPrev = page.pageIndex > 0;
  const canNext = page.pageIndex < page.maxPage;

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Transactions</h2>
        <div className="muted">
          {loading ? "Chargement…" : countLabel}
        </div>
      </div>

      <SalesFilters items={items} filters={filters} setFilters={setFilters} />

      <div className="row">
        <div className="muted" style={{ alignSelf: "center" }}>
          Page size
        </div>

        <select
          className="input"
          style={{ maxWidth: 140 }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPageIndex(0);
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => downloadCsv(sorted, "sales_filtered.csv")}
          disabled={sorted.length === 0}
        >
          Export CSV (filtré)
        </button>

        <button className="btn btn-ghost" type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="muted" style={{ alignSelf: "center" }}>
          Page {page.pageIndex + 1} / {page.maxPage + 1}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
          >
            Prev
          </button>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => setPageIndex((p) => Math.min(page.maxPage, p + 1))}
            disabled={!canNext}
          >
            Next
          </button>
        </div>
      </div>

      <Table
        cols={cols}
        rows={page.rows}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
        emptyText="Aucune transaction. Lancez l’ETL puis refresh."
      />
    </section>
  );
}
