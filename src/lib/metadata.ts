import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

const SITE_NAME = "Nikolman";

function formatTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export async function createPageMetadata(
  locale: string,
  namespace: string,
  route = ""
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const siteUrl = getSiteUrl();

  const title = formatTitle(t("meta.title"));
  const description = t("meta.description");

  const languages = Object.fromEntries(
    routing.locales.map((altLocale) => [
      altLocale,
      `${siteUrl}/${altLocale}${route}`,
    ])
  );

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}${route}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}${route}`,
      siteName: SITE_NAME,
      locale: locale === "ka" ? "ka_GE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
