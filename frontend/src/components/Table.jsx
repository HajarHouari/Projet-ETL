export default function Table({ cols, rows }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {!rows || rows.length === 0 ? (
            <tr>
              <td className="empty" colSpan={cols.length}>
                Aucune donnée pour le moment (front prêt, backend à brancher).
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={`row-${i}`}>
                {cols.map((c) => (
                  <td key={c}>{String(r?.[c] ?? "")}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
