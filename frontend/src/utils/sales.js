import { clamp } from "./format.js";

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeDate(v) {
  if (!v) return "";
  const s = String(v);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

export function normalizeSales(raw = []) {
  if (!Array.isArray(raw)) return [];

  return raw.map((r, idx) => {
    const obj = r || {};
    return {
      id: obj.id ?? idx + 1,
      transaction_id:
        obj.transaction_id ?? obj.transactionId ?? obj["Transaction ID"] ?? "",
      item: obj.item ?? obj["Item"] ?? "",
      quantity: toNumber(obj.quantity ?? obj["Quantity"]),
      price_per_unit: toNumber(obj.price_per_unit ?? obj.pricePerUnit ?? obj["Price Per Unit"]),
      total_spent: toNumber(obj.total_spent ?? obj.totalSpent ?? obj["Total Spent"]),
      transaction_date: normalizeDate(obj.transaction_date ?? obj.transactionDate ?? obj["Transaction Date"]),
    };
  });
}

export function uniqueItems(sales) {
  const set = new Set();
  for (const s of sales) {
    if (s.item) set.add(s.item);
  }
  return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
}

export function applyFilters(sales, filters) {
  const f = filters || {};
  const q = String(f.search || "").trim().toLowerCase();
  const minTotal = f.minTotal !== "" && f.minTotal != null ? Number(f.minTotal) : null;
  const maxTotal = f.maxTotal !== "" && f.maxTotal != null ? Number(f.maxTotal) : null;

  const start = f.startDate ? String(f.startDate) : "";
  const end = f.endDate ? String(f.endDate) : "";

  return sales.filter((s) => {
    if (f.item && s.item !== f.item) return false;

    if (start && s.transaction_date < start) return false;
    if (end && s.transaction_date > end) return false;

    if (minTotal != null && s.total_spent < minTotal) return false;
    if (maxTotal != null && s.total_spent > maxTotal) return false;

    if (q) {
      const hay = `${String(s.transaction_id)} ${String(s.item)} ${String(s.transaction_date)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortSales(sales, sortKey, sortDir) {
  const dir = sortDir === "desc" ? -1 : 1;
  const key = sortKey || "transaction_date";

  const isNumeric = new Set(["id", "quantity", "price_per_unit", "total_spent"]);

  const copy = [...sales];
  copy.sort((a, b) => {
    const va = a[key];
    const vb = b[key];

    if (isNumeric.has(key)) {
      return (Number(va) - Number(vb)) * dir;
    }

    return String(va ?? "").localeCompare(String(vb ?? "")) * dir;
  });

  return copy;
}

export function paginate(rows, pageIndex, pageSize) {
  const size = Math.max(1, Number(pageSize || 20));
  const total = rows.length;
  const maxPage = Math.max(0, Math.ceil(total / size) - 1);
  const page = clamp(Number(pageIndex || 0), 0, maxPage);

  const start = page * size;
  return {
    pageIndex: page,
    pageSize: size,
    total,
    maxPage,
    rows: rows.slice(start, start + size),
  };
}

export function computeKpis(sales) {
  const tx = sales.length;
  const revenue = sales.reduce((acc, s) => acc + (Number(s.total_spent) || 0), 0);
  const qty = sales.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);
  const avgBasket = tx ? revenue / tx : 0;
  const avgPerUnit = qty ? revenue / qty : 0;

  return { tx, revenue, qty, avgBasket, avgPerUnit };
}

export function groupRevenueByDay(sales) {
  const m = new Map();
  for (const s of sales) {
    const k = s.transaction_date || "";
    if (!k) continue;
    m.set(k, (m.get(k) || 0) + (Number(s.total_spent) || 0));
  }
  return Array.from(m.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, revenue]) => ({ date, revenue }));
}

export function groupRevenueByMonth(sales) {
  const m = new Map();
  for (const s of sales) {
    const d = s.transaction_date || "";
    if (d.length < 7) continue;
    const k = d.slice(0, 7); // YYYY-MM
    m.set(k, (m.get(k) || 0) + (Number(s.total_spent) || 0));
  }
  return Array.from(m.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, revenue]) => ({ month, revenue }));
}

export function groupByItem(sales) {
  const m = new Map();
  for (const s of sales) {
    const item = s.item || "—";
    const cur = m.get(item) || { item, tx: 0, qty: 0, revenue: 0 };
    cur.tx += 1;
    cur.qty += Number(s.quantity) || 0;
    cur.revenue += Number(s.total_spent) || 0;
    m.set(item, cur);
  }
  return Array.from(m.values()).sort((a, b) => b.revenue - a.revenue);
}

export function revenueByDayForItem(sales, item) {
  return groupRevenueByDay(sales.filter((s) => s.item === item));
}

export function movingAverage(series, windowSize = 7) {
  const w = Math.max(2, Number(windowSize || 7));
  const out = [];
  for (let i = 0; i < series.length; i++) {
    const start = Math.max(0, i - w + 1);
    const chunk = series.slice(start, i + 1);
    const avg =
      chunk.reduce((acc, x) => acc + (Number(x) || 0), 0) / (chunk.length || 1);
    out.push(avg);
  }
  return out;
}

export function downloadCsv(rows, filename = "sales.csv") {
  if (!rows || rows.length === 0) return;

  const headers = [
    "id",
    "transaction_id",
    "item",
    "quantity",
    "price_per_unit",
    "total_spent",
    "transaction_date",
  ];

  const escape = (v) => {
    const s = String(v ?? "");
    const needsQuotes = s.includes(",") || s.includes('"') || s.includes("\n");
    const cleaned = s.replace(/"/g, '""');
    return needsQuotes ? `"${cleaned}"` : cleaned;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
