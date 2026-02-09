export function fmtNumber(x, locale = "fr-FR") {
  const n = Number(x ?? 0);
  return n.toLocaleString(locale);
}

export function fmtMoney(x, locale = "fr-FR", currency = "EUR") {
  const n = Number(x ?? 0);
  return n.toLocaleString(locale, { style: "currency", currency });
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}