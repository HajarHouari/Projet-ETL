export default function Table({
  cols,
  rows,
  sortKey,
  sortDir,
  onSort,
  emptyText = "Aucune donnée.",
  rowKey,
  wrapRef,
}) {
  const safeCols =
    (cols || []).map((c) =>
      typeof c === "string" ? { key: c, label: c } : c
    ) || [];

  const indicator = (key) => {
    if (!sortKey || sortKey !== key) return "";
    return sortDir === "desc" ? " ↓" : " ↑";
  };

  return (
    <div className="table-wrap" ref={wrapRef}>
      <table className="table">
        <thead>
          <tr>
            {safeCols.map((c) => (
              <th
                key={c.key}
                onClick={() =>
                  onSort && c.sortable !== false ? onSort(c.key) : null
                }
                style={{
                  cursor:
                    onSort && c.sortable !== false ? "pointer" : "default",
                }}
                title={
                  onSort && c.sortable !== false ? "Cliquer pour trier" : ""
                }
              >
                {c.label}
                {onSort && c.sortable !== false ? indicator(c.key) : ""}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!rows || rows.length === 0 ? (
            <tr>
              <td className="empty" colSpan={safeCols.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={rowKey ? rowKey(r, i) : `row-${r?.id ?? i}`}>
                {safeCols.map((c) => (
                  <td key={`${c.key}-${i}`}>
                    {c.render ? c.render(r) : String(r?.[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}