"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadAdminImage, type UploadImageState } from "@/lib/admin/upload";

type AdminImageUploaderProps = {
  folder: "projects" | "articles";
  defaultUrl?: string;
};

export default function AdminImageUploader({
  folder,
  defaultUrl = "",
}: AdminImageUploaderProps) {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState<
    UploadImageState | null,
    FormData
  >(uploadAdminImage, null);

  useEffect(() => {
    if (state?.url && urlInputRef.current) {
      urlInputRef.current.value = state.url;
    }
  }, [state?.url]);

  return (
    <div className="admin-image-field">
      <label className="admin-field">
        <span>Hero image</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            formAction(formData);
          }}
        />
      </label>

      {pending ? <p className="admin-form-note">Uploading image...</p> : null}
      {state?.error ? (
        <p className="admin-login__alert" role="alert">
          {state.error}
        </p>
      ) : null}

      <label className="admin-field">
        <span>Image URL</span>
        <input
          ref={urlInputRef}
          type="text"
          name="image_url"
          defaultValue={defaultUrl}
          required
          placeholder="/media/projects/example.jpg"
        />
      </label>

      <p className="admin-form-note">
        Upload JPG, PNG, or WebP up to 5 MB, or paste an existing `/media/...`
        path.
      </p>
    </div>
  );
}
