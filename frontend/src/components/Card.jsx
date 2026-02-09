export default function Card({ title, value, subtext }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      {subtext ? <div className="muted">{subtext}</div> : null}
    </div>
  );
}
