import AdminProjectForm from "@/components/admin/AdminProjectForm";

export default function AdminNewProjectPage() {
  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Projects</span>
        <h1>New project</h1>
      </div>
      <AdminProjectForm />
    </section>
  );
}
