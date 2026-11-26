import { NextResponse } from "next/server";
import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { rowToCamel, rowsToCamel, camelToRow, slugify } from "@/lib/mappers";

export interface CrudConfig {
  table: string;
  resourceName: string;
  defaultOrder?: { column: string; ascending: boolean };
  hasSlug?: boolean;
  allowedFields?: string[];
}

export async function handlePublicList(config: CrudConfig) {
  try {
    const supabase = getServiceSupabase();
    let query = supabase
      .from(config.table)
      .select("*")
      .eq("is_visible", true);

    if (config.defaultOrder) {
      query = query.order(config.defaultOrder.column, {
        ascending: config.defaultOrder.ascending,
      });
    } else {
      query = query.order("order", { ascending: true }).order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) return fail(error.message, 500);
    return ok(rowsToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch list", 500);
  }
}

export async function handleAdminList(req: Request, config: CrudConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const supabase = getServiceSupabase();
    let query = supabase.from(config.table).select("*");

    if (config.defaultOrder) {
      query = query.order(config.defaultOrder.column, {
        ascending: config.defaultOrder.ascending,
      });
    } else {
      query = query.order("order", { ascending: true }).order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    if (error) return fail(error.message, 500);
    return ok(rowsToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch items", 500);
  }
}

export async function handleAdminCreate(req: Request, config: CrudConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const row = camelToRow(body, config.allowedFields);

    if (config.hasSlug && !row.slug && row.title) {
      row.slug = slugify(row.title);
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from(config.table)
      .insert(row)
      .select()
      .single();

    if (error) return fail(error.message, 400);

    await logAdminActivity(
      admin,
      "CREATE",
      config.resourceName,
      `Created ${config.resourceName}: ${row.title || row.name || row.company || row.institution || row.platform || data.id}`,
      data.id
    );

    return ok(rowToCamel(data), 201);
  } catch (err: any) {
    return fail(err.message || "Create failed", 400);
  }
}

export async function handleAdminGetById(req: Request, id: string, config: CrudConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return fail(error.message, 500);
  if (!data) return fail(`${config.resourceName} not found`, 404);
  return ok(rowToCamel(data));
}

export async function handleAdminUpdateById(req: Request, id: string, config: CrudConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const row = camelToRow(body, config.allowedFields);
    row.updated_at = new Date().toISOString();

    if (config.hasSlug && body.title && !body.slug) {
      // keep existing slug unless explicitly changed
    }

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from(config.table)
      .update(row)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) return fail(error.message, 400);
    if (!data) return fail(`${config.resourceName} not found`, 404);

    await logAdminActivity(
      admin,
      "UPDATE",
      config.resourceName,
      `Updated ${config.resourceName}: ${data.title || data.name || data.company || data.institution || data.id}`,
      data.id
    );

    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Update failed", 400);
  }
}

export async function handleAdminDeleteById(req: Request, id: string, config: CrudConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from(config.table)
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail(`${config.resourceName} not found`, 404);

  await logAdminActivity(
    admin,
    "DELETE",
    config.resourceName,
    `Deleted ${config.resourceName}: ${data.title || data.name || data.company || data.id}`,
    data.id
  );

  return ok({ deleted: true, id: data.id });
}

export async function handleAdminReorder(req: Request, config: CrudConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) return fail("items array is required", 400);

    const supabase = getServiceSupabase();
    await Promise.all(
      items.map((item: { id?: string; _id?: string; order: number }, idx: number) => {
        const targetId = item.id || item._id;
        if (!targetId) return Promise.resolve();
        return supabase
          .from(config.table)
          .update({ order: item.order ?? idx, updated_at: new Date().toISOString() })
          .eq("id", targetId);
      })
    );

    await logAdminActivity(
      admin,
      "REORDER",
      config.resourceName,
      `Reordered ${items.length} ${config.resourceName} items`
    );

    return ok({ reordered: true });
  } catch (err: any) {
    return fail(err.message || "Reorder failed", 400);
  }
}

export async function handleAdminToggleVisibility(req: Request, id: string, config: CrudConfig) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const supabase = getServiceSupabase();
  const { data: existing, error: fetchError } = await supabase
    .from(config.table)
    .select("id, is_visible")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return fail(fetchError.message, 500);
  if (!existing) return fail(`${config.resourceName} not found`, 404);

  const { data, error } = await supabase
    .from(config.table)
    .update({ is_visible: !existing.is_visible, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return fail(error.message, 400);

  await logAdminActivity(
    admin,
    "UPDATE",
    config.resourceName,
    `Toggled visibility for ${config.resourceName} (${data.is_visible ? "visible" : "hidden"})`,
    data.id
  );

  return ok(rowToCamel(data));
}

export function buildJsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}
