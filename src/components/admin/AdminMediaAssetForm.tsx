"use client";

import { useActionState, useCallback, useState } from "react";
import Link from "next/link";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import AdminLocaleField from "@/components/admin/AdminLocaleField";
import AdminMediaFileUploader, {
  type MediaUploadValue,
} from "@/components/admin/AdminMediaFileUploader";
import {
  deleteMediaAsset,
  saveMediaAsset,
  type MediaAssetFormState,
} from "@/lib/admin/media-assets";
import type { MediaAssetRow } from "@/lib/db/types";

type AdminMediaAssetFormProps = {
  asset?: MediaAssetRow | null;
};

function buildInitialUpload(asset?: MediaAssetRow | null): MediaUploadValue | null {
  if (!asset?.file_url || !asset.file_meta) {
    return null;
  }

  let fileName = "Uploaded file";

  try {
    const pathname = new URL(asset.file_url, "https://nikolman.local").pathname;
    fileName = pathname.split("/").filter(Boolean).at(-1) ?? fileName;
  } catch {
    // Keep fallback file name.
  }

  return {
    fileUrl: asset.file_url,
    fileMeta: asset.file_meta,
    mediaType: asset.media_type,
    fileName,
  };
}

export default function AdminMediaAssetForm({ asset }: AdminMediaAssetFormProps) {
  const [upload, setUpload] = useState<MediaUploadValue | null>(() =>
    buildInitialUpload(asset)
  );
  const [state, formAction, pending] = useActionState<
    MediaAssetFormState | null,
    FormData
  >(saveMediaAsset, null);

  const handleUploadChange = useCallback((value: MediaUploadValue | null) => {
    setUpload(value);
  }, []);

  const canSave = Boolean(upload?.fileUrl && upload.fileMeta) && !pending;

  return (
    <div className="admin-form-stack">
      <AdminMediaFileUploader
        initialValue={buildInitialUpload(asset)}
        onChange={handleUploadChange}
      />

      <form className="admin-form" action={formAction}>
        {asset?.id ? <input type="hidden" name="id" value={asset.id} /> : null}
        <input type="hidden" name="file_url" value={upload?.fileUrl ?? ""} />
        <input type="hidden" name="file_meta" value={upload?.fileMeta ?? ""} />
        <input
          type="hidden"
          name="media_type"
          value={upload?.mediaType ?? "image"}
        />

        {state?.error ? (
          <p className="admin-login__alert" role="alert">
            {state.error}
          </p>
        ) : null}

        <AdminLocaleField
          label="Title"
          name="title"
          defaultEn={asset?.title.en ?? ""}
          defaultKa={asset?.title.ka ?? ""}
          required
        />

        <div className="admin-form__grid">
          <label className="admin-field">
            <span>Sort order</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={asset?.sort_order ?? 0}
              min={0}
            />
          </label>

          <label className="admin-field">
            <span>Status</span>
            <select
              name="status"
              defaultValue={asset?.status ?? "draft"}
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <div className="admin-form__actions">
          <button
            className="button button--primary"
            type="submit"
            disabled={!canSave}
          >
            {pending
              ? "Saving..."
              : asset
                ? "Save changes"
                : "Create media asset"}
          </button>
          <Link href="/admin/articles/media" className="button button--ghost">
            Cancel
          </Link>
          {asset?.id ? (
            <AdminDeleteButton
              id={asset.id}
              action={deleteMediaAsset}
              label="media asset"
            />
          ) : null}
        </div>

        {!canSave ? (
          <p className="admin-form-note">
            Upload a file before saving. Published items appear on the newsroom
            media center.
          </p>
        ) : null}
      </form>
    </div>
  );
}
