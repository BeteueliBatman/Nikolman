"use client";

import { useActionState } from "react";
import Link from "next/link";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import AdminImageUploader from "@/components/admin/AdminImageUploader";
import AdminLocaleField from "@/components/admin/AdminLocaleField";
import {
  deleteProject,
  saveProject,
  type ProjectFormState,
} from "@/lib/admin/projects";
import { projectCategoryOptions } from "@/lib/admin/project-options";
import type { ProjectRow } from "@/lib/db/types";

type AdminProjectFormProps = {
  project?: ProjectRow | null;
};

export default function AdminProjectForm({ project }: AdminProjectFormProps) {
  const [state, formAction, pending] = useActionState<
    ProjectFormState | null,
    FormData
  >(saveProject, null);

  return (
    <form className="admin-form" action={formAction}>
      {project?.id ? <input type="hidden" name="id" value={project.id} /> : null}

      {state?.error ? (
        <p className="admin-login__alert" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="admin-form__grid">
        <label className="admin-field">
          <span>Slug</span>
          <input
            name="slug"
            defaultValue={project?.slug ?? ""}
            placeholder="industrial-plant"
            required
          />
        </label>

        <label className="admin-field">
          <span>Category</span>
          <select
            name="category_key"
            defaultValue={project?.category_key ?? "industrial"}
            required
          >
            {projectCategoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Year</span>
          <input name="year" defaultValue={project?.year ?? ""} required />
        </label>

        <label className="admin-field">
          <span>Metric</span>
          <input name="metric" defaultValue={project?.metric ?? ""} required />
        </label>

        <label className="admin-field">
          <span>Sort order</span>
          <input
            name="sort_order"
            type="number"
            defaultValue={project?.sort_order ?? 0}
          />
        </label>

        <label className="admin-field">
          <span>Status</span>
          <select name="status" defaultValue={project?.status ?? "draft"} required>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
      </div>

      <label className="admin-checkbox">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? false}
        />
        <span>Featured on homepage sections</span>
      </label>

      <AdminImageUploader folder="projects" defaultUrl={project?.image_url ?? ""} />

      <AdminLocaleField
        label="Title"
        name="title"
        defaultEn={project?.title.en}
        defaultKa={project?.title.ka}
      />
      <AdminLocaleField
        label="Description"
        name="description"
        defaultEn={project?.description.en}
        defaultKa={project?.description.ka}
        multiline
      />
      <AdminLocaleField
        label="Project status"
        name="project_status"
        defaultEn={project?.project_status.en}
        defaultKa={project?.project_status.ka}
      />
      <AdminLocaleField
        label="Location"
        name="location"
        defaultEn={project?.location.en}
        defaultKa={project?.location.ka}
      />
      <AdminLocaleField
        label="Scope"
        name="scope"
        defaultEn={project?.scope.en}
        defaultKa={project?.scope.ka}
        multiline
      />

      <div className="admin-form__actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={pending}
        >
          {pending ? "Saving..." : project ? "Update project" : "Create project"}
        </button>
        <Link href="/admin/projects" className="admin-button admin-button--ghost">
          Cancel
        </Link>
        {project?.id ? (
          <AdminDeleteButton id={project.id} action={deleteProject} label="project" />
        ) : null}
      </div>
    </form>
  );
}
