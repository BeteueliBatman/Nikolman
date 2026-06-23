import Link from "next/link";
import AdminArticlesNav from "@/components/admin/AdminArticlesNav";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { deleteArticle, getAdminArticles } from "@/lib/admin/articles";
import type { LocalizedText, PublishStatus } from "@/lib/db/types";

function readTitle(title: unknown): string {
  if (!title || typeof title !== "object") {
    return "Untitled";
  }

  const localized = title as LocalizedText;
  return localized.en || localized.ka || "Untitled";
}

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();

  return (
    <section className="admin-page">
      <AdminArticlesNav active="articles" />

      <div className="admin-page__header admin-page__header--split">
        <div>
          <span className="eyebrow">Content</span>
          <h1>Articles</h1>
          <p className="admin-page__lead">
            Manage newsroom articles with English and Georgian content.
          </p>
        </div>
        <Link href="/admin/articles/new" className="button button--primary">
          New article
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Published</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {articles.length ? (
              articles.map((article) => (
                <tr key={article.id}>
                  <td>{readTitle(article.title)}</td>
                  <td>{article.slug}</td>
                  <td>{article.category_key}</td>
                  <td>{article.published_at}</td>
                  <td>
                    <AdminStatusBadge status={article.status as PublishStatus} />
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        Edit
                      </Link>
                      <AdminDeleteButton
                        id={article.id}
                        action={deleteArticle}
                        label="article"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="admin-table__empty">
                  No articles yet. Create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
