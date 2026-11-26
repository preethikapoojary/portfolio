import { verifyAdminRequest, unauthorizedResponse, ok } from "@/lib/adminAuth";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();
  return ok({ admin });
}
