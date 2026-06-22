import { isRedirectError } from "next/dist/client/components/redirect-error";
import type { LocalizedText } from "@/lib/db/types";

export function readLocalizedField(
  formData: FormData,
  key: string
): LocalizedText {
  const en = String(formData.get(`${key}_en`) ?? "").trim();
  const ka = String(formData.get(`${key}_ka`) ?? "").trim();

  if (!en || !ka) {
    throw new Error(`missing_${key}`);
  }

  return { en, ka };
}

export function readRequiredText(formData: FormData, key: string): string {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`missing_${key}`);
  }

  return value;
}

export function readImageUrl(formData: FormData): string {
  const value = String(formData.get("image_url") ?? "").trim();

  if (!value) {
    throw new Error("missing_image");
  }

  return value;
}

export function formatActionError(error: unknown): string {
  if (isRedirectError(error)) {
    throw error;
  }

  if (error instanceof Error) {
    if (error.message === "slug_required") {
      return "Slug is required.";
    }

    if (error.message === "missing_image") {
      return "Please upload an image or paste an image URL.";
    }

    if (error.message.startsWith("missing_")) {
      return "Please fill in all required fields in English and Georgian.";
    }

    if (error.message.includes("duplicate key")) {
      return "This slug is already in use. Choose another slug.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}
