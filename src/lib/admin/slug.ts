export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function readSlug(formData: FormData, titleEn: string): string {
  const raw = String(formData.get("slug") ?? "").trim();
  const slug = slugify(raw || titleEn);

  if (!slug) {
    throw new Error("slug_required");
  }

  return slug;
}
