import {
  getServiceSupabase,
  verifyAdminRequest,
  unauthorizedResponse,
  ok,
  fail,
} from "@/lib/adminAuth";
import { getSingletonRow } from "@/lib/jsonListHandler";

export async function GET(req: Request) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return unauthorizedResponse();

  try {
    const supabase = getServiceSupabase();
    const [aboutRes, projects, experience, certificates, blog, testimonials, messages, notes] =
      await Promise.all([
        getSingletonRow("about"),
        supabase.from("projects").select("id, title, category, archived_at, updated_at").eq("is_archived", true),
        supabase.from("experience").select("id, entry_type, company, role, title, archived_at, updated_at").eq("is_archived", true),
        supabase.from("certificates").select("id, title, issuer, archived_at, updated_at").eq("is_archived", true),
        supabase.from("blog_posts").select("id, title, category, archived_at, updated_at").eq("is_archived", true),
        supabase.from("testimonials").select("id, name, role, company, archived_at, updated_at").eq("is_archived", true),
        supabase.from("contact_messages").select("id, name, email, subject, archived_at, updated_at").eq("is_archived", true),
        supabase.from("admin_notes").select("id, title, notebook, archived_at, updated_at").eq("is_archived", true),
      ]);

    const items: any[] = [];

    for (const r of projects.data || []) {
      items.push({ id: r.id, module: "projects", moduleLabel: "Project", title: r.title, subtitle: r.category || "", archivedAt: r.archived_at || r.updated_at });
    }
    for (const r of experience.data || []) {
      const isAch = r.entry_type === "achievement";
      items.push({
        id: r.id,
        module: isAch ? "achievements" : "experience",
        moduleLabel: isAch ? "Honor / Hackathon" : "Experience",
        title: isAch ? r.title : `${r.role}${r.company ? ` @ ${r.company}` : ""}`,
        subtitle: isAch ? "Experience" : r.company || "",
        archivedAt: r.archived_at || r.updated_at,
      });
    }
    for (const r of certificates.data || []) {
      items.push({ id: r.id, module: "certificates", moduleLabel: "Certificate", title: r.title, subtitle: r.issuer || "", archivedAt: r.archived_at || r.updated_at });
    }
    for (const r of blog.data || []) {
      items.push({ id: r.id, module: "blog", moduleLabel: "Blog Post", title: r.title, subtitle: r.category || "", archivedAt: r.archived_at || r.updated_at });
    }
    for (const r of testimonials.data || []) {
      items.push({ id: r.id, module: "testimonials", moduleLabel: "Testimonial", title: r.name, subtitle: [r.role, r.company].filter(Boolean).join(" · "), archivedAt: r.archived_at || r.updated_at });
    }
    for (const r of messages.data || []) {
      items.push({ id: r.id, module: "messages", moduleLabel: "Message", title: r.subject || r.name, subtitle: r.email, archivedAt: r.archived_at || r.updated_at });
    }
    for (const r of notes.data || []) {
      items.push({ id: r.id, module: "notes", moduleLabel: "Note", title: r.title, subtitle: r.notebook || "Personal Notes", archivedAt: r.archived_at || r.updated_at });
    }

    const aboutRow = aboutRes.row || {};
    const jsonMappings = [
      { col: "education", module: "education", label: "Education", getTitle: (x: any) => x.institution, getSub: (x: any) => [x.degree, x.fieldOfStudy].filter(Boolean).join(" — ") },
      { col: "skills", module: "skills", label: "Skill", getTitle: (x: any) => x.name, getSub: (x: any) => x.category || "" },
      { col: "coding_profiles", module: "coding-profiles", label: "Coding Profile", getTitle: (x: any) => x.platform, getSub: (x: any) => x.username || "" },
      { col: "resume_versions", module: "resume", label: "Resume", getTitle: (x: any) => x.label || x.file?.alt || "Resume", getSub: () => "PDF" },
    ];

    for (const cfg of jsonMappings) {
      const arr: any[] = Array.isArray(aboutRow[cfg.col]) ? aboutRow[cfg.col] : [];
      for (const x of arr) {
        if (!x?.isArchived) continue;
        items.push({
          id: x._id || x.id,
          module: cfg.module,
          moduleLabel: cfg.label,
          title: cfg.getTitle(x),
          subtitle: cfg.getSub(x),
          archivedAt: x.archivedAt || x.updatedAt || null,
        });
      }
    }

    items.sort((a, b) => new Date(b.archivedAt || 0).getTime() - new Date(a.archivedAt || 0).getTime());
    return ok(items);
  } catch (err: any) {
    return fail(err.message || "Failed to load trash", 500);
  }
}
