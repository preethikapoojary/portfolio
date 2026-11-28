import fs from "node:fs";
import path from "node:path";
import { verifyAdminRequest, unauthorizedResponse, fail } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const assetsDir = path.join(process.cwd(), "public", "assets");
    if (!fs.existsSync(assetsDir)) {
      return NextResponse.json({ success: true, assets: [] });
    }

    const entries = fs.readdirSync(assetsDir, { withFileTypes: true });
    const assets = entries
      .filter((e) => e.isFile())
      .map((e) => {
        const name = e.name;
        const ext = path.extname(name).toLowerCase();
        const type = IMAGE_EXTS.has(ext) ? "image" : ext === ".pdf" ? "pdf" : "other";
        const lower = name.toLowerCase();
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
          path: `/assets/${name}`,
          ext: ext.replace(".", "").toUpperCase(),
          type,
          isLogo,
          isCertificate,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, assets });
  } catch (err: any) {
    return fail(err.message || "Failed to list assets", 500);
  }
}
