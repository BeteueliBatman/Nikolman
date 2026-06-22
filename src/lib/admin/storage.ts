export const WEBSITE_MEDIA_BUCKET = "website-media";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("invalid_image_type");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("image_too_large");
  }
}

export function buildStoragePath(folder: string, file: File): string {
  const extension = file.type === "image/png"
    ? "png"
    : file.type === "image/webp"
      ? "webp"
      : "jpg";

  return `${folder}/${crypto.randomUUID()}.${extension}`;
}

export function getPublicStorageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error("supabase_not_configured");
  }

  return `${baseUrl}/storage/v1/object/public/${WEBSITE_MEDIA_BUCKET}/${path}`;
}
