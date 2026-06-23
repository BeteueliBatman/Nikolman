import Link from "next/link";
import AdminArticlesNav from "@/components/admin/AdminArticlesNav";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import {
  deleteMediaAsset,
  getAdminMediaAssets,
} from "@/lib/admin/media-assets";
import type { LocalizedText, PublishStatus } from "@/lib/db/types";

function readTitle(title: unknown): string {
  if (!title || typeof title !== "object") {
    return "Untitled";
  }

  const localized = title as LocalizedText;
  return localized.en || localized.ka || "Untitled";
}

export default async function AdminMediaAssetsPage() {
  const assets = await getAdminMediaAssets();

  return (
    <section className="admin-page">
      <AdminArticlesNav active="media" />

      <div className="admin-page__header admin-page__header--split">
        <div>
          <span className="eyebrow">Newsroom</span>
          <h1>Media center</h1>
          <p className="admin-page__lead">
            Upload images and downloadable documents for the public newsroom media
            library.
          </p>
        </div>
        <Link
          href="/admin/articles/media/new"
          className="button button--primary"
        >
          New media asset
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>File info</th>
              <th>Order</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {assets.length ? (
              assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{readTitle(asset.title)}</td>
                  <td>{asset.media_type}</td>
                  <td>{asset.file_meta}</td>
                  <td>{asset.sort_order}</td>
                  <td>
                    <AdminStatusBadge status={asset.status as PublishStatus} />
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Link href={`/admin/articles/media/${asset.id}/edit`}>
                        Edit
                      </Link>
                      <AdminDeleteButton
                        id={asset.id}
                        action={deleteMediaAsset}
                        label="media asset"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="admin-table__empty">
                  No media assets yet. Upload the first image or document.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
