import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { resolveUniqueSlug } from "@/lib/crudHandler";
import { rowToCamel, camelToRow } from "@/lib/mappers";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await req.json();
  const row = camelToRow(body);
  row.updated_at = new Date().toISOString();

  const supabase = getServiceSupabase();
  if ("slug" in row || "name" in row) {
    if ("slug" in row) {
      const resolved = await resolveUniqueSlug(
        supabase,
        "testimonials",
        row.slug,
        row.name || "testimonial",
        id
      );
      if (resolved.error) return fail(resolved.error, 409);
      row.slug = resolved.slug;
    }
  }

  const { data, error } = await supabase
    .from("testimonials")
    .update(row)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return fail("This slug/URL is already in use. Please choose a unique value.", 409);
    }
    return fail(error.message, 400);
  }
  if (!data) return fail("Testimonial not found", 404);
  return ok(rowToCamel(data));
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const { id } = await context.params;
  const now = new Date().toISOString();
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("testimonials")
    .update({ is_archived: true, archived_at: now, updated_at: now })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return fail(error.message, 400);
  if (!data) return fail("Testimonial not found", 404);

  await logAdminActivity(admin, "ARCHIVE", "Testimonial", `Moved testimonial from ${data.name} to trash`, id);
  return ok({ archived: true });
}
