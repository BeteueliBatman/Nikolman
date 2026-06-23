import Link from "next/link";
import AdminArticlesNav from "@/components/admin/AdminArticlesNav";
import AdminMediaAssetForm from "@/components/admin/AdminMediaAssetForm";

export default function AdminNewMediaAssetPage() {
  return (
    <section className="admin-page">
      <AdminArticlesNav active="media" />

      <div className="admin-page__header">
        <span className="eyebrow">Media center</span>
        <h1>New media asset</h1>
        <p className="admin-page__lead">
          Add an image or downloadable document to the newsroom media library.
        </p>
      </div>

      <AdminMediaAssetForm />

      <p className="admin-form-note">
        <Link href="/admin/articles/media">Back to media center</Link>
      </p>
    </section>
  );
}
