import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl, localizedRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return localizedRoutes.flatMap((route) =>
    routing.locales.map((locale) => {
      const languages = Object.fromEntries(
        routing.locales.map((altLocale) => [
          altLocale,
          `${siteUrl}/${altLocale}${route}`,
        ])
      );
      languages["x-default"] = `${siteUrl}/ka${route}`;

      return {
        url: `${siteUrl}/${locale}${route}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
        alternates: { languages },
      };
    })
  );
}
