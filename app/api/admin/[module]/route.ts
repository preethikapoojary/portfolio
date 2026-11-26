import { handleAdminList, handleAdminCreate } from "@/lib/crudHandler";
import { CRUD_CONFIGS } from "@/lib/moduleConfigs";
import { fail } from "@/lib/adminAuth";

export async function GET(
  req: Request,
  context: { params: Promise<{ module: string }> }
) {
  const { module } = await context.params;
  const config = CRUD_CONFIGS[module];
  if (!config) return fail(`Unknown module: ${module}`, 404);
  return handleAdminList(req, config);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ module: string }> }
) {
  const { module } = await context.params;
  const config = CRUD_CONFIGS[module];
  if (!config) return fail(`Unknown module: ${module}`, 404);
  return handleAdminCreate(req, config);
}
