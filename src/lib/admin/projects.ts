"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { formatActionError, readImageUrl, readLocalizedField, readRequiredText } from "@/lib/admin/form";
import { readSlug } from "@/lib/admin/slug";
import { getAdminSession } from "@/lib/admin/session";
import { DB_TABLES } from "@/lib/db/tables";
import type { ProjectCategoryKey, PublishStatus } from "@/lib/db/types";
import { projectCategoryOptions } from "@/lib/admin/project-options";

export type ProjectFormState = {
  error?: string;
};

function readCategory(value: FormDataEntryValue | null): ProjectCategoryKey {
  const category = String(value ?? "");

  if (!projectCategoryOptions.includes(category as ProjectCategoryKey)) {
    throw new Error("missing_category");
  }

  return category as ProjectCategoryKey;
}

function readStatus(value: FormDataEntryValue | null): PublishStatus {
  const status = String(value ?? "");

  if (status !== "draft" && status !== "published") {
    throw new Error("missing_status");
  }

  return status;
}

function buildProjectPayload(formData: FormData) {
  const title = readLocalizedField(formData, "title");

  return {
    slug: readSlug(formData, title.en),
    image_url: readImageUrl(formData),
    category_key: readCategory(formData.get("category_key")),
    year: readRequiredText(formData, "year"),
    metric: readRequiredText(formData, "metric"),
    featured: formData.get("featured") === "on",
    sort_order: Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    status: readStatus(formData.get("status")),
    title,
    description: readLocalizedField(formData, "description"),
    project_status: readLocalizedField(formData, "project_status"),
    location: readLocalizedField(formData, "location"),
    scope: readLocalizedField(formData, "scope"),
  };
}

export async function saveProject(
  _prevState: ProjectFormState | null,
  formData: FormData
): Promise<ProjectFormState | null> {
  const session = await getAdminSession();

  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const projectId = String(formData.get("id") ?? "").trim();

  let payload;

  try {
    payload = buildProjectPayload(formData);
  } catch (error) {
    return { error: formatActionError(error) };
  }

  const query = projectId
    ? session.supabase
        .from(DB_TABLES.projects)
        .update(payload)
        .eq("id", projectId)
    : session.supabase.from(DB_TABLES.projects).insert(payload);

  const { error } = await query;

  if (error) {
    if (error.code === "23505") {
      return { error: "This slug is already in use. Choose another slug." };
    }

    return { error: `Could not save the project: ${error.message}` };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/en/projects");
  revalidatePath("/ka/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const projectId = String(formData.get("id") ?? "").trim();

  if (!projectId) {
    redirect("/admin/projects");
  }

  await session.supabase.from(DB_TABLES.projects).delete().eq("id", projectId);

  revalidatePath("/admin/projects");
  revalidatePath("/en/projects");
  revalidatePath("/ka/projects");
  redirect("/admin/projects");
}

export async function getAdminProjects() {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const { data } = await session.supabase
    .from(DB_TABLES.projects)
    .select("id, slug, title, status, year, category_key, featured, sort_order, updated_at")
    .order("sort_order", { ascending: true })
    .order("year", { ascending: false });

  return data ?? [];
}

export async function getAdminProject(id: string) {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  const { data } = await session.supabase
    .from(DB_TABLES.projects)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
}
