const LS_KEY_API_OVERRIDE = "cafe_sales_api_base_url_override";
const LS_KEY_FETCH_LIMIT = "cafe_sales_fetch_limit";

export function getApiBaseUrl() {
  const override = (localStorage.getItem(LS_KEY_API_OVERRIDE) || "").trim();
  const envUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();

  const picked = override || envUrl || "http://74.208.149.167/api";
  return picked.replace(/\/$/, "");
}

export function getApiBaseUrlOverride() {
  return (localStorage.getItem(LS_KEY_API_OVERRIDE) || "").trim();
}

export function setApiBaseUrlOverride(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) {
    localStorage.removeItem(LS_KEY_API_OVERRIDE);
    return;
  }
  localStorage.setItem(LS_KEY_API_OVERRIDE, trimmed.replace(/\/$/, ""));
}

export function clearApiBaseUrlOverride() {
  localStorage.removeItem(LS_KEY_API_OVERRIDE);
}

export function getFetchLimit() {
  const raw = (localStorage.getItem(LS_KEY_FETCH_LIMIT) || "").trim();
  if (!raw) return "all";
  if (raw === "all") return "all";
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) return n;
  return "all";
}

export function setFetchLimit(value) {
  const v = String(value || "").trim();
  if (!v) {
    localStorage.setItem(LS_KEY_FETCH_LIMIT, "all");
    return;
  }
  if (v === "all") {
    localStorage.setItem(LS_KEY_FETCH_LIMIT, "all");
    return;
  }
  const n = Number(v);
  if (Number.isFinite(n) && n > 0) {
    localStorage.setItem(LS_KEY_FETCH_LIMIT, String(Math.floor(n)));
    return;
  }
  localStorage.setItem(LS_KEY_FETCH_LIMIT, "all");
}