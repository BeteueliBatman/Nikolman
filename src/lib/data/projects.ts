import type { AppLocale } from "@/lib/env";
import { pickLocalized } from "@/lib/data/locale";
import type { ProjectRow } from "@/lib/db/types";
import { DB_TABLES } from "@/lib/db/tables";
import { getPublicServerClientIfConfigured } from "@/lib/supabase/server";

export type ProjectListItem = {
  key: string;
  image: string;
  categoryKey: string;
  year: string;
  metric: string;
  featured: boolean;
  title: string;
  description: string;
  status: string;
  location: string;
  scope: string;
};

function mapDatabaseProject(
  row: ProjectRow,
  locale: AppLocale
): ProjectListItem {
  return {
    key: row.slug,
    image: row.image_url,
    categoryKey: row.category_key,
    year: row.year,
    metric: row.metric,
    featured: row.featured,
    title: pickLocalized(row.title, locale),
    description: pickLocalized(row.description, locale),
    status: pickLocalized(row.project_status, locale),
    location: pickLocalized(row.location, locale),
    scope: pickLocalized(row.scope, locale),
  };
}

function isProjectRow(row: unknown): row is ProjectRow {
  if (!row || typeof row !== "object") {
    return false;
  }

  const record = row as Record<string, unknown>;
  return (
    typeof record.slug === "string" &&
    typeof record.image_url === "string" &&
    typeof record.title === "object" &&
    record.title !== null
  );
}

export async function getProjects(locale: AppLocale): Promise<ProjectListItem[]> {
  const supabase = getPublicServerClientIfConfigured();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB_TABLES.projects)
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  const rows = (data as unknown[]).filter(isProjectRow);
  return rows.map((row) => mapDatabaseProject(row, locale));
}
