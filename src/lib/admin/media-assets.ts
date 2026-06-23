"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  formatActionError,
  readFileUrl,
  readLocalizedField,
  readRequiredText,
} from "@/lib/admin/form";
import { getAdminSession } from "@/lib/admin/session";
import {
  parseStorageObjectPath,
  WEBSITE_MEDIA_BUCKET,
} from "@/lib/admin/storage";
import { DB_TABLES } from "@/lib/db/tables";
import type { MediaAssetType, PublishStatus } from "@/lib/db/types";

export type MediaAssetFormState = {
  error?: string;
};

function readMediaType(value: FormDataEntryValue | null): MediaAssetType {
  const mediaType = String(value ?? "");

  if (mediaType !== "image" && mediaType !== "document") {
    throw new Error("missing_media_type");
  }

  return mediaType;
}

function readStatus(value: FormDataEntryValue | null): PublishStatus {
  const status = String(value ?? "");

  if (status !== "draft" && status !== "published") {
    throw new Error("missing_status");
  }

  return status;
}

function readSortOrder(formData: FormData): number {
  const raw = String(formData.get("sort_order") ?? "0").trim();
  const parsed = Number.parseInt(raw, 10);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return parsed;
}

function buildMediaAssetPayload(formData: FormData) {
  return {
    media_type: readMediaType(formData.get("media_type")),
    file_url: readFileUrl(formData),
    file_meta: readRequiredText(formData, "file_meta"),
    sort_order: readSortOrder(formData),
    status: readStatus(formData.get("status")),
    title: readLocalizedField(formData, "title"),
  };
}

async function deleteStorageFileIfManaged(
  session: NonNullable<Awaited<ReturnType<typeof getAdminSession>>>,
  fileUrl: string
) {
  const path = parseStorageObjectPath(fileUrl);

  if (!path) {
    return;
  }

  await session.supabase.storage.from(WEBSITE_MEDIA_BUCKET).remove([path]);
}

function revalidateMediaPaths() {
  revalidatePath("/admin/articles/media");
  revalidatePath("/en/newsroom");
  revalidatePath("/ka/newsroom");
}

export async function saveMediaAsset(
  _prevState: MediaAssetFormState | null,
  formData: FormData
): Promise<MediaAssetFormState | null> {
  const session = await getAdminSession();

  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const assetId = String(formData.get("id") ?? "").trim();

  let payload;

  try {
    payload = buildMediaAssetPayload(formData);
  } catch (error) {
    return { error: formatActionError(error) };
  }

  const query = assetId
    ? session.supabase
        .from(DB_TABLES.mediaAssets)
        .update(payload)
        .eq("id", assetId)
    : session.supabase.from(DB_TABLES.mediaAssets).insert(payload);

  const { error } = await query;

  if (error) {
    return { error: `Could not save the media asset: ${error.message}` };
  }

  revalidateMediaPaths();
  redirect("/admin/articles/media");
}

export async function deleteMediaAsset(formData: FormData) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const assetId = String(formData.get("id") ?? "").trim();

  if (!assetId) {
    redirect("/admin/articles/media");
  }

  const { data } = await session.supabase
    .from(DB_TABLES.mediaAssets)
    .select("file_url")
    .eq("id", assetId)
    .maybeSingle();

  await session.supabase
    .from(DB_TABLES.mediaAssets)
    .delete()
    .eq("id", assetId);

  if (data?.file_url) {
    await deleteStorageFileIfManaged(session, data.file_url);
  }

  revalidateMediaPaths();
  redirect("/admin/articles/media");
}

export async function getAdminMediaAssets() {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const { data } = await session.supabase
    .from(DB_TABLES.mediaAssets)
    .select("id, title, media_type, file_meta, status, sort_order, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAdminMediaAsset(id: string) {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  const { data } = await session.supabase
    .from(DB_TABLES.mediaAssets)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
}
