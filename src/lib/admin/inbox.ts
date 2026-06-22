"use server";

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
