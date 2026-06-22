import { notFound } from "next/navigation";
import AdminArticleForm from "@/components/admin/AdminArticleForm";
import { getAdminArticle } from "@/lib/admin/articles";
import type { ArticleRow } from "@/lib/db/types";

export default async function AdminEditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getAdminArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Articles</span>
        <h1>Edit article</h1>
      </div>
      <AdminArticleForm article={article as ArticleRow} />
    </section>
  );
}
