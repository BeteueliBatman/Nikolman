"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

type FilterItem = {
  key: string;
  label: string;
};

export type ProjectItem = {
  key: string;
  image: string;
  categoryKey: string;
  category: string;
  title: string;
  description: string;
  status: string;
  location: string;
  scope: string;
  year: string;
  metric: string;
  featured: boolean;
};

type ProjectsBoardProps = {
  projects: ProjectItem[];
  categories: FilterItem[];
  overview: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    categories: string;
    featured: string;
    status: string;
    location: string;
    year: string;
    scope: string;
    metric: string;
    noResults: string;
  };
};

function projectImageStyle(image: string): CSSProperties {
  return { "--project-image": `url(${image})` } as CSSProperties;
}

export default function ProjectsBoard({
  projects,
  categories,
  overview,
  labels,
}: ProjectsBoardProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          activeCategory === "all" || project.categoryKey === activeCategory
      ),
    [activeCategory, projects]
  );

  const featuredProject =
    filteredProjects.find((project) => project.featured) ??
    filteredProjects[0] ??
    null;

  const regularProjects = featuredProject
    ? filteredProjects.filter((project) => project.key !== featuredProject.key)
    : [];

  return (
    <>
      <div className="portfolio-heading">
        <div className="section-header section-header--wide">
          <span className="eyebrow">{overview.eyebrow}</span>
          <h2 className="section-title">{overview.title}</h2>
          <p className="section-lead">{overview.description}</p>
        </div>

        <div
          className="project-category-row"
          role="tablist"
          aria-label={labels.categories}
        >
          {categories.map((category) => (
            <button
              className={`project-category ${
                activeCategory === category.key ? "is-active" : ""
              }`}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.key}
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <section className="project-results" aria-live="polite">
        {featuredProject ? (
          <>
            <article className="project-feature">
              <div
                className="project-feature__media"
                style={projectImageStyle(featuredProject.image)}
              >
                {/* TODO: Upload this project image to public/media/projects and keep the path in projectItems. */}
              </div>
              <div className="project-feature__content">
                <span className="project-pill">{labels.featured}</span>
                <h3>{featuredProject.title}</h3>
                <p>{featuredProject.description}</p>

                <dl className="project-meta project-meta--feature">
                  <div>
                    <dt>{labels.status}</dt>
                    <dd>{featuredProject.status}</dd>
                  </div>
                  <div>
                    <dt>{labels.location}</dt>
                    <dd>{featuredProject.location}</dd>
                  </div>
                  <div>
                    <dt>{labels.year}</dt>
                    <dd>{featuredProject.year}</dd>
                  </div>
                  <div>
                    <dt>{labels.metric}</dt>
                    <dd>{featuredProject.metric}</dd>
                  </div>
                </dl>

                <div className="project-scope">
                  <span>{labels.scope}</span>
                  <strong>{featuredProject.scope}</strong>
                </div>
              </div>
            </article>

            {regularProjects.length > 0 && (
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
                          <dt>{labels.status}</dt>
                          <dd>{project.status}</dd>
                        </div>
                        <div>
                          <dt>{labels.location}</dt>
                          <dd>{project.location}</dd>
                        </div>
                      </dl>

                      <div className="project-card__scope">
                        <span>{labels.scope}</span>
                        <strong>{project.scope}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="project-empty">{labels.noResults}</p>
        )}
      </section>
    </>
  );
}
