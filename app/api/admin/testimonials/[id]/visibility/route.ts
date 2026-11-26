import { handleAdminToggleVisibility } from "@/lib/crudHandler";

const config = { table: "testimonials", resourceName: "Testimonial" };

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return handleAdminToggleVisibility(req, id, config);
}
