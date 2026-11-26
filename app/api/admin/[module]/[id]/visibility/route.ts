import { handleAdminToggleVisibility } from "@/lib/crudHandler";
import { CRUD_CONFIGS } from "@/lib/moduleConfigs";
import { fail } from "@/lib/adminAuth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ module: string; id: string }> }
) {
  const { module, id } = await context.params;
  const config = CRUD_CONFIGS[module];
  if (!config) return fail(`Unknown module: ${module}`, 404);
  return handleAdminToggleVisibility(req, id, config);
}
