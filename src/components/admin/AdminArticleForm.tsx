"use client";

import { useActionState } from "react";
import Link from "next/link";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";
import AdminImageUploader from "@/components/admin/AdminImageUploader";
import AdminLocaleField from "@/components/admin/AdminLocaleField";
import {
  deleteArticle,
  saveArticle,
  type ArticleFormState,
} from "@/lib/admin/articles";
import {
  articleCategoryOptions,
  articleCompanyOptions,
} from "@/lib/admin/article-options";
import type { ArticleRow } from "@/lib/db/types";

type AdminArticleFormProps = {
  article?: ArticleRow | null;
};

export default function AdminArticleForm({ article }: AdminArticleFormProps) {
  const [state, formAction, pending] = useActionState<
    ArticleFormState | null,
    FormData
  >(saveArticle, null);

  return (
    <form className="admin-form" action={formAction}>
      {article?.id ? <input type="hidden" name="id" value={article.id} /> : null}

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
            defaultValue={article?.slug ?? ""}
            placeholder="factory-quality-process"
            required
          />
        </label>

        <label className="admin-field">
          <span>Category</span>
          <select
            name="category_key"
            defaultValue={article?.category_key ?? "projectNews"}
            required
          >
            {articleCategoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Company</span>
          <select
            name="company_key"
            defaultValue={article?.company_key ?? "nikolmanProjects"}
            required
          >
            {articleCompanyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Published date</span>
          <input
            name="published_at"
            type="date"
            defaultValue={article?.published_at?.slice(0, 10) ?? ""}
            required
          />
        </label>

        <label className="admin-field">
          <span>Status</span>
          <select name="status" defaultValue={article?.status ?? "draft"} required>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
      </div>

      <AdminImageUploader folder="articles" defaultUrl={article?.image_url ?? ""} />

      <AdminLocaleField
        label="Title"
        name="title"
        defaultEn={article?.title.en}
        defaultKa={article?.title.ka}
      />
      <AdminLocaleField
        label="Summary"
        name="summary"
        defaultEn={article?.summary.en}
        defaultKa={article?.summary.ka}
        multiline
      />
      <AdminLocaleField
        label="Body"
        name="body"
        defaultEn={article?.body.en}
        defaultKa={article?.body.ka}
        multiline
      />

      <div className="admin-form__actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={pending}
        >
          {pending ? "Saving..." : article ? "Update article" : "Create article"}
        </button>
        <Link href="/admin/articles" className="admin-button admin-button--ghost">
          Cancel
        </Link>
        {article?.id ? (
          <AdminDeleteButton id={article.id} action={deleteArticle} label="article" />
        ) : null}
      </div>
    </form>
  );
}
