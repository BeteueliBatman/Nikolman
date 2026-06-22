"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/session";
import {
  buildStoragePath,
  getPublicStorageUrl,
  validateImageFile,
  WEBSITE_MEDIA_BUCKET,
} from "@/lib/admin/storage";

export type UploadImageState = {
  error?: string;
  url?: string;
};

export async function uploadAdminImage(
  _prevState: UploadImageState | null,
  formData: FormData
): Promise<UploadImageState> {
  const session = await getAdminSession();

  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const folder = String(formData.get("folder") ?? "").trim();
  const file = formData.get("file");

  if (folder !== "projects" && folder !== "articles") {
    return { error: "Invalid upload folder." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file to upload." };
  }

  try {
    validateImageFile(file);
    const path = buildStoragePath(folder, file);
    const { error } = await session.supabase.storage
      .from(WEBSITE_MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      return { error: "Image upload failed. Please try again." };
    }

    return { url: getPublicStorageUrl(path) };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "invalid_image_type") {
        return { error: "Only JPG, PNG, or WebP images are allowed." };
      }

      if (error.message === "image_too_large") {
        return { error: "Image must be 5 MB or smaller." };
      }
    }

    return { error: "Image upload failed. Please try again." };
  }
}

export async function revalidateAdminContent() {
  revalidatePath("/admin/projects");
  revalidatePath("/admin/articles");
  revalidatePath("/en/projects");
  revalidatePath("/ka/projects");
  revalidatePath("/en/newsroom");
  revalidatePath("/ka/newsroom");
}
