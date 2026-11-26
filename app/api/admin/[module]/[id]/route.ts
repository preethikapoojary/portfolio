import {
  handleAdminGetById,
  handleAdminUpdateById,
  handleAdminDeleteById,
} from "@/lib/crudHandler";
import { CRUD_CONFIGS } from "@/lib/moduleConfigs";
import { fail } from "@/lib/adminAuth";

export async function GET(
  req: Request,
  context: { params: Promise<{ module: string; id: string }> }
) {
  const { module, id } = await context.params;
  const config = CRUD_CONFIGS[module];
  if (!config) return fail(`Unknown module: ${module}`, 404);
  return handleAdminGetById(req, id, config);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ module: string; id: string }> }
) {
  const { module, id } = await context.params;
  const config = CRUD_CONFIGS[module];
  if (!config) return fail(`Unknown module: ${module}`, 404);
  return handleAdminUpdateById(req, id, config);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ module: string; id: string }> }
) {
  const { module, id } = await context.params;
  const config = CRUD_CONFIGS[module];
  if (!config) return fail(`Unknown module: ${module}`, 404);
  return handleAdminDeleteById(req, id, config);
}
