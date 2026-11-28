import crypto from "crypto";
import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { matchesSearch } from "@/lib/crudHandler";

export interface JsonListConfig {
  table: string;
  column: string;
  resourceName: string;
}

export async function getSingletonRow(table: string) {
  const supabase = getServiceSupabase();
  let { data, error } = await supabase.from(table).select("*").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    const created = await supabase.from(table).insert({}).select().single();
    if (created.error) throw new Error(created.error.message);
    data = created.data;
  }
  return { supabase, row: data };
}

function sortItems(items: any[]) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function getItemLabel(item: any, fallback: string) {
  return item?.title || item?.name || item?.institution || item?.platform || item?.label || fallback;
}

export async function handleJsonPublicList(config: JsonListConfig) {
  try {
    const { row } = await getSingletonRow(config.table);
    const items = Array.isArray(row[config.column]) ? row[config.column] : [];
    const visible = items.filter((item: any) => item?.isVisible !== false && !item?.isArchived);
    return ok(sortItems(visible));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch list", 500);
  }
}

export async function handleJsonAdminList(req: Request, config: JsonListConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const search = new URL(req.url).searchParams.get("search") || "";
    const { row } = await getSingletonRow(config.table);
    const items = Array.isArray(row[config.column]) ? row[config.column] : [];
    const filtered = items
      .filter((item: any) => !item?.isArchived)
      .filter((item: any) => matchesSearch(item, search));
    return ok(sortItems(filtered));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch items", 500);
  }
}

export async function handleJsonAdminCreate(req: Request, config: JsonListConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    if (config.resourceName === "Skill" && !String(body?.name || "").trim()) {
      return fail("Skill name is required", 400);
    }
    const { supabase, row } = await getSingletonRow(config.table);
    const items: any[] = Array.isArray(row[config.column]) ? [...row[config.column]] : [];
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const newItem = {
      ...body,
      _id: id,
      id,
      order: Math.max(0, Math.floor(Number(body.order ?? items.length) || 0)),
      isVisible: body.isVisible ?? true,
      createdAt: now,
      updatedAt: now,
    };
    items.push(newItem);

    const { error } = await supabase
      .from(config.table)
      .update({ [config.column]: items, updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(
      admin,
      "CREATE",
      config.resourceName,
      `Created ${config.resourceName}: ${getItemLabel(newItem, id)}`,
      id
    );
    return ok(newItem, 201);
  } catch (err: any) {
    return fail(err.message || "Create failed", 400);
  }
}

export async function handleJsonAdminGetById(req: Request, id: string, config: JsonListConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { row } = await getSingletonRow(config.table);
    const items: any[] = Array.isArray(row[config.column]) ? row[config.column] : [];
    const found = items.find((item) => item._id === id || item.id === id);
    if (!found) return fail(`${config.resourceName} not found`, 404);
    return ok(found);
  } catch (err: any) {
    return fail(err.message || "Fetch failed", 500);
  }
}

export async function handleJsonAdminUpdateById(req: Request, id: string, config: JsonListConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    if (config.resourceName === "Skill" && !String(body?.name || "").trim()) {
      return fail("Skill name is required", 400);
    }
    const { supabase, row } = await getSingletonRow(config.table);
    const items: any[] = Array.isArray(row[config.column]) ? [...row[config.column]] : [];
    const idx = items.findIndex((item) => item._id === id || item.id === id);
    if (idx === -1) return fail(`${config.resourceName} not found`, 404);

    const now = new Date().toISOString();
    const updated = {
      ...items[idx],
      ...body,
      ...(body.order !== undefined
        ? { order: Math.max(0, Math.floor(Number(body.order) || 0)) }
        : {}),
      _id: items[idx]._id || id,
      id: items[idx].id || id,
      updatedAt: now,
    };
    items[idx] = updated;

    const { error } = await supabase
      .from(config.table)
      .update({ [config.column]: items, updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(
      admin,
      "UPDATE",
      config.resourceName,
      `Updated ${config.resourceName}: ${getItemLabel(updated, id)}`,
      id
    );
    return ok(updated);
  } catch (err: any) {
    return fail(err.message || "Update failed", 400);
  }
}

export async function handleJsonAdminDeleteById(req: Request, id: string, config: JsonListConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { supabase, row } = await getSingletonRow(config.table);
    const items: any[] = Array.isArray(row[config.column]) ? [...row[config.column]] : [];
    const idx = items.findIndex((item) => item._id === id || item.id === id);
    if (idx === -1) return fail(`${config.resourceName} not found`, 404);

    const now = new Date().toISOString();
    const target = items[idx];
    items[idx] = { ...target, isArchived: true, archivedAt: now, updatedAt: now };

    const { error } = await supabase
      .from(config.table)
      .update({ [config.column]: items, updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(
      admin,
      "ARCHIVE",
      config.resourceName,
      `Moved ${config.resourceName} to trash: ${getItemLabel(target, id)}`,
      id
    );
    return ok({ archived: true, id });
  } catch (err: any) {
    return fail(err.message || "Archive failed", 400);
  }
}

export async function handleJsonAdminReorder(req: Request, config: JsonListConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { items: orderItems } = await req.json();
    if (!Array.isArray(orderItems)) return fail("items array is required", 400);

    const { supabase, row } = await getSingletonRow(config.table);
    const existing: any[] = Array.isArray(row[config.column]) ? [...row[config.column]] : [];
    const orderMap = new Map<string, number>();
    orderItems.forEach((entry: { id?: string; _id?: string; order?: number }, idx: number) => {
      const targetId = entry.id || entry._id;
      if (targetId) orderMap.set(targetId, Math.max(0, Math.floor(Number(entry.order ?? idx) || 0)));
    });

    const now = new Date().toISOString();
    const updated = existing.map((item) => {
      const key = item._id || item.id;
      return orderMap.has(key) ? { ...item, order: orderMap.get(key), updatedAt: now } : item;
    });

    const { error } = await supabase
      .from(config.table)
      .update({ [config.column]: sortItems(updated), updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(
      admin,
      "REORDER",
      config.resourceName,
      `Reordered ${orderItems.length} ${config.resourceName} items`
    );
    return ok({ reordered: true });
  } catch (err: any) {
    return fail(err.message || "Reorder failed", 400);
  }
}

export async function handleJsonAdminToggleVisibility(req: Request, id: string, config: JsonListConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { supabase, row } = await getSingletonRow(config.table);
    const items: any[] = Array.isArray(row[config.column]) ? [...row[config.column]] : [];
    const idx = items.findIndex((item) => item._id === id || item.id === id);
    if (idx === -1) return fail(`${config.resourceName} not found`, 404);

    const now = new Date().toISOString();
    const nextVisible = !(items[idx].isVisible ?? true);
    items[idx] = { ...items[idx], isVisible: nextVisible, updatedAt: now };

    const { error } = await supabase
      .from(config.table)
      .update({ [config.column]: items, updated_at: now })
      .eq("id", row.id);
    if (error) return fail(error.message, 400);

    await logAdminActivity(
      admin,
      "UPDATE",
      config.resourceName,
      `Toggled visibility for ${config.resourceName} (${nextVisible ? "visible" : "hidden"})`,
      id
    );
    return ok(items[idx]);
  } catch (err: any) {
    return fail(err.message || "Visibility update failed", 400);
  }
}
