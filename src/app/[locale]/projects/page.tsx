import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PageHero from "@/components/PageHero";
import ProjectsBoard from "@/components/ProjectsBoard";
import { getProjects } from "@/lib/data/projects";
import { isAppLocale } from "@/lib/data/locale";
import { createPageMetadata } from "@/lib/metadata";
import { navPageHeroImages } from "@/lib/pageHero";
import { projectCategoryKeys } from "@/lib/siteContent";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata(locale, "projects", "/projects");
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const appLocale = isAppLocale(locale) ? locale : "en";

  const categories = projectCategoryKeys.map((key) => ({
    key,
    label: t(`categories.${key}`),
  }));

  const projectRows = await getProjects(appLocale);

  const projects = projectRows.map((project) => ({
    ...project,
    category: t(`categories.${project.categoryKey}`),
  }));

  return (
    <>
      <PageHero image={navPageHeroImages.projects} accent="left">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1>{t("hero.title")}</h1>
        <p className="section-lead">{t("hero.description")}</p>
      </PageHero>

      <section className="section">
        <div className="section-inner">
          <ProjectsBoard
            projects={projects}
            categories={categories}
            overview={{
              eyebrow: t("overview.eyebrow"),
              title: t("overview.title"),
              description: t("overview.description"),
            }}
            labels={{
              categories: t("labels.categories"),
              featured: t("labels.featured"),
              status: t("labels.status"),
              location: t("labels.location"),
              year: t("labels.year"),
              scope: t("labels.scope"),
              metric: t("labels.metric"),
              noResults: t("labels.noResults"),
            }}
          />
        </div>
      </section>

      <section className="section section--dark">
        <div className="section-inner project-submit">
          <div>
            <span className="eyebrow">{t("submit.eyebrow")}</span>
            <h2 className="section-title">{t("submit.title")}</h2>
            <p className="section-lead">{t("submit.description")}</p>
          </div>
          <Link href="/contact" className="button button--primary">
            {t("submit.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
