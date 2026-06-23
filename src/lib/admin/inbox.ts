"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin/session";
import { DB_TABLES } from "@/lib/db/tables";
import type { ContactSubmissionRow } from "@/lib/db/types";

export async function getContactSubmissions(): Promise<ContactSubmissionRow[]> {
  const session = await getAdminSession();

  if (!session) {
    return [];
  }

  const { data } = await session.supabase
    .from(DB_TABLES.contactSubmissions)
    .select("*")
    .order("created_at", { ascending: false });

  return (data as ContactSubmissionRow[]) ?? [];
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

export async function deleteContactSubmissions(formData: FormData) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const ids = readIds(formData);

  if (!ids.length) {
    redirect("/admin/inbox");
  }

  await session.supabase
    .from(DB_TABLES.contactSubmissions)
    .delete()
    .in("id", ids);

  revalidatePath("/admin/inbox");
  redirect("/admin/inbox");
}
