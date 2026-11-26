import { CrudConfig } from "@/lib/crudHandler";

export const CRUD_CONFIGS: Record<string, CrudConfig> = {
  sections: {
    table: "sections",
    resourceName: "Section",
    defaultOrder: { column: "order", ascending: true },
  },
  education: {
    table: "education",
    resourceName: "Education",
    defaultOrder: { column: "order", ascending: true },
  },
  skills: {
    table: "skills",
    resourceName: "Skill",
    defaultOrder: { column: "order", ascending: true },
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
  },
  certificates: {
    table: "certificates",
    resourceName: "Certificate",
    defaultOrder: { column: "order", ascending: true },
  },
  achievements: {
    table: "achievements",
    resourceName: "Achievement",
    defaultOrder: { column: "order", ascending: true },
  },
  gallery: {
    table: "gallery_images",
    resourceName: "GalleryImage",
    defaultOrder: { column: "order", ascending: true },
  },
  blog: {
    table: "blog_posts",
    resourceName: "BlogPost",
    defaultOrder: { column: "created_at", ascending: false },
    hasSlug: true,
  },
  "coding-profiles": {
    table: "coding_profiles",
    resourceName: "CodingProfile",
    defaultOrder: { column: "order", ascending: true },
  },
};
