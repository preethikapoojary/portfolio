import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

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

async function seed() {
  console.log("Seeding Preethika's portfolio content...");

  // 1. Profile (update existing singleton or insert)
  const { data: existingProfile } = await supabase.from("profile").select("id").limit(1).maybeSingle();
  const profilePayload = {
    name: "Preethika",
    title: "Full-Stack Developer & AI/ML Enthusiast",
    about_me:
      "I am a passionate software developer focused on building scalable web applications, intuitive user interfaces, and intelligent AI-driven solutions. I enjoy turning complex problems into clean, reliable products.",
    career_objective:
      "Seeking impactful software engineering opportunities to build high-performance full-stack and AI-powered products while continuously learning and collaborating with great teams.",
    email: process.env.ADMIN_EMAIL || "preethika@example.com",
    location: "India",
    social_links: [
      { platform: "GitHub", url: "https://github.com", icon: "github" },
      { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { platform: "Email", url: `mailto:${process.env.ADMIN_EMAIL || "preethika@example.com"}`, icon: "mail" },
    ],
  };

  if (existingProfile) {
    await supabase.from("profile").update(profilePayload).eq("id", existingProfile.id);
  } else {
    await supabase.from("profile").insert(profilePayload);
  }

  // 2. Site Settings
  const { data: existingSettings } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
  const settingsPayload = {
    theme: {
      primaryColor: "#6366F1",
      secondaryColor: "#8B5CF6",
      accentColor: "#F59E0B",
      fontFamily: "Inter",
    },
    footer_text: "© 2026 Preethika. Crafted with Next.js & Supabase.",
    seo: {
      metaTitle: "Preethika | Full-Stack Developer Portfolio",
      metaDescription: "Portfolio of Preethika — projects, experience, skills, blog, and achievements.",
      ogImage: { url: null, publicId: null, alt: "" },
    },
    hero: {
      headline: "Building thoughtful web experiences & intelligent systems.",
      subheadline:
        "Full-Stack Developer crafting modern, responsive applications with clean architecture and attention to detail.",
      ctaText: "Explore Projects",
      ctaLink: "#projects",
      backgroundImage: { url: null, publicId: null, alt: "" },
    },
  };

  if (existingSettings) {
    await supabase.from("site_settings").update(settingsPayload).eq("id", existingSettings.id);
  } else {
    await supabase.from("site_settings").insert(settingsPayload);
  }

  // Helper to seed table only if empty
  async function seedIfEmpty(table, rows) {
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    if ((count || 0) === 0) {
      const { error } = await supabase.from(table).insert(rows);
      if (error) console.error(`Error seeding ${table}:`, error.message);
      else console.log(`Seeded ${rows.length} rows in ${table}`);
    } else {
      console.log(`Skipped ${table} (already has ${count} rows)`);
    }
  }

  // 3. Education
  await seedIfEmpty("education", [
    {
      institution: "Bachelor of Engineering in Computer Science",
      degree: "B.E. / B.Tech",
      field_of_study: "Computer Science & Engineering",
      start_date: "2022-08-01T00:00:00Z",
      end_date: "2026-05-01T00:00:00Z",
      grade: "9.0 CGPA",
      description: "Focused on Data Structures, Algorithms, Full-Stack Web Development, DBMS, and Machine Learning.",
      order: 0,
      is_visible: true,
    },
  ]);

  // 4. Skills
  await seedIfEmpty("skills", [
    { name: "React / Next.js", category: "Frontend", proficiency: 92, icon: "code", order: 0, is_visible: true },
    { name: "TypeScript / JavaScript", category: "Frontend", proficiency: 90, icon: "code", order: 1, is_visible: true },
    { name: "Tailwind CSS", category: "Frontend", proficiency: 90, icon: "layout", order: 2, is_visible: true },
    { name: "Node.js / Express", category: "Backend", proficiency: 85, icon: "server", order: 3, is_visible: true },
    { name: "Supabase / PostgreSQL", category: "Database", proficiency: 86, icon: "database", order: 4, is_visible: true },
    { name: "Python & ML", category: "AI / ML", proficiency: 82, icon: "cpu", order: 5, is_visible: true },
    { name: "Git & GitHub", category: "Tools", proficiency: 88, icon: "git-branch", order: 6, is_visible: true },
  ]);

  // 5. Projects
  await seedIfEmpty("projects", [
    {
      title: "Dynamic Portfolio & CMS Platform",
      slug: "dynamic-portfolio-cms",
      short_description:
        "A unified Next.js & Supabase portfolio with a built-in /admin CMS for real-time content, theme, and analytics management.",
      long_description:
        "<p>Built a full-stack personal portfolio platform with a glassmorphic public frontend and an authenticated <code>/admin</code> dashboard powered by Supabase Auth, Postgres RLS, and Supabase Storage.</p>",
      technologies: ["Next.js", "React", "Tailwind CSS", "Supabase", "PostgreSQL"],
      category: "Full-Stack",
      is_featured: true,
      order: 0,
      is_visible: true,
    },
    {
      title: "Smart Task & Collaboration Hub",
      slug: "smart-task-collaboration-hub",
      short_description:
        "Real-time team workspace with kanban boards, role-based access control, and automated progress summaries.",
      long_description:
        "<p>Designed and developed a collaborative productivity tool featuring live status updates, keyboard shortcuts, and clean analytics charts.</p>",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
      category: "Web App",
      is_featured: true,
      order: 1,
      is_visible: true,
    },
    {
      title: "AI Document Insights Assistant",
      slug: "ai-document-insights",
      short_description:
        "Intelligent document analyzer that extracts key takeaways, answers questions, and summarizes long PDFs.",
      long_description:
        "<p>Implemented an end-to-end NLP pipeline for fast semantic search and structured summarization of technical documents.</p>",
      technologies: ["Python", "Next.js", "REST API", "Vector Search"],
      category: "AI / ML",
      is_featured: true,
      order: 2,
      is_visible: true,
    },
  ]);

  // 6. Experience
  await seedIfEmpty("experience", [
    {
      company: "Tech Innovations Lab",
      role: "Software Engineering Intern",
      location: "Remote / Bengaluru",
      start_date: "2025-05-01T00:00:00Z",
      end_date: "2025-08-01T00:00:00Z",
      is_current: false,
      description: "Contributed to building full-stack web features, REST APIs, and responsive UI components.",
      responsibilities: [
        "Developed reusable React & Next.js UI components with Tailwind CSS",
        "Designed PostgreSQL schemas and optimized API query performance",
        "Collaborated in agile sprints with code reviews and automated testing",
      ],
      technologies: ["React", "Next.js", "PostgreSQL", "TypeScript"],
      order: 0,
      is_visible: true,
    },
  ]);

  // 7. Certificates
  await seedIfEmpty("certificates", [
    {
      title: "Full-Stack Web Development Specialization",
      issuer: "Coursera / Meta",
      issue_date: "2025-01-15T00:00:00Z",
      order: 0,
      is_visible: true,
    },
    {
      title: "Database Design & PostgreSQL Mastery",
      issuer: "freeCodeCamp",
      issue_date: "2024-11-10T00:00:00Z",
      order: 1,
      is_visible: true,
    },
  ]);

  // 8. Achievements
  await seedIfEmpty("achievements", [
    {
      title: "National Hackathon Finalist",
      description: "Built an AI-assisted accessibility web app and reached the top 5 among 120+ participating teams.",
      date: "2025-03-20T00:00:00Z",
      icon: "award",
      order: 0,
      is_visible: true,
    },
    {
      title: "300+ DSA Problems Solved",
      description: "Consistent problem-solving across LeetCode and HackerRank covering graphs, DP, and trees.",
      date: "2025-06-01T00:00:00Z",
      icon: "star",
      order: 1,
      is_visible: true,
    },
  ]);

  // 9. Blog Posts
  await seedIfEmpty("blog_posts", [
    {
      title: "Moving from MERN to Next.js + Supabase",
      slug: "moving-from-mern-to-nextjs-supabase",
      excerpt: "Why consolidating separate frontend, admin, and Express repos into a single Next.js + Supabase app simplifies deployment and security.",
      content:
        "<p>Managing three separate repositories and deployments can slow down iteration. By unifying the public site, <code>/admin</code> dashboard, and API routes in Next.js with Supabase Postgres + Storage, everything lives in one clean codebase.</p>",
      status: "published",
      category: "Engineering",
      tags: ["Next.js", "Supabase", "Architecture"],
      published_at: new Date().toISOString(),
    },
  ]);

  // 10. Coding Profiles
  await seedIfEmpty("coding_profiles", [
    {
      platform: "LeetCode",
      username: "preethika",
      profile_url: "https://leetcode.com",
      icon: "code",
      stats: { solved: "300+" },
      order: 0,
      is_visible: true,
    },
    {
      platform: "GitHub",
      username: "preethika",
      profile_url: "https://github.com",
      icon: "github",
      stats: { repos: "20+" },
      order: 1,
      is_visible: true,
    },
  ]);

  // 11. Testimonials
  await seedIfEmpty("testimonials", [
    {
      name: "Ananya S.",
      role: "Product Designer",
      company: "Tech Innovations Lab",
      message:
        "Preethika has a great eye for detail and turns complex product ideas into smooth, reliable web experiences.",
      rating: 5,
      status: "approved",
      is_visible: true,
    },
  ]);

  console.log("Done seeding!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
