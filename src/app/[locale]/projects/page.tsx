import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ProjectsBoard from "@/components/ProjectsBoard";
import { projectCategoryKeys, projectItems } from "@/lib/siteContent";

function pageHeroStyle(image: string): CSSProperties {
  return { "--page-image": `url(${image})` } as CSSProperties;
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const categories = projectCategoryKeys.map((key) => ({
    key,
    label: t(`categories.${key}`),
  }));

  const projects = projectItems.map((project) => ({
    ...project,
    category: t(`categories.${project.categoryKey}`),
    title: t(`items.${project.key}.title`),
    description: t(`items.${project.key}.description`),
    status: t(`items.${project.key}.status`),
    location: t(`items.${project.key}.location`),
    scope: t(`items.${project.key}.scope`),
  }));

  return (
    <>
      <section
        className="page-hero page-hero--projects"
        style={pageHeroStyle("/media/projects/completed-projects-hero.jpg")}
      >
        {/* TODO: Replace /media/projects/completed-projects-hero.jpg with a final completed-projects hero image. */}
        <div className="page-hero__inner">
          <span className="eyebrow">{t("hero.eyebrow")}</span>
          <h1>{t("hero.title")}</h1>
          <p className="section-lead">{t("hero.description")}</p>
        </div>
      </section>

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
