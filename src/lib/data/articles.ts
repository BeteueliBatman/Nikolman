import type { AppLocale } from "@/lib/env";
import { pickLocalized } from "@/lib/data/locale";
import type { ArticleRow } from "@/lib/db/types";
import { DB_TABLES } from "@/lib/db/tables";
import { getPublicServerClientIfConfigured } from "@/lib/supabase/server";

export type ArticleListItem = {
  key: string;
  image: string;
  categoryKey: string;
  companyKey: string;
  date: string;
  title: string;
  summary: string;
  body: string;
};

function mapDatabaseArticle(
  row: ArticleRow,
  locale: AppLocale
): ArticleListItem {
  return {
    key: row.slug,
    image: row.image_url,
    categoryKey: row.category_key,
    companyKey: row.company_key,
    date: row.published_at.slice(0, 10),
    title: pickLocalized(row.title, locale),
    summary: pickLocalized(row.summary, locale),
    body: pickLocalized(row.body, locale),
  };
}

function isArticleRow(row: unknown): row is ArticleRow {
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

export async function getArticles(
  locale: AppLocale
): Promise<ArticleListItem[]> {
  const supabase = getPublicServerClientIfConfigured();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB_TABLES.articles)
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  const rows = (data as unknown[]).filter(isArticleRow);
  return rows.map((row) => mapDatabaseArticle(row, locale));
}
