import { notFound } from "next/navigation";
import AdminProjectForm from "@/components/admin/AdminProjectForm";
import { getAdminProject } from "@/lib/admin/projects";
import type { ProjectRow } from "@/lib/db/types";

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getAdminProject(id);

  if (!project) {
    notFound();
  }

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Projects</span>
        <h1>Edit project</h1>
      </div>
      <AdminProjectForm project={project as ProjectRow} />
    </section>
  );
}
