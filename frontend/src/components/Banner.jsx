export default function Banner({ type = "info", message, onClose }) {
  if (!message) return null;

  return (
    <div className={`banner ${type}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>{message}</div>
        {onClose ? (
          <button
            className="btn btn-ghost"
            style={{ padding: "6px 10px" }}
            onClick={onClose}
            aria-label="Close banner"
            type="button"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
