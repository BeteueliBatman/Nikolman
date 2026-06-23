import type { AppLocale } from "@/lib/env";
import { pickLocalized } from "@/lib/data/locale";
import { isPublicFileUrl, normalizePublicFileUrl } from "@/lib/media/urls";
import type { MediaAssetRow } from "@/lib/db/types";
import { DB_TABLES } from "@/lib/db/tables";
import { getPublicServerClientIfConfigured } from "@/lib/supabase/server";

export type MediaAssetListItem = {
  id: string;
  type: "image" | "document";
  fileUrl: string;
  meta: string;
  title: string;
};

function mapDatabaseMediaAsset(
  row: MediaAssetRow,
  locale: AppLocale
): MediaAssetListItem {
  return {
    id: row.id,
    type: row.media_type,
    fileUrl: normalizePublicFileUrl(row.file_url),
    meta: row.file_meta,
    title: pickLocalized(row.title, locale),
  };
}

function isMediaAssetRow(row: unknown): row is MediaAssetRow {
  if (!row || typeof row !== "object") {
    return false;
  }

  const record = row as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.file_url === "string" &&
    typeof record.title === "object" &&
    record.title !== null
  );
}

export async function getMediaAssets(
  locale: AppLocale
): Promise<MediaAssetListItem[]> {
  const supabase = getPublicServerClientIfConfigured();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(DB_TABLES.mediaAssets)
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  const rows = (data as unknown[]).filter(isMediaAssetRow);
  return rows
    .filter((row) => isPublicFileUrl(row.file_url))
    .map((row) => mapDatabaseMediaAsset(row, locale));
}
