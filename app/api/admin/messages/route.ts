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

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  if (error) return fail(error.message, 500);
  return ok(rowsToCamel(data));
}
