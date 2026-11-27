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
import {
  handleJsonPublicList,
  handleJsonAdminList,
  handleJsonAdminCreate,
  handleJsonAdminGetById,
  handleJsonAdminUpdateById,
  handleJsonAdminDeleteById,
  handleJsonAdminReorder,
  handleJsonAdminToggleVisibility,
} from "@/lib/jsonListHandler";

export interface CrudConfig {
  table: string;
  resourceName: string;
  defaultOrder?: { column: string; ascending: boolean };
  hasSlug?: boolean;
  allowedFields?: string[];
  fixedFilter?: Record<string, string>;
  jsonColumn?: { table: string; column: string };
}

export async function handlePublicList(config: CrudConfig) {
  if (config.jsonColumn) {
    return handleJsonPublicList({
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

  try {
    const supabase = getServiceSupabase();
    let query = supabase
      .from(config.table)
      .select("*")
      .eq("is_visible", true)
      .eq("is_archived", false);

    if (config.fixedFilter) {
      query = query.match(config.fixedFilter);
    }

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
  if (config.jsonColumn) {
    return handleJsonAdminList(req, {
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const supabase = getServiceSupabase();
    let query = supabase.from(config.table).select("*").eq("is_archived", false);

    if (config.fixedFilter) {
      query = query.match(config.fixedFilter);
    }

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

async function isSlugTaken(
  supabase: ReturnType<typeof getServiceSupabase>,
  table: string,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase.from(table).select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.limit(1);
  return Boolean(data && data.length > 0);
}

async function resolveUniqueSlug(
  supabase: ReturnType<typeof getServiceSupabase>,
  table: string,
  rawSlug: string | undefined,
  fallbackTitle: string,
  excludeId?: string
): Promise<{ slug?: string; error?: string }> {
  const explicit = typeof rawSlug === "string" ? rawSlug.trim() : "";
  if (explicit) {
    const normalized = slugify(explicit);
    if (await isSlugTaken(supabase, table, normalized, excludeId)) {
      return {
        error: `Slug "${normalized}" is already in use. Every item must have a unique slug/URL.`,
      };
    }
    return { slug: normalized };
  }

  const base = slugify(fallbackTitle);
  let candidate = base;
  let counter = 2;
  while (await isSlugTaken(supabase, table, candidate, excludeId)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return { slug: candidate };
}

export async function handleAdminCreate(req: Request, config: CrudConfig) {
  if (config.jsonColumn) {
    return handleJsonAdminCreate(req, {
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const row = camelToRow(body, config.allowedFields);
    if (config.fixedFilter) {
      Object.assign(row, config.fixedFilter);
    }

    const supabase = getServiceSupabase();

    if (config.hasSlug) {
      const resolved = await resolveUniqueSlug(
        supabase,
        config.table,
        row.slug,
        row.title || config.resourceName
      );
      if (resolved.error) return fail(resolved.error, 409);
      row.slug = resolved.slug;
    }

    const { data, error } = await supabase
      .from(config.table)
      .insert(row)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return fail("This slug/URL is already in use. Please choose a unique value.", 409);
      }
      return fail(error.message, 400);
    }

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
  if (config.jsonColumn) {
    return handleJsonAdminGetById(req, id, {
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const supabase = getServiceSupabase();
  let query = supabase.from(config.table).select("*").eq("id", id);
  if (config.fixedFilter) {
    query = query.match(config.fixedFilter);
  }
  const { data, error } = await query.maybeSingle();

  if (error) return fail(error.message, 500);
  if (!data) return fail(`${config.resourceName} not found`, 404);
  return ok(rowToCamel(data));
}

export async function handleAdminUpdateById(req: Request, id: string, config: CrudConfig) {
  if (config.jsonColumn) {
    return handleJsonAdminUpdateById(req, id, {
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const row = camelToRow(body, config.allowedFields);
    row.updated_at = new Date().toISOString();

    const supabase = getServiceSupabase();

    if (config.hasSlug && ("slug" in row || "title" in row)) {
      if ("slug" in row) {
        const resolved = await resolveUniqueSlug(
          supabase,
          config.table,
          row.slug,
          row.title || config.resourceName,
          id
        );
        if (resolved.error) return fail(resolved.error, 409);
        row.slug = resolved.slug;
      }
    }

    let query = supabase.from(config.table).update(row).eq("id", id);
    if (config.fixedFilter) {
      query = query.match(config.fixedFilter);
    }
    const { data, error } = await query.select().maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return fail("This slug/URL is already in use. Please choose a unique value.", 409);
      }
      return fail(error.message, 400);
    }
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
  if (config.jsonColumn) {
    return handleJsonAdminDeleteById(req, id, {
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const now = new Date().toISOString();
  const supabase = getServiceSupabase();
  let query = supabase
    .from(config.table)
    .update({ is_archived: true, archived_at: now, updated_at: now })
    .eq("id", id);
  if (config.fixedFilter) {
    query = query.match(config.fixedFilter);
  }
  const { data, error } = await query.select().maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail(`${config.resourceName} not found`, 404);

  await logAdminActivity(
    admin,
    "ARCHIVE",
    config.resourceName,
    `Moved ${config.resourceName} to trash: ${data.title || data.name || data.company || data.id}`,
    data.id
  );

  return ok({ archived: true, id: data.id });
}

export async function handleAdminReorder(req: Request, config: CrudConfig) {
  if (config.jsonColumn) {
    return handleJsonAdminReorder(req, {
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

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
        let query = supabase
          .from(config.table)
          .update({ order: item.order ?? idx, updated_at: new Date().toISOString() })
          .eq("id", targetId);
        if (config.fixedFilter) {
          query = query.match(config.fixedFilter);
        }
        return query;
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
  if (config.jsonColumn) {
    return handleJsonAdminToggleVisibility(req, id, {
      table: config.jsonColumn.table,
      column: config.jsonColumn.column,
      resourceName: config.resourceName,
    });
  }

  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const supabase = getServiceSupabase();
  let fetchQuery = supabase.from(config.table).select("id, is_visible").eq("id", id);
  if (config.fixedFilter) {
    fetchQuery = fetchQuery.match(config.fixedFilter);
  }
  const { data: existing, error: fetchError } = await fetchQuery.maybeSingle();

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
