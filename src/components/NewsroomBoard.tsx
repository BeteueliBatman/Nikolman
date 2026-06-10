"use client";

import type { ChangeEvent, CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type FilterItem = {
  key: string;
  label: string;
};

type NewsroomArticle = {
  key: string;
  image: string;
  categoryKey: string;
  category: string;
  companyKey: string;
  company: string;
  date: string;
  displayDate: string;
  title: string;
  summary: string;
  body: string;
};

type NewsroomBoardProps = {
  articles: NewsroomArticle[];
  categories: FilterItem[];
  labels: {
    topics: string;
    search: string;
    searchPlaceholder: string;
    clearFilters: string;
    featured: string;
    published: string;
    readMore: string;
    close: string;
    loadMore: string;
    noResults: string;
  };
};

const visibleStep = 6;

function articleImageStyle(image: string): CSSProperties {
  return { "--news-image": `url(${image})` } as CSSProperties;
}

export default function NewsroomBoard({
  articles,
  categories,
  labels,
}: NewsroomBoardProps) {
  const t = useTranslations("newsroom");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(visibleStep);

  const sortedArticles = useMemo(
    () => [...articles].sort((a, b) => b.date.localeCompare(a.date)),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sortedArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "all" || article.categoryKey === activeCategory;
      const matchesQuery =
        needle === "" ||
        [
          article.title,
          article.summary,
          article.body,
          article.category,
          article.company,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, sortedArticles]);

  const featured = filteredArticles[0] ?? null;
  const restArticles = filteredArticles.slice(1);
  const visibleArticles = restArticles.slice(0, visibleCount);
  const hasMore = visibleCount < restArticles.length;

  function resetView() {
    setOpenArticle(null);
    setVisibleCount(visibleStep);
  }

  function selectCategory(key: string) {
    setActiveCategory(key);
    resetView();
  }

  function updateQuery(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    resetView();
  }

  function clearFilters() {
    setActiveCategory("all");
    setQuery("");
    resetView();
  }

  const isFiltered = activeCategory !== "all" || query.trim() !== "";

  function renderMeta(article: NewsroomArticle) {
    return (
      <div className="newsroom-meta">
        <span className="newsroom-tag">{article.company}</span>
        <span>{article.category}</span>
        <span>
          {labels.published}: {article.displayDate}
        </span>
      </div>
    );
  }

  function renderReadButton(article: NewsroomArticle) {
    const isOpen = openArticle === article.key;
    return (
      <button
        className="newsroom-card__read"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setOpenArticle(isOpen ? null : article.key)}
      >
        {isOpen ? labels.close : labels.readMore}
      </button>
    );
  }

  return (
    <div className="newsroom-board" id="press-releases">
      <div className="newsroom-filterbar">
        <div
          className="newsroom-topics"
          role="tablist"
          aria-label={labels.topics}
        >
          {categories.map((item) => (
            <button
              className={`newsroom-topic ${
                activeCategory === item.key ? "is-active" : ""
              }`}
              type="button"
              role="tab"
              aria-selected={activeCategory === item.key}
              key={item.key}
              onClick={() => selectCategory(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="newsroom-controls">
          <label className="newsroom-field newsroom-field--search">
            <span className="newsroom-field__label">{labels.search}</span>
            <span className="newsroom-field__box">
              <span className="newsroom-field__search-icon" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={updateQuery}
                placeholder={labels.searchPlaceholder}
              />
            </span>
          </label>

        </div>

        <div className="newsroom-resultline">
          <strong>{t("labels.results", { count: filteredArticles.length })}</strong>
          {isFiltered && (
            <button
              className="newsroom-clear"
              type="button"
              onClick={clearFilters}
            >
              {labels.clearFilters}
            </button>
          )}
        </div>
      </div>

      <section className="newsroom-results" aria-live="polite">
        {featured && (
          <article className="newsroom-featured">
            <div
              className="newsroom-featured__media"
              style={articleImageStyle(featured.image)}
            >
              {/* TODO: Upload this newsroom image to public/media/newsroom and keep the path in newsroomItems. */}
            </div>
            <div className="newsroom-featured__content">
              <span className="newsroom-featured__pill">{labels.featured}</span>
              {renderMeta(featured)}
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
              {openArticle === featured.key && (
                <p className="newsroom-card__body">{featured.body}</p>
              )}
              {renderReadButton(featured)}
            </div>
          </article>
        )}

        {visibleArticles.length > 0 && (
          <div className="newsroom-grid">
            {visibleArticles.map((article) => (
              <article className="newsroom-grid-card" key={article.key}>
                <div
                  className="newsroom-grid-card__media"
                  style={articleImageStyle(article.image)}
                >
                  {/* TODO: Upload this newsroom image to public/media/newsroom and keep the path in newsroomItems. */}
                </div>
                <div className="newsroom-grid-card__body">
                  {renderMeta(article)}
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  {openArticle === article.key && (
                    <p className="newsroom-card__body">{article.body}</p>
                  )}
                  {renderReadButton(article)}
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredArticles.length === 0 && (
          <div className="newsroom-empty">{labels.noResults}</div>
        )}

        {hasMore && (
          <button
            className="newsroom-load-more"
            type="button"
            onClick={() => setVisibleCount((count) => count + visibleStep)}
          >
            {labels.loadMore}
          </button>
        )}
      </section>
    </div>
  );
}
