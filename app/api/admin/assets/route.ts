import fs from "node:fs";
import path from "node:path";
import { getServiceSupabase, verifyAdminRequest, unauthorizedResponse, fail } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);
const BUCKET = "portfolio-media";

function buildAssetMeta(name: string, assetPath: string, source: "local" | "supabase") {
  const ext = path.extname(name).toLowerCase();
  const type = IMAGE_EXTS.has(ext) ? "image" : ext === ".pdf" ? "pdf" : "other";
  const lower = `${name} ${assetPath}`.toLowerCase();
  const isLogo = lower.includes("logo");
  const isCertificate =
    ext === ".png" ||
    lower.includes("certificate") ||
    lower.includes("workshop") ||
    lower.includes("ideathon") ||
    lower.includes("challenge") ||
    lower.includes("winner") ||
    lower.includes("mind-mesh") ||
    lower.includes("crackathon");

  return {
    name,
    path: assetPath,
    ext: ext.replace(".", "").toUpperCase() || "FILE",
    type,
    isLogo,
    isCertificate,
    source,
  };
}

async function listSupabaseAssets() {
  const supabase = getServiceSupabase();
  const results: ReturnType<typeof buildAssetMeta>[] = [];

  async function walk(prefix: string) {
    const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
      limit: 200,
      sortBy: { column: "name", order: "asc" },
    });
    if (error || !data) return;

    for (const entry of data) {
      if (!entry.name || entry.name === ".emptyFolderPlaceholder") continue;
      const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      // Folders in Supabase Storage have id === null
      if (!entry.id) {
        await walk(fullPath);
      } else {
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(fullPath);
        if (pub?.publicUrl) {
          results.push(buildAssetMeta(entry.name, pub.publicUrl, "supabase"));
        }
      }
    }
  }

  try {
    await walk("");
  } catch {
    // Non-fatal: still return local /public/assets if storage listing fails
  }
  return results;
}

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const localAssets: ReturnType<typeof buildAssetMeta>[] = [];
    const assetsDir = path.join(process.cwd(), "public", "assets");
    if (fs.existsSync(assetsDir)) {
      const entries = fs.readdirSync(assetsDir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isFile()) {
          localAssets.push(buildAssetMeta(e.name, `/assets/${e.name}`, "local"));
        }
      }
    }

    const supabaseAssets = await listSupabaseAssets();
    const seen = new Set(localAssets.map((a) => a.path));
    const merged = [...localAssets];
    for (const item of supabaseAssets) {
      if (!seen.has(item.path)) {
        seen.add(item.path);
        merged.push(item);
      }
    }

    merged.sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ success: true, assets: merged });
  } catch (err: any) {
    return fail(err.message || "Failed to list assets", 500);
  }
}
