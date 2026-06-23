export const WEBSITE_MEDIA_BUCKET = "website-media";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_MEDIA_CENTER_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024;

export type UploadFolder = "projects" | "articles" | "media-center";

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("invalid_image_type");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("image_too_large");
  }
}

function fileLabelFromMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "PNG";
    case "image/webp":
      return "WEBP";
    case "application/pdf":
      return "PDF";
    case "application/zip":
    case "application/x-zip-compressed":
      return "ZIP";
    default:
      return "JPG";
  }
}

function fileLabel(file: File): string {
  return fileLabelFromMime(resolveFileMimeType(file));
}

export function resolveFileMimeType(file: File): string {
  if (file.type) {
    return file.type;
  }

  const name = file.name.toLowerCase();

  if (name.endsWith(".png")) {
    return "image/png";
  }

  if (name.endsWith(".webp")) {
    return "image/webp";
  }

  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (name.endsWith(".pdf")) {
    return "application/pdf";
  }

  if (name.endsWith(".zip")) {
    return "application/zip";
  }

  return "";
}

export function validateMediaCenterFile(file: File) {
  const mime = resolveFileMimeType(file);
  const isImage = ALLOWED_IMAGE_TYPES.has(mime);
  const isDocument = ALLOWED_DOCUMENT_TYPES.has(mime);

  if (!isImage && !isDocument) {
    throw new Error("invalid_media_type");
  }

  if (isImage && file.size > MAX_MEDIA_CENTER_IMAGE_BYTES) {
    throw new Error("media_image_too_large");
  }

  if (isDocument && file.size > MAX_DOCUMENT_BYTES) {
    throw new Error("document_too_large");
  }
}

export function buildStoragePath(folder: UploadFolder, file: File): string {
  const extension = extensionForMime(resolveFileMimeType(file));
  return `${folder}/${crypto.randomUUID()}.${extension}`;
}

function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    case "application/zip":
    case "application/x-zip-compressed":
      return "zip";
    default:
      return "jpg";
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatFileMeta(file: File): string {
  const label = fileLabel(file);
  return `${label} · ${formatFileSize(file.size)}`;
}

export function getPublicStorageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!baseUrl) {
    throw new Error("supabase_not_configured");
  }

  return `${baseUrl}/storage/v1/object/public/${WEBSITE_MEDIA_BUCKET}/${path}`;
}

export function parseStorageObjectPath(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${WEBSITE_MEDIA_BUCKET}/`;
  const index = publicUrl.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return publicUrl.slice(index + marker.length);
}

export function inferMediaTypeFromFile(file: File): "image" | "document" {
  return ALLOWED_IMAGE_TYPES.has(resolveFileMimeType(file)) ? "image" : "document";
}
