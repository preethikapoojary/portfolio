import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const API_BASE = "https://preethika-portfolio-api.vercel.app/api/v1";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function fetchApi(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    console.warn(`Warning: ${endpoint} returned ${res.status}`);
    return null;
  }
  const json = await res.json();
  return json?.data ?? null;
}

const EMPTY_MEDIA = { url: null, publicId: null, alt: "" };

async function replaceTable(table, rows) {
  // Delete existing rows
  await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (!rows || rows.length === 0) {
    console.log(`Cleared ${table} (0 rows from live API)`);
    return;
  }
  const { error } = await supabase.from(table).insert(rows);
  if (error) {
    console.error(`Error inserting into ${table}:`, error.message);
  } else {
    console.log(`Imported ${rows.length} rows into ${table}`);
  }
}

async function run() {
  console.log("Fetching live data from", API_BASE);

  const [
    profile,
    settings,
    sections,
    education,
    skills,
    projects,
    experience,
    certificates,
    achievements,
    gallery,
    blog,
    testimonials,
    codingProfiles,
  ] = await Promise.all([
    fetchApi("/profile"),
    fetchApi("/settings"),
    fetchApi("/sections"),
    fetchApi("/education"),
    fetchApi("/skills"),
    fetchApi("/projects"),
    fetchApi("/experience"),
    fetchApi("/certificates"),
    fetchApi("/achievements"),
    fetchApi("/gallery"),
    fetchApi("/blog"),
    fetchApi("/testimonials"),
    fetchApi("/coding-profiles"),
  ]);

  // 1. Profile
  if (profile) {
    const row = {
      name: profile.name || "",
      title: profile.title || "",
      about_me: profile.aboutMe || "",
      career_objective: profile.careerObjective || "",
      profile_photo: profile.profilePhoto || EMPTY_MEDIA,
      cover_banner: profile.coverBanner || EMPTY_MEDIA,
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      social_links: profile.socialLinks || [],
      updated_at: new Date().toISOString(),
    };
    const { data: existing } = await supabase.from("profile").select("id").limit(1).maybeSingle();
    if (existing) await supabase.from("profile").update(row).eq("id", existing.id);
    else await supabase.from("profile").insert(row);
    console.log("Imported profile:", row.name);
  }

  // 2. Site Settings
  if (settings) {
    const row = {
      logo: settings.logo || EMPTY_MEDIA,
      favicon: settings.favicon || EMPTY_MEDIA,
      theme: settings.theme || {
        primaryColor: "#6366F1",
        secondaryColor: "#8B5CF6",
        accentColor: "#F59E0B",
        fontFamily: "Inter",
      },
      footer_text: settings.footerText || "",
      footer_links: settings.footerLinks || [],
      nav_items: settings.navItems || [],
      seo: settings.seo || { metaTitle: "", metaDescription: "", ogImage: EMPTY_MEDIA },
      hero: settings.hero || {
        headline: "",
        subheadline: "",
        ctaText: "",
        ctaLink: "",
        backgroundImage: EMPTY_MEDIA,
      },
      github_username: settings.githubUsername || "preethikapoojary",
      updated_at: new Date().toISOString(),
    };
    const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
    if (existing) await supabase.from("site_settings").update(row).eq("id", existing.id);
    else await supabase.from("site_settings").insert(row);
    console.log("Imported site_settings (githubUsername:", row.github_username, ")");
  }

  // 3. Sections
  if (Array.isArray(sections) && sections.length > 0) {
    await replaceTable(
      "sections",
      sections.map((s, i) => ({
        key: s.key,
        label: s.label || s.key,
        order: s.order ?? i,
        is_visible: s.isVisible ?? true,
      }))
    );
  }

  // 4. Education
  await replaceTable(
    "education",
    (education || []).map((e, i) => ({
      institution: e.institution || "",
      degree: e.degree || "",
      field_of_study: e.fieldOfStudy || "",
      start_date: e.startDate || null,
      end_date: e.endDate || null,
      grade: e.grade || "",
      description: e.description || "",
      order: e.order ?? i,
      is_visible: e.isVisible ?? true,
    }))
  );

  // 5. Skills
  await replaceTable(
    "skills",
    (skills || []).map((s, i) => ({
      name: s.name || "",
      category: s.category || "General",
      proficiency: s.proficiency ?? 80,
      icon: s.icon || "",
      order: s.order ?? i,
      is_visible: s.isVisible ?? true,
    }))
  );

  // 6. Projects
  await replaceTable(
    "projects",
    (projects || []).map((p, i) => ({
      title: p.title || "",
      slug: p.slug || `project-${i}`,
      short_description: p.shortDescription || "",
      long_description: p.longDescription || "",
      cover_image: p.coverImage || EMPTY_MEDIA,
      screenshots: p.screenshots || [],
      report_pdf: p.reportPdf || EMPTY_MEDIA,
      video_url: p.videoUrl || "",
      github_url: p.githubUrl || "",
      live_demo_url: p.liveDemoUrl || "",
      technologies: p.technologies || [],
      category: p.category || "General",
      is_featured: p.isFeatured ?? false,
      order: p.order ?? i,
      is_visible: p.isVisible ?? true,
      seo: p.seo || { metaTitle: "", metaDescription: "", ogImage: EMPTY_MEDIA },
    }))
  );

  // 7. Experience
  await replaceTable(
    "experience",
    (experience || []).map((e, i) => ({
      company: e.company || "",
      role: e.role || "",
      location: e.location || "",
      start_date: e.startDate || null,
      end_date: e.endDate || null,
      is_current: e.isCurrent ?? false,
      description: e.description || "",
      responsibilities: e.responsibilities || [],
      technologies: e.technologies || [],
      proof_file: e.proofFile || EMPTY_MEDIA,
      proof_url: e.proofUrl || "",
      github_urls: e.githubUrls || [],
      related_projects: e.relatedProjects || [],
      project_report_url: e.projectReportUrl || "",
      project_report_pdf: e.projectReportPdf || EMPTY_MEDIA,
      certificate: e.certificate || EMPTY_MEDIA,
      attachments: e.attachments || [],
      order: e.order ?? i,
      is_visible: e.isVisible ?? true,
    }))
  );

  // 8. Certificates
  await replaceTable(
    "certificates",
    (certificates || []).map((c, i) => ({
      title: c.title || "",
      issuer: c.issuer || "",
      image: c.image || EMPTY_MEDIA,
      credential_url: c.credentialUrl || "",
      issue_date: c.issueDate || null,
      order: c.order ?? i,
      is_visible: c.isVisible ?? true,
    }))
  );

  // 9. Achievements
  await replaceTable(
    "achievements",
    (achievements || []).map((a, i) => ({
      title: a.title || "",
      description: a.description || "",
      date: a.date || null,
      icon: a.icon || "",
      order: a.order ?? i,
      is_visible: a.isVisible ?? true,
    }))
  );

  // 10. Gallery
  await replaceTable(
    "gallery_images",
    (gallery || []).map((g, i) => ({
      image: g.image || EMPTY_MEDIA,
      caption: g.caption || "",
      category: g.category || "General",
      order: g.order ?? i,
      is_visible: g.isVisible ?? true,
    }))
  );

  // 11. Blog
  await replaceTable(
    "blog_posts",
    (blog || []).map((b, i) => ({
      title: b.title || "",
      slug: b.slug || `post-${i}`,
      excerpt: b.excerpt || "",
      content: b.content || "",
      cover_image: b.coverImage || EMPTY_MEDIA,
      status: b.status || "published",
      category: b.category || "General",
      tags: b.tags || [],
      seo: b.seo || { metaTitle: "", metaDescription: "", ogImage: EMPTY_MEDIA },
      published_at: b.publishedAt || b.createdAt || new Date().toISOString(),
    }))
  );

  // 12. Coding Profiles
  await replaceTable(
    "coding_profiles",
    (codingProfiles || []).map((cp, i) => ({
      platform: cp.platform || "",
      username: cp.username || "",
      profile_url: cp.profileUrl || "",
      icon: cp.icon || "",
      stats: cp.stats || {},
      order: cp.order ?? i,
      is_visible: cp.isVisible ?? true,
    }))
  );

  // 13. Testimonials
  await replaceTable(
    "testimonials",
    (testimonials || []).map((t) => ({
      name: t.name || "",
      role: t.role || "",
      company: t.company || "",
      email: t.email || "",
      linkedin_url: t.linkedinUrl || "",
      github_url: t.githubUrl || "",
      message: t.message || "",
      avatar: t.avatar || EMPTY_MEDIA,
      rating: t.rating ?? 5,
      status: t.status || "approved",
      is_visible: t.isVisible ?? true,
    }))
  );

  console.log("Live import complete!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
