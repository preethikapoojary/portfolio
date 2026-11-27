import { ok, fail } from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";
import { rowToCamel } from "@/lib/mappers";

export async function GET() {
  try {
    const { row } = await getSingletonRow("about");
    return ok(rowToCamel(row));
  } catch (err: any) {
    return fail(err.message || "Failed to fetch profile", 500);
  }
}
