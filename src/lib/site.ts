const FALLBACK_SITE_URL = "https://nikolman.vercel.app";

export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);

  const raw = fromEnv ?? FALLBACK_SITE_URL;

  return raw.replace(/\/+$/, "");
}

export const localizedRoutes = [
  "",
  "/prefab-structures",
  "/projects",
  "/newsroom",
  "/who-we-are",
  "/contact",
] as const;
