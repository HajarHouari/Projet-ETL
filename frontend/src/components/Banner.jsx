export default function Banner({ type = "info", message }) {
  if (!message) return null;
  return <div className={`banner ${type}`}>{message}</div>;
}
