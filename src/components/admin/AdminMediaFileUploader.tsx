"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { uploadAdminImage, type UploadImageState } from "@/lib/admin/upload";
import { resolveFileMimeType } from "@/lib/admin/storage";
import type { MediaAssetType } from "@/lib/db/types";

export type MediaUploadValue = {
  fileUrl: string;
  fileMeta: string;
  mediaType: MediaAssetType;
  fileName: string;
};

type AdminMediaFileUploaderProps = {
  initialValue?: MediaUploadValue | null;
  onChange: (value: MediaUploadValue | null) => void;
};

function fileNameFromUrl(url: string): string {
  if (!url) {
    return "";
  }

  try {
    const pathname = new URL(url, "https://nikolman.local").pathname;
    return pathname.split("/").filter(Boolean).at(-1) ?? "Uploaded file";
  } catch {
    return "Uploaded file";
  }
}

function mediaTypeLabel(type: MediaAssetType): string {
  return type === "image" ? "Image" : "Document";
}

export default function AdminMediaFileUploader({
  initialValue = null,
  onChange,
}: AdminMediaFileUploaderProps) {
  const [upload, setUpload] = useState<MediaUploadValue | null>(initialValue);
  const [state, formAction, pending] = useActionState<
    UploadImageState | null,
    FormData
  >(uploadAdminImage, null);
  const [, startUpload] = useTransition();
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!state?.url || !state.fileMeta || !state.mediaType) {
      return;
    }

    const nextValue: MediaUploadValue = {
      fileUrl: state.url,
      fileMeta: state.fileMeta,
      mediaType: state.mediaType,
      fileName: fileNameFromUrl(state.url),
    };

    setUpload(nextValue);
    onChangeRef.current(nextValue);
  }, [state]);

  function handleFileChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setUpload({
      fileUrl: "",
      fileMeta: "",
      mediaType: resolveFileMimeType(file).startsWith("image/")
        ? "image"
        : "document",
      fileName: file.name,
    });
    onChangeRef.current(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "media-center");
    startUpload(() => {
      formAction(formData);
    });
  }

  const previewName = upload?.fileName || "file";
  const isReady = Boolean(upload?.fileUrl && upload.fileMeta);

  return (
    <div className="admin-image-field">
      <div className="admin-upload-picker">
        <label className="admin-upload-picker__button">
          <span>{isReady ? "Replace file" : "Choose file"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf,application/zip,application/x-zip-compressed"
            disabled={pending}
            onChange={(event) => handleFileChange(event.target.files?.[0])}
          />
        </label>

        <p className="admin-form-note">
          JPG, PNG, WebP up to 20 MB · PDF or ZIP up to 20 MB
        </p>
      </div>

      {pending ? (
        <p className="admin-upload-status admin-upload-status--pending">
          Uploading {previewName}...
        </p>
      ) : null}

      {state?.error ? (
        <p className="admin-login__alert" role="alert">
          {state.error}
        </p>
      ) : null}

      {isReady && upload ? (
        <div className="admin-upload-preview">
          {upload.mediaType === "image" ? (
            <div className="admin-upload-preview__thumb">
              <img src={upload.fileUrl} alt={upload.fileName} />
            </div>
          ) : (
            <div className="admin-upload-preview__doc" aria-hidden="true">
              <span>{upload.fileMeta.split(" ")[0]}</span>
            </div>
          )}

          <div className="admin-upload-preview__copy">
            <strong>{upload.fileName}</strong>
            <p>
              {mediaTypeLabel(upload.mediaType)} · {upload.fileMeta}
            </p>
            <p className="admin-form-note">Ready to save.</p>
          </div>
        </div>
      ) : (
        <p className="admin-upload-status">
          Choose a file first. Everything else is filled in automatically.
        </p>
      )}
    </div>
  );
}
