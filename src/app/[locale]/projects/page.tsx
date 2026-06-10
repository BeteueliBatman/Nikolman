import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { projectCategoryKeys, projectItems } from "@/lib/siteContent";

function pageHeroStyle(image: string): CSSProperties {
  return { "--page-image": `url(${image})` } as CSSProperties;
}

function projectImageStyle(image: string): CSSProperties {
  return { "--project-image": `url(${image})` } as CSSProperties;
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

  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const regularProjects = projects.filter(
    (project) => project.key !== featuredProject.key
  );

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
          <div className="portfolio-heading">
            <div className="section-header section-header--wide">
              <span className="eyebrow">{t("overview.eyebrow")}</span>
              <h2 className="section-title">{t("overview.title")}</h2>
              <p className="section-lead">{t("overview.description")}</p>
            </div>

            <div className="project-category-row" aria-label="Project categories">
              {categories.map((category) => (
                <span
                  className={`project-category ${
                    category.key === "all" ? "is-active" : ""
                  }`}
                  key={category.key}
                >
                  {category.label}
                </span>
              ))}
            </div>
          </div>

          {featuredProject && (
            <article className="project-feature">
              <div
                className="project-feature__media"
                style={projectImageStyle(featuredProject.image)}
              >
                {/* TODO: Upload this project image to public/media/projects and keep the path in projectItems. */}
              </div>
              <div className="project-feature__content">
                <span className="project-pill">{t("labels.featured")}</span>
                <h3>{featuredProject.title}</h3>
                <p>{featuredProject.description}</p>

                <dl className="project-meta project-meta--feature">
                  <div>
                    <dt>{t("labels.status")}</dt>
                    <dd>{featuredProject.status}</dd>
                  </div>
                  <div>
                    <dt>{t("labels.location")}</dt>
                    <dd>{featuredProject.location}</dd>
                  </div>
                  <div>
                    <dt>{t("labels.year")}</dt>
                    <dd>{featuredProject.year}</dd>
                  </div>
                  <div>
                    <dt>{t("labels.metric")}</dt>
                    <dd>{featuredProject.metric}</dd>
                  </div>
                </dl>

                <div className="project-scope">
                  <span>{t("labels.scope")}</span>
                  <strong>{featuredProject.scope}</strong>
                </div>
              </div>
            </article>
          )}

          <div className="project-grid">
            {regularProjects.map((project) => (
              <article className="project-card" key={project.key}>
                <div
                  className="project-card__media"
                  style={projectImageStyle(project.image)}
                >
                  {/* TODO: Upload this project image to public/media/projects and keep the path in projectItems. */}
                </div>
                <div className="project-card__body">
                  <div className="project-card__topline">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <dl className="project-meta">
                    <div>
                      <dt>{t("labels.status")}</dt>
                      <dd>{project.status}</dd>
                    </div>
                    <div>
                      <dt>{t("labels.location")}</dt>
                      <dd>{project.location}</dd>
                    </div>
                  </dl>

                  <div className="project-card__scope">
                    <span>{t("labels.scope")}</span>
                    <strong>{project.scope}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
