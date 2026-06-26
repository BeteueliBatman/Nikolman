"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/admin/roles";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createAuthServerClient } from "@/lib/supabase/server-auth";

export type AdminSignInState = {
  error?: string;
};

export async function signInAdmin(
  _prevState: AdminSignInState | null,
  formData: FormData
): Promise<AdminSignInState | null> {
  if (!isSupabaseConfigured()) {
    return {
      error: "Website backend is not configured. Set Supabase env variables.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createAuthServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: "Invalid email or password." };
  }

  if (!isAllowedAdminEmail(email)) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  const { data: role, error: roleError } = await supabase.rpc(
    "get_website_admin_role"
  );

  if (roleError || !isAdminRole(role)) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function signOutAdmin() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
