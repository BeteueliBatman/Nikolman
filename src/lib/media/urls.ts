export function normalizePublicFileUrl(value: string): string {
  const cleaned = value.trim().replace(/^["']+|["']+$/g, "");

  if (!/^https?:\/\//i.test(cleaned) && !cleaned.startsWith("/media/")) {
    throw new Error("invalid_file_url");
  }

  return cleaned;
}

export function isPublicFileUrl(value: string): boolean {
  try {
    normalizePublicFileUrl(value);
    return true;
  } catch {
    return false;
  }
}
