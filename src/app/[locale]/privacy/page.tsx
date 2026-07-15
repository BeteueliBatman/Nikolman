import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import { Link } from "@/i18n/navigation";
import { createPageMetadata } from "@/lib/metadata";
import { navPageHeroImages } from "@/lib/pageHero";

const sectionKeys = [
  "collection",
  "purposes",
  "legalBases",
  "sharing",
  "retention",
  "rights",
  "security",
  "cookies",
  "changes",
] as const;

const sectionKeysWithItems = new Set<string>([
  "collection",
  "purposes",
  "retention",
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "privacy", "/privacy");
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <>
      <PageHero image={navPageHeroImages.whoWeAre} accent="right">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1>{t("hero.title")}</h1>
        <p className="section-lead">{t("hero.description")}</p>
      </PageHero>

      <section className="section legal-page">
        <div className="section-inner legal-page__layout">
          <aside className="legal-page__summary">
            <span className="eyebrow">{t("summary.eyebrow")}</span>
            <h2>{t("summary.title")}</h2>
            <p>{t("summary.description")}</p>
            <dl>
              <div>
                <dt>{t("summary.controllerLabel")}</dt>
                <dd>Nikolman</dd>
              </div>
              <div>
                <dt>{t("summary.updatedLabel")}</dt>
                <dd>{t("summary.updatedValue")}</dd>
              </div>
            </dl>
            <Link className="button button--secondary" href="/contact">
              {t("summary.contactButton")}
            </Link>
          </aside>

          <article className="legal-page__content">
            <div className="legal-page__intro">
              <p>{t("intro.p1")}</p>
              <p>{t("intro.p2")}</p>
            </div>

            {sectionKeys.map((key) => {
              const items = sectionKeysWithItems.has(key)
                ? (t.raw(`sections.${key}.items`) as string[])
                : [];

              return (
                <section className="legal-section" key={key}>
                  <h2>{t(`sections.${key}.title`)}</h2>
                  <p>{t(`sections.${key}.body`)}</p>
                  {Array.isArray(items) && items.length > 0 ? (
                    <ul>
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}

            <section className="legal-section legal-section--contact">
              <h2>{t("contact.title")}</h2>
              <p>{t("contact.body")}</p>
              <Link href="/contact">{t("contact.link")}</Link>
              <a href="tel:+995599446464">+995 599 44 64 64</a>
            </section>
          </article>
        </div>
      </section>
    </>
  );
}
