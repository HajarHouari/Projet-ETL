import { getApiBaseUrl } from "./config.js";

async function request(path, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });
  } catch (e) {
    const err = new Error(`Connexion impossible vers ${url}`);
    err.cause = e;
    err.status = 0;
    throw err;
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err = new Error(
      `API error ${res.status} on ${path}${data?.detail ? `: ${data.detail}` : ""}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

function qsFromParams(paramsObj = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(paramsObj)) {
    if (v === undefined || v === null || v === "") continue;
    p.set(k, String(v));
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export async function apiGetSales({ limit, offset } = {}) {
  const qs = qsFromParams({ limit, offset });
  return request(`/sales/${qs}`, { method: "GET" });
}

export async function apiGetAllSales({ pageSize = 1000, maxPages = 200 } = {}) {
  const all = [];
  const seenIds = new Set();

  let offset = 0;
  let previousFirstId = null;

  for (let page = 0; page < maxPages; page++) {
    const chunk = await apiGetSales({ limit: pageSize, offset });

    if (!Array.isArray(chunk)) {
      throw new Error("Réponse inattendue: /sales/ ne renvoie pas une liste.");
    }
    if (chunk.length === 0) break;

    const firstId = chunk[0]?.id ?? null;

    if (page > 0 && firstId != null && firstId === previousFirstId) {
      break;
    }
    previousFirstId = firstId;

    for (const r of chunk) {
      const id = r?.id ?? JSON.stringify(r);
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      all.push(r);
    }

    if (chunk.length < pageSize) break;
    offset += pageSize;
  }

  return all;
}

export async function apiRunEtl() {
  try {
    return await request("/sales/etl", { method: "POST" });
  } catch (e) {
    if (e.status === 404) {
      return request("/sales/etl/", { method: "POST" });
    }
    throw e;
  }
}

export async function apiTestConnection() {
  const data = await apiGetSales();
  if (!Array.isArray(data)) {
    throw new Error("Réponse inattendue: /sales/ ne renvoie pas une liste.");
  }
  return { ok: true, count: data.length };
}