import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
} from "@/lib/adminAuth";
import { rowsToCamel } from "@/lib/mappers";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const supabase = getServiceSupabase();
  let query = supabase
    .from("testimonials")
    .select("*")
    .eq("is_archived", false)
    .order("order", { ascending: true })
    .order("created_at", { ascending: false });

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return fail(error.message, 500);
  return ok(rowsToCamel(data));
}
