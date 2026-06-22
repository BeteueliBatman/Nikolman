"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server-auth";

export type AdminSignInState = {
  error?: string;
};

export async function signInAdmin(
  _prevState: AdminSignInState | null,
  formData: FormData
): Promise<AdminSignInState | null> {
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

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function signOutAdmin() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
