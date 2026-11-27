// Maps Postgres snake_case rows <-> camelCase objects expected by frontend & admin UI

type Row = Record<string, any>;

function toCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toSnakeKey(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function rowToCamel<T = Row>(row: Row | null | undefined): T | null {
  if (!row) return null;
  const out: Row = {};
  for (const [key, value] of Object.entries(row)) {
    const camel = toCamelKey(key);
    out[camel] = value;
  }
  if (row.id !== undefined) {
    out._id = row.id;
    out.id = row.id;
  }
  return out as T;
}

export function rowsToCamel<T = Row>(rows: Row[] | null | undefined): T[] {
  if (!rows) return [];
  return rows.map((r) => rowToCamel<T>(r)!);
}

export function camelToRow(
  payload: Row,
  allowedCamelKeys?: string[]
): Row {
  const out: Row = {};
  const skip = new Set(["_id", "id", "createdAt", "updatedAt", "created_at", "updated_at"]);
  for (const [key, value] of Object.entries(payload || {})) {
    if (skip.has(key)) continue;
    if (allowedCamelKeys && !allowedCamelKeys.includes(key)) continue;
    const snake = toSnakeKey(key);
    if (value === "" && (snake.endsWith("_date") || snake.endsWith("_at") || snake === "home_order")) {
      out[snake] = null;
    } else if (snake === "home_order") {
      out[snake] = value === null || value === undefined ? null : Math.max(0, Math.floor(Number(value) || 0));
    } else if (snake === "order") {
      out[snake] = value === "" || value === null || value === undefined ? 0 : Math.max(0, Math.floor(Number(value) || 0));
    } else {
      out[snake] = value;
    }
  }
  return out;
}

export function slugify(text: string): string {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `item-${Date.now()}`;
}
