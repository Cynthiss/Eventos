// Fecha: 2025-11-04 -> 4 nov 2025 (según locale)
export function formatDate(iso) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-GT", { dateStyle: "medium" })
    .format(new Date(iso));
}

// Moneda en GTQ
export function currency(n = 0) {
  return new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" })
    .format(n);
}

// Title Case simple
export function titleCase(str = "") {
  return str.replace(/\w\S*/g, t => t[0].toUpperCase() + t.slice(1).toLowerCase());
}
