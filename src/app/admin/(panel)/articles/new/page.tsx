import AdminArticleForm from "@/components/admin/AdminArticleForm";

export default function AdminNewArticlePage() {
  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Articles</span>
        <h1>New article</h1>
      </div>
      <AdminArticleForm />
    </section>
  );
}
