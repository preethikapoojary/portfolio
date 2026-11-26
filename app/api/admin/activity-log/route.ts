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

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Number(searchParams.get("limit")) || 50);

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return fail(error.message, 500);
    return ok(rowsToCamel(data));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch activity log", 500);
  }
}
