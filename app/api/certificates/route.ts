import { handlePublicList } from "@/lib/crudHandler";
import { CRUD_CONFIGS } from "@/lib/moduleConfigs";

export async function GET() {
  return handlePublicList(CRUD_CONFIGS.certificates);
}
