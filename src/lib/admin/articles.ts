"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { formatActionError, readImageUrl, readLocalizedField, readRequiredText } from "@/lib/admin/form";
import { readSlug } from "@/lib/admin/slug";
import { getAdminSession } from "@/lib/admin/session";
import { DB_TABLES } from "@/lib/db/tables";
import type {
  NewsroomCategoryKey,
  NewsroomCompanyKey,
  PublishStatus,
} from "@/lib/db/types";
import {
  articleCategoryOptions,
  articleCompanyOptions,
} from "@/lib/admin/article-options";

export type ArticleFormState = {
  error?: string;
};

function readCategory(value: FormDataEntryValue | null): NewsroomCategoryKey {
  const category = String(value ?? "");

  if (!articleCategoryOptions.includes(category as NewsroomCategoryKey)) {
    throw new Error("missing_category");
  }

  return category as NewsroomCategoryKey;
}

function readCompany(value: FormDataEntryValue | null): NewsroomCompanyKey {
  const company = String(value ?? "");

  if (!articleCompanyOptions.includes(company as NewsroomCompanyKey)) {
    throw new Error("missing_company");
  }

  return company as NewsroomCompanyKey;
}

function readStatus(value: FormDataEntryValue | null): PublishStatus {
  const status = String(value ?? "");

  if (status !== "draft" && status !== "published") {
    throw new Error("missing_status");
  }

  return status;
}

function buildArticlePayload(formData: FormData) {
  const title = readLocalizedField(formData, "title");

  return {
    slug: readSlug(formData, title.en),
    image_url: readImageUrl(formData),
    category_key: readCategory(formData.get("category_key")),
    company_key: readCompany(formData.get("company_key")),
    published_at: readRequiredText(formData, "published_at"),
    status: readStatus(formData.get("status")),
    title,
    summary: readLocalizedField(formData, "summary"),
    body: readLocalizedField(formData, "body"),
  };
}

export async function saveArticle(
  _prevState: ArticleFormState | null,
  formData: FormData
): Promise<ArticleFormState | null> {
  const session = await getAdminSession();

  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const articleId = String(formData.get("id") ?? "").trim();

  let payload;

  try {
    payload = buildArticlePayload(formData);
  } catch (error) {
    return { error: formatActionError(error) };
  }

  const query = articleId
    ? session.supabase
        .from(DB_TABLES.articles)
        .update(payload)
        .eq("id", articleId)
    : session.supabase.from(DB_TABLES.articles).insert(payload);

  const { error } = await query;

  if (error) {
    if (error.code === "23505") {
      return { error: "This slug is already in use. Choose another slug." };
    }

    return { error: `Could not save the article: ${error.message}` };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/en/newsroom");
  revalidatePath("/ka/newsroom");
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const articleId = String(formData.get("id") ?? "").trim();

  if (!articleId) {
    redirect("/admin/articles");
  }

  await session.supabase.from(DB_TABLES.articles).delete().eq("id", articleId);

  revalidatePath("/admin/articles");
  revalidatePath("/en/newsroom");
  revalidatePath("/ka/newsroom");
  redirect("/admin/articles");
}

export async function getAdminArticles() {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const { data } = await session.supabase
    .from(DB_TABLES.articles)
    .select("id, slug, title, status, published_at, category_key, company_key, updated_at")
    .order("published_at", { ascending: false });

  return data ?? [];
}

export async function getAdminArticle(id: string) {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  const { data } = await session.supabase
    .from(DB_TABLES.articles)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
}
