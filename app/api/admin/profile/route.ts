import {
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
  logAdminActivity,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";
import { rowToCamel, camelToRow } from "@/lib/mappers";

const PROFILE_FIELDS = [
  "name",
  "title",
  "about_me",
  "career_objective",
  "profile_photo",
  "cover_banner",
  "email",
  "phone",
  "location",
  "social_links",
];

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const { row } = await getSingletonRow("about");
    return ok(rowToCamel(row));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch profile", 500);
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const body = await req.json();
    const row = camelToRow(body, PROFILE_FIELDS);
    row.updated_at = new Date().toISOString();

    const { supabase, row: existing } = await getSingletonRow("about");
    const { data, error } = await supabase
      .from("about")
      .update(row)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return fail(error.message, 400);
    await logAdminActivity(admin, "UPDATE", "Profile", "Updated profile", data.id);
    return ok(rowToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Update failed", 400);
  }
}
