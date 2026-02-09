export default function MiniCard({ title, text }) {
  return (
    <div className="card mini">
      <div className="card-title">{title}</div>
      <div className="mini-text">{text}</div>
    </div>
  );
}
