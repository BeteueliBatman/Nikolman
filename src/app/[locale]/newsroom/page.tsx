import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import NewsroomBoard from "@/components/NewsroomBoard";
import MediaCenter from "@/components/MediaCenter";
import NewsroomSubscribe from "@/components/NewsroomSubscribe";
import PageHero from "@/components/PageHero";
import { getArticles } from "@/lib/data/articles";
import { getMediaAssets } from "@/lib/data/media-assets";
import { isAppLocale } from "@/lib/data/locale";
import { createPageMetadata } from "@/lib/metadata";
import { navPageHeroImages } from "@/lib/pageHero";
import {
  newsroomCategoryKeys,
  newsroomMediaTypeKeys,
  newsroomPressContacts,
} from "@/lib/siteContent";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "newsroom", "/newsroom");
}

function formatNewsDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}

export default async function NewsroomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("newsroom");
  const appLocale = isAppLocale(locale) ? locale : "en";

  const categories = newsroomCategoryKeys.map((key) => ({
    key,
    label: t(`categories.${key}`),
  }));

  const articleRows = await getArticles(appLocale);

  const articles = articleRows.map((article) => ({
    ...article,
    category: t(`categories.${article.categoryKey}`),
    company: t(`companies.${article.companyKey}`),
    displayDate: formatNewsDate(article.date, locale),
  }));

  const mediaItems = await getMediaAssets(appLocale);

  const mediaTabs = newsroomMediaTypeKeys.map((key) => ({
    key,
    label: t(`mediacenter.tabs.${key}`),
  }));

  const mediaTypeLabels = {
    image: t("mediacenter.tabs.images"),
    document: t("mediacenter.tabs.documents"),
  };

  const pressContacts = newsroomPressContacts.map((contact) => ({
    ...contact,
    role: t(`pressContacts.items.${contact.key}.role`),
    description: t(`pressContacts.items.${contact.key}.description`),
  }));

  return (
    <>
      <PageHero image={navPageHeroImages.newsroom} accent="right">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1>{t("hero.title")}</h1>
        <p className="section-lead">{t("hero.description")}</p>
      </PageHero>

      <nav className="newsroom-section-nav" aria-label={t("nav.label")}>
        <div className="newsroom-section-nav__inner">
          <a href="#overview">{t("nav.overview")}</a>
          <a href="#press-releases">{t("nav.pressReleases")}</a>
          <a href="#mediacenter">{t("nav.mediacenter")}</a>
          <a href="#press-contacts">{t("nav.pressContacts")}</a>
        </div>
      </nav>

      <section className="section" id="overview">
        <div className="section-inner">
          <div className="newsroom-intro">
            <div className="section-header section-header--wide">
              <span className="eyebrow">{t("intro.eyebrow")}</span>
              <h2 className="section-title">{t("intro.title")}</h2>
              <p className="section-lead">{t("intro.description")}</p>
            </div>
          </div>

          <NewsroomBoard
            articles={articles}
            categories={categories}
            labels={{
              topics: t("labels.topics"),
              search: t("labels.search"),
              searchPlaceholder: t("labels.searchPlaceholder"),
              clearFilters: t("labels.clearFilters"),
              featured: t("labels.featured"),
              published: t("labels.published"),
              readMore: t("labels.readMore"),
              close: t("labels.close"),
              loadMore: t("labels.loadMore"),
              noResults: t("labels.noResults"),
            }}
          />
        </div>
      </section>

      <section className="section section--soft" id="mediacenter">
        <div className="section-inner">
          <div className="section-header section-header--wide">
            <span className="eyebrow">{t("mediacenter.eyebrow")}</span>
            <h2 className="section-title">{t("mediacenter.title")}</h2>
            <p className="section-lead">{t("mediacenter.description")}</p>
          </div>

          <MediaCenter
            items={mediaItems}
            tabs={mediaTabs}
            typeLabels={mediaTypeLabels}
            downloadLabel={t("mediacenter.download")}
            emptyLabel={t("mediacenter.empty")}
          />
        </div>
      </section>

      <section className="section" id="press-contacts">
        <div className="section-inner">
          <div className="section-header section-header--wide">
            <span className="eyebrow">{t("pressContacts.eyebrow")}</span>
            <h2 className="section-title">{t("pressContacts.title")}</h2>
            <p className="section-lead">{t("pressContacts.description")}</p>
          </div>

          <div className="newsroom-contacts">
            {pressContacts.map((contact) => (
              <article className="newsroom-contact-card" key={contact.key}>
                <span className="newsroom-contact-card__role">
                  {contact.role}
                </span>
                <p>{contact.description}</p>
                <div className="newsroom-contact-actions">
                  <a
                    className="newsroom-contact-phone"
                    href={contact.phoneHref}
                  >
                    {t("pressContacts.phoneLabel")}: {contact.phone}
                  </a>
                  <Link href="/contact" className="newsroom-contact-write">
                    {t("pressContacts.writeLabel")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="newsroom-subscribe">
        <NewsroomSubscribe
          locale={appLocale}
          labels={{
            eyebrow: t("subscribe.eyebrow"),
            title: t("subscribe.title"),
            description: t("subscribe.description"),
            placeholder: t("subscribe.placeholder"),
            button: t("subscribe.button"),
            success: t("subscribe.success"),
            note: t("subscribe.note"),
            error: t("subscribe.error"),
            rateLimited: t("subscribe.rateLimited"),
            submitting: t("subscribe.submitting"),
            consentPrefix: t("subscribe.consentPrefix"),
            consentLink: t("subscribe.consentLink"),
            consentSuffix: t("subscribe.consentSuffix"),
          }}
        />
      </section>

      <section className="cta-band">
        <div className="cta-band__inner">
          <div>
            <span className="eyebrow">{t("contact.eyebrow")}</span>
            <h2>{t("contact.title")}</h2>
            <p>{t("contact.description")}</p>
          </div>
          <Link href="/contact" className="button button--light">
            {t("contact.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
