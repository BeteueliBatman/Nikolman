import Link from "next/link";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { deleteProject, getAdminProjects } from "@/lib/admin/projects";
import type { LocalizedText, PublishStatus } from "@/lib/db/types";

function readTitle(title: unknown): string {
  if (!title || typeof title !== "object") {
    return "Untitled";
  }

  const localized = title as LocalizedText;
  return localized.en || localized.ka || "Untitled";
}

export default async function AdminProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <section className="admin-page">
      <div className="admin-page__header admin-page__header--split">
        <div>
          <span className="eyebrow">Content</span>
          <h1>Projects</h1>
          <p className="admin-page__lead">
            Manage published and draft project entries for the public projects page.
          </p>
        </div>
        <Link href="/admin/projects/new" className="button button--primary">
          New project
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Category</th>
              <th>Year</th>
              <th>Status</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {projects.length ? (
              projects.map((project) => (
                <tr key={project.id}>
                  <td>{readTitle(project.title)}</td>
                  <td>{project.slug}</td>
                  <td>{project.category_key}</td>
                  <td>{project.year}</td>
                  <td>
                    <AdminStatusBadge status={project.status as PublishStatus} />
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <Link href={`/admin/projects/${project.id}/edit`}>
                        Edit
                      </Link>
                      <AdminDeleteButton
                        id={project.id}
                        action={deleteProject}
                        label="project"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="admin-table__empty">
                  No projects yet. Create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
