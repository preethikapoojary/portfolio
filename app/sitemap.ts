import type { MetadataRoute } from "next";
import { getServiceSupabase } from "@/lib/adminAuth";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://preethika-poojary.netlify.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/projects",
    "/experience",
    "/certificates",
    "/testimonials",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    const supabase = getServiceSupabase();
    const [projectsRes, expRes, blogRes] = await Promise.all([
      supabase.from("projects").select("slug, updated_at").eq("is_visible", true),
      supabase.from("experience").select("id, updated_at").eq("is_visible", true),
      supabase.from("blog_posts").select("slug, updated_at").eq("status", "published"),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = (projectsRes.data || []).map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const expRoutes: MetadataRoute.Sitemap = (expRes.data || []).map((e) => ({
      url: `${baseUrl}/experience/${e.id}`,
      lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    const blogRoutes: MetadataRoute.Sitemap = (blogRes.data || []).map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes, ...expRoutes, ...blogRoutes];
  } catch {
    return staticRoutes;
  }
}
