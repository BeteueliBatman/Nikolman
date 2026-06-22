/**
 * Seeds Supabase with current static Nikolman content.
 * Usage: node scripts/seed-database.mjs
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DB_TABLES = {
  projects: "website_projects",
  articles: "website_articles",
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const en = loadJson(join(root, "messages/en.json"));
const ka = loadJson(join(root, "messages/ka.json"));

const projectItems = [
  {
    slug: "industrial-plant",
    key: "industrialPlant",
    image: "/media/projects/industrial-plant-shell.jpg",
    category_key: "industrial",
    year: "2026",
    metric: "12,400 m²",
    featured: true,
    sort_order: 1,
  },
  {
    slug: "residential-block",
    key: "residentialBlock",
    image: "/media/projects/residential-precast-block.jpg",
    category_key: "residential",
    year: "2025",
    metric: "84 units",
    featured: false,
    sort_order: 2,
  },
  {
    slug: "commercial-facade",
    key: "commercialFacade",
    image: "/media/projects/commercial-wall-panels.jpg",
    category_key: "commercial",
    year: "2025",
    metric: "1,860 panels",
    featured: false,
    sort_order: 3,
  },
  {
    slug: "medical-extension",
    key: "medicalExtension",
    image: "/media/projects/medical-facility-extension.jpg",
    category_key: "institutional",
    year: "2024",
    metric: "3 phases",
    featured: false,
    sort_order: 4,
  },
];

const articleItems = [
  {
    slug: "project-archive-launch",
    key: "projectArchiveLaunch",
    image: "/media/newsroom/completed-projects-archive.jpg",
    category_key: "projectNews",
    company_key: "nikolmanProjects",
    published_at: "2026-06-03",
  },
  {
    slug: "factory-quality-process",
    key: "factoryQualityProcess",
    image: "/media/newsroom/factory-quality-process.jpg",
    category_key: "innovation",
    company_key: "nikolmanConcrete",
    published_at: "2026-05-22",
  },
  {
    slug: "team-growth",
    key: "teamGrowth",
    image: "/media/newsroom/nikolman-team-growth.jpg",
    category_key: "companyNews",
    company_key: "nikolmanGroup",
    published_at: "2026-04-18",
  },
  {
    slug: "precast-delivery-milestone",
    key: "precastDeliveryMilestone",
    image: "/media/newsroom/precast-delivery-milestone.jpg",
    category_key: "pressRelease",
    company_key: "nikolmanProjects",
    published_at: "2026-03-29",
  },
  {
    slug: "modular-planning-guide",
    key: "modularPlanningGuide",
    image: "/media/newsroom/modular-planning-guide.jpg",
    category_key: "innovation",
    company_key: "nikolmanConcrete",
    published_at: "2025-12-11",
  },
  {
    slug: "wall-panel-program",
    key: "wallPanelProgram",
    image: "/media/newsroom/wall-panel-program.jpg",
    category_key: "projectNews",
    company_key: "nikolmanProjects",
    published_at: "2025-09-04",
  },
];

function localizedPair(namespace, key, field) {
  return {
    en: en[namespace].items[key][field],
    ka: ka[namespace].items[key][field],
  };
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const projects = projectItems.map((item) => ({
  slug: item.slug,
  image_url: item.image,
  category_key: item.category_key,
  year: item.year,
  metric: item.metric,
  featured: item.featured,
  sort_order: item.sort_order,
  status: "published",
  title: localizedPair("projects", item.key, "title"),
  description: localizedPair("projects", item.key, "description"),
  project_status: localizedPair("projects", item.key, "status"),
  location: localizedPair("projects", item.key, "location"),
  scope: localizedPair("projects", item.key, "scope"),
}));

const articles = articleItems.map((item) => ({
  slug: item.slug,
  image_url: item.image,
  category_key: item.category_key,
  company_key: item.company_key,
  published_at: item.published_at,
  status: "published",
  title: localizedPair("newsroom", item.key, "title"),
  summary: localizedPair("newsroom", item.key, "summary"),
  body: localizedPair("newsroom", item.key, "body"),
}));

const { error: projectError } = await supabase
  .from(DB_TABLES.projects)
  .upsert(projects, { onConflict: "slug" });

if (projectError) {
  console.error("Project seed failed:", projectError.message);
  process.exit(1);
}

const { error: articleError } = await supabase
  .from(DB_TABLES.articles)
  .upsert(articles, { onConflict: "slug" });

if (articleError) {
  console.error("Article seed failed:", articleError.message);
  process.exit(1);
}

console.log(
  `Seeded ${projects.length} projects and ${articles.length} articles.`
);
