import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductGallery } from "@/components/ProductGallery";
import { Link } from "@/i18n/navigation";
import { createPageMetadata } from "@/lib/metadata";
import { productCatalog } from "@/lib/siteContent";

function panelImageStyle(image: string): CSSProperties {
  return { "--panel-image": `url(${image})` } as CSSProperties;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const common = await getTranslations("common");

  const stats = [
    { value: t("stats.yearsValue"), label: t("stats.yearsLabel") },
    { value: t("stats.projectsValue"), label: t("stats.projectsLabel") },
    { value: t("stats.engineersValue"), label: t("stats.engineersLabel") },
    { value: t("stats.qualityValue"), label: t("stats.qualityLabel") },
  ];

  const products = productCatalog.map((product) => ({
    ...product,
    anchor: `product-${product.key}`,
    title: t(`products.${product.key}.title`),
    description: t(`products.${product.key}.description`),
  }));
  const featuredProducts = products.slice(0, 3);
  const supportingProducts = products.slice(3);

  const whyItems = [
    {
      title: t("why.factoryPrecision.title"),
      body: t("why.factoryPrecision.body"),
    },
    {
      title: t("why.fasterConstruction.title"),
      body: t("why.fasterConstruction.body"),
    },
    {
      title: t("why.costEfficiency.title"),
      body: t("why.costEfficiency.body"),
    },
    {
      title: t("why.fullCycle.title"),
      body: t("why.fullCycle.body"),
    },
  ];

  return (
    <>
      <section className="hero">
        <video
          className="hero__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/media/products/precast-wall-panels.jpg"
          aria-hidden="true"
        >
          <source src="/media/hero/nikolman-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__accent" aria-hidden="true" />
        <div className="hero__content">
          <div className="hero__copy">
            <span className="eyebrow">{t("hero.eyebrow")}</span>
            <h1 className="hero__title">{t("hero.motto")}</h1>
            <p className="hero__text">{t("hero.description")}</p>
            <div className="hero__actions">
              <Link href="/projects" className="button button--primary">
                {t("hero.primaryCta")}
              </Link>
              <Link href="/contact" className="button button--ghost">
                {t("hero.secondaryCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label={common("statsAriaLabel")}>
        <div className="stats-strip__grid">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="stat__value">{stat.value}</div>
              <div className="stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section scroll-section" id="overview">
        <div className="section-inner split-grid">
          <div>
            <span className="eyebrow">{t("intro.eyebrow")}</span>
            <h2 className="section-title">{t("intro.title")}</h2>
            <p className="section-lead">{t("intro.description")}</p>
          </div>

          <div
            className="image-panel image-panel--logo"
            role="img"
            aria-label={common("logoAriaLabel")}
            style={panelImageStyle("/media/brand/nikolman-overview-logo.png")}
          />
        </div>
      </section>

      <section className="section section--soft scroll-section" id="products">
        <div className="section-inner">
          <div className="section-header section-header--wide">
            <span className="eyebrow">{t("products.eyebrow")}</span>
            <h2 className="section-title">{t("products.title")}</h2>
            <p className="section-lead">{t("products.description")}</p>
          </div>

          <div className="featured-products">
            {featuredProducts.map((product) => (
              <article
                className="featured-product scroll-section"
                id={product.anchor}
                key={product.key}
              >
                <ProductGallery
                  images={product.gallery ?? [product.image]}
                  label={product.title}
                  variant="featured"
                />
                <div className="featured-product__body">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <Link
                    href="/prefab-structures"
                    className="featured-product__link"
                  >
                    {t("products.explore")}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="supporting-products">
            {supportingProducts.map((product) => (
              <article
                className="supporting-product scroll-section"
                id={product.anchor}
                key={product.key}
              >
                <ProductGallery
                  images={product.gallery ?? [product.image]}
                  label={product.title}
                />
                <div className="supporting-product__body">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section scroll-section" id="why">
        <div className="section-inner split-grid">
          <div>
            <span className="eyebrow">{t("why.eyebrow")}</span>
            <h2 className="section-title">{t("why.title")}</h2>
            <p className="section-lead">{t("why.description")}</p>
          </div>
          <div className="feature-list">
            {whyItems.map((item) => (
              <div className="feature-row" key={item.title}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark scroll-section" id="planning">
        <div className="section-inner split-grid">
          <div>
            <span className="eyebrow">{t("why.cta.badge")}</span>
            <h2 className="section-title">{t("why.cta.title")}</h2>
          </div>
          <div>
            <p className="section-lead">{t("why.cta.description")}</p>
            <p style={{ marginTop: 28 }}>
              <Link href="/contact" className="button button--primary">
                {t("why.cta.button")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
