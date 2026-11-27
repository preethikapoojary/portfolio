import { CrudConfig } from "@/lib/crudHandler";

export const CRUD_CONFIGS: Record<string, CrudConfig> = {
  sections: {
    table: "site_settings",
    resourceName: "Section",
    jsonColumn: { table: "site_settings", column: "sections" },
  },
  education: {
    table: "about",
    resourceName: "Education",
    jsonColumn: { table: "about", column: "education" },
  },
  skills: {
    table: "about",
    resourceName: "Skill",
    jsonColumn: { table: "about", column: "skills" },
  },
  "coding-profiles": {
    table: "about",
    resourceName: "CodingProfile",
    jsonColumn: { table: "about", column: "coding_profiles" },
  },
  projects: {
    table: "projects",
    resourceName: "Project",
    defaultOrder: { column: "order", ascending: true },
    hasSlug: true,
  },
  experience: {
    table: "experience",
    resourceName: "Experience",
    defaultOrder: { column: "order", ascending: true },
    fixedFilter: { entry_type: "experience" },
  },
  achievements: {
    table: "experience",
    resourceName: "Achievement",
    defaultOrder: { column: "order", ascending: true },
    fixedFilter: { entry_type: "achievement" },
  },
  certificates: {
    table: "certificates",
    resourceName: "Certificate",
    defaultOrder: { column: "order", ascending: true },
    hasSlug: true,
  },
  blog: {
    table: "blog_posts",
    resourceName: "BlogPost",
    defaultOrder: { column: "created_at", ascending: false },
    hasSlug: true,
  },
  notes: {
    table: "admin_notes",
    resourceName: "AdminNote",
    defaultOrder: { column: "updated_at", ascending: false },
  },
};
