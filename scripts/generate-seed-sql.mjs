import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sqlString(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

function localizedPair(namespace, key, field) {
  const en = loadJson(join(root, "messages/en.json"));
  const ka = loadJson(join(root, "messages/ka.json"));

  return JSON.stringify({
    en: en[namespace].items[key][field],
    ka: ka[namespace].items[key][field],
  }).replace(/'/g, "''");
}

const projectItems = [
  ["industrial-plant", "industrialPlant", "/media/projects/industrial-plant-shell.jpg", "industrial", "2026", "12,400 m²", true, 1],
  ["residential-block", "residentialBlock", "/media/projects/residential-precast-block.jpg", "residential", "2025", "84 units", false, 2],
  ["commercial-facade", "commercialFacade", "/media/projects/commercial-wall-panels.jpg", "commercial", "2025", "1,860 panels", false, 3],
  ["medical-extension", "medicalExtension", "/media/projects/medical-facility-extension.jpg", "institutional", "2024", "3 phases", false, 4],
];

const articleItems = [
  ["project-archive-launch", "projectArchiveLaunch", "/media/newsroom/completed-projects-archive.jpg", "projectNews", "nikolmanProjects", "2026-06-03"],
  ["factory-quality-process", "factoryQualityProcess", "/media/newsroom/factory-quality-process.jpg", "innovation", "nikolmanConcrete", "2026-05-22"],
  ["team-growth", "teamGrowth", "/media/newsroom/nikolman-team-growth.jpg", "companyNews", "nikolmanGroup", "2026-04-18"],
  ["precast-delivery-milestone", "precastDeliveryMilestone", "/media/newsroom/precast-delivery-milestone.jpg", "pressRelease", "nikolmanProjects", "2026-03-29"],
  ["modular-planning-guide", "modularPlanningGuide", "/media/newsroom/modular-planning-guide.jpg", "innovation", "nikolmanConcrete", "2025-12-11"],
  ["wall-panel-program", "wallPanelProgram", "/media/newsroom/wall-panel-program.jpg", "projectNews", "nikolmanProjects", "2025-09-04"],
];

const statements = [];

for (const [slug, key, image, category, year, metric, featured, sortOrder] of projectItems) {
  const title = localizedPair("projects", key, "title");
  const description = localizedPair("projects", key, "description");
  const projectStatus = localizedPair("projects", key, "status");
  const location = localizedPair("projects", key, "location");
  const scope = localizedPair("projects", key, "scope");

  statements.push(`
insert into public.website_projects (
  slug, image_url, category_key, year, metric, featured, sort_order, status,
  title, description, project_status, location, scope
) values (
  ${sqlString(slug)}, ${sqlString(image)}, ${sqlString(category)}, ${sqlString(year)}, ${sqlString(metric)}, ${featured}, ${sortOrder}, 'published',
  '${title}'::jsonb,
  '${description}'::jsonb,
  '${projectStatus}'::jsonb,
  '${location}'::jsonb,
  '${scope}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  year = excluded.year,
  metric = excluded.metric,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  status = excluded.status,
  title = excluded.title,
  description = excluded.description,
  project_status = excluded.project_status,
  location = excluded.location,
  scope = excluded.scope;
`);
}

for (const [slug, key, image, category, company, publishedAt] of articleItems) {
  const title = localizedPair("newsroom", key, "title");
  const summary = localizedPair("newsroom", key, "summary");
  const body = localizedPair("newsroom", key, "body");

  statements.push(`
insert into public.website_articles (
  slug, image_url, category_key, company_key, published_at, status, title, summary, body
) values (
  ${sqlString(slug)}, ${sqlString(image)}, ${sqlString(category)}, ${sqlString(company)}, ${sqlString(publishedAt)}, 'published',
  '${title}'::jsonb,
  '${summary}'::jsonb,
  '${body}'::jsonb
)
on conflict (slug) do update set
  image_url = excluded.image_url,
  category_key = excluded.category_key,
  company_key = excluded.company_key,
  published_at = excluded.published_at,
  status = excluded.status,
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body;
`);
}

const sql = statements.join("\n");
const outputPath = join(root, "supabase", "seed-generated.sql");
writeFileSync(outputPath, sql, "utf8");
console.log(`Wrote ${statements.length} statements to ${outputPath}`);
