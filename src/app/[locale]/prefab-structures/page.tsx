import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildingTypeKeys, prefabCategoryKeys } from "@/lib/siteContent";

function pageHeroStyle(image: string): CSSProperties {
  return { "--page-image": `url(${image})` } as CSSProperties;
}

export default async function PrefabStructuresPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("prefab");

  const categories = prefabCategoryKeys.map((key) => ({
    key,
    title: t(`${key}.title`),
    subtitle: t(`${key}.subtitle`),
    description: t(`${key}.description`),
    items: t.raw(`${key}.items`) as string[],
  }));

  const buildingTypes = buildingTypeKeys.map((key) => ({
    key,
    title: t(`buildingTypes.${key}.title`),
    description: t(`buildingTypes.${key}.description`),
    highlights: [
      t(`buildingTypes.${key}.h1`),
      t(`buildingTypes.${key}.h2`),
      t(`buildingTypes.${key}.h3`),
    ],
  }));

  return (
    <>
      <section
        className="page-hero"
        style={pageHeroStyle("/media/projects/precast-structure-site.jpg")}
      >
        {/* TODO: Replace /media/projects/precast-structure-site.jpg with an uploaded Nikolman project image. */}
        <div className="page-hero__inner">
          <span className="eyebrow">{t("hero.eyebrow")}</span>
          <h1>{t("hero.title")}</h1>
          <p className="section-lead">{t("hero.description")}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">{t("categories.eyebrow")}</span>
            <h2 className="section-title">{t("categories.title")}</h2>
            <p className="section-lead">{t("categories.description")}</p>
          </div>

          <div className="category-stack">
            {categories.map((category) => (
              <article className="category-row" key={category.key}>
                <div className="category-row__copy">
                  <span className="eyebrow">{category.subtitle}</span>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <p style={{ marginTop: 28 }}>
                    <Link href="/contact" className="button button--primary">
                      {t("requestSpecs")}
                    </Link>
                  </p>
                </div>
                <div className="category-row__details">
                  <h4>{t("includedElements")}</h4>
                  <ul className="check-list">
                    {category.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="section-inner">
          <div className="section-header section-header--wide">
            <span className="eyebrow">{t("buildingTypes.eyebrow")}</span>
            <h2 className="section-title">{t("buildingTypes.title")}</h2>
            <p className="section-lead">{t("buildingTypes.description")}</p>
          </div>

          <div className="application-grid">
            {buildingTypes.map((type) => (
              <article className="application-card" key={type.key}>
                <h3>{type.title}</h3>
                <p>{type.description}</p>
                <ul className="check-list">
                  {type.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band__inner">
          <div>
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.description")}</p>
          </div>
          <Link href="/contact" className="button button--light">
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
