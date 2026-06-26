const WEBSITE_MEDIA_BUCKET = "website-media";
const WEBSITE_MEDIA_PUBLIC_PATH = `/storage/v1/object/public/${WEBSITE_MEDIA_BUCKET}/`;

function isTrustedStorageOrigin(url: URL): boolean {
  const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (configuredSupabaseUrl) {
    try {
      const configuredOrigin = new URL(configuredSupabaseUrl).origin;
      if (url.origin === configuredOrigin) {
        return true;
      }
    } catch {
      // Ignore malformed env values and fallback to suffix validation.
    }
  }

  return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
}

export function normalizePublicFileUrl(value: string): string {
  const cleaned = value.trim().replace(/^["']+|["']+$/g, "");

  if (cleaned.startsWith("/media/")) {
    return cleaned;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    throw new Error("invalid_file_url");
  }

  if (!parsed.pathname.startsWith(WEBSITE_MEDIA_PUBLIC_PATH)) {
    throw new Error("invalid_file_url");
  }

  if (!isTrustedStorageOrigin(parsed)) {
    throw new Error("invalid_file_url");
  }

  return parsed.toString();
}

export function isPublicFileUrl(value: string): boolean {
  try {
    normalizePublicFileUrl(value);
    return true;
  } catch {
    return false;
  }
}
