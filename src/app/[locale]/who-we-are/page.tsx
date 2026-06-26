import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import { navPageHeroImages } from "@/lib/pageHero";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "whoWeAre", "/who-we-are");
}

export default async function WhoWeArePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("whoWeAre");

  const values = [
    {
      title: t("values.precision.title"),
      description: t("values.precision.description"),
    },
    {
      title: t("values.reliability.title"),
      description: t("values.reliability.description"),
    },
    {
      title: t("values.innovation.title"),
      description: t("values.innovation.description"),
    },
    {
      title: t("values.partnership.title"),
      description: t("values.partnership.description"),
    },
  ];

  const standards = t.raw("quality.standards") as string[];

  return (
    <>
      <PageHero image={navPageHeroImages.whoWeAre} accent="left">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1>{t("hero.title")}</h1>
        <p className="section-lead">{t("hero.description")}</p>
      </PageHero>

      <section className="section">
        <div className="section-inner story-grid">
          <div>
            <span className="eyebrow">{t("story.eyebrow")}</span>
            <h2 className="section-title">{t("story.title")}</h2>
          </div>
          <div className="story-copy">
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
            <p>{t("story.p3")}</p>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="section-inner story-grid">
          <div className="statement-panel">
            <span>{t("mission.label")}</span>
            <p>{t("mission.text")}</p>
          </div>
          <div className="statement-panel statement-panel--light">
            <span>{t("vision.label")}</span>
            <p>{t("vision.text")}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">{t("values.eyebrow")}</span>
            <h2 className="section-title">{t("values.title")}</h2>
          </div>
          <div className="values-grid">
            {values.map((value) => (
              <article className="value-card" key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="section-inner split-grid">
          <div>
            <span className="eyebrow">{t("quality.eyebrow")}</span>
            <h2 className="section-title">{t("quality.title")}</h2>
            <p className="section-lead">{t("quality.description")}</p>
          </div>
          <ul className="check-list">
            {standards.map((standard) => (
              <li key={standard}>{standard}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
