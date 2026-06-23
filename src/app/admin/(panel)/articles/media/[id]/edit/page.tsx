import Link from "next/link";
import { notFound } from "next/navigation";
import AdminArticlesNav from "@/components/admin/AdminArticlesNav";
import AdminMediaAssetForm from "@/components/admin/AdminMediaAssetForm";
import { getAdminMediaAsset } from "@/lib/admin/media-assets";
import type { MediaAssetRow } from "@/lib/db/types";

export default async function AdminEditMediaAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await getAdminMediaAsset(id);

  if (!asset) {
    notFound();
  }

  return (
    <section className="admin-page">
      <AdminArticlesNav active="media" />

      <div className="admin-page__header">
        <span className="eyebrow">Media center</span>
        <h1>Edit media asset</h1>
      </div>

      <AdminMediaAssetForm asset={asset as MediaAssetRow} />

      <p className="admin-form-note">
        <Link href="/admin/articles/media">Back to media center</Link>
      </p>
    </section>
  );
}
