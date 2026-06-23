"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/session";
import { DB_TABLES } from "@/lib/db/tables";
import type { NewsletterSubscriberRow } from "@/lib/db/types";

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriberRow[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const { data } = await session.supabase
    .from(DB_TABLES.newsletterSubscribers)
    .select("*")
    .order("created_at", { ascending: false });

  return (data as NewsletterSubscriberRow[]) ?? [];
}

function readIds(formData: FormData): string[] {
  const raw = String(formData.get("ids") ?? "").trim();

  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function deleteNewsletterSubscribers(formData: FormData) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const ids = readIds(formData);

  if (!ids.length) {
    redirect("/admin/subscribers");
  }

  await session.supabase
    .from(DB_TABLES.newsletterSubscribers)
    .delete()
    .in("id", ids);

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers");
}
