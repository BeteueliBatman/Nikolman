import { redirect } from "next/navigation";
import { isAdminRole } from "@/lib/admin/roles";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createAuthServerClient } from "@/lib/supabase/server-auth";

export type AdminProfile = {
  role: "admin" | "editor";
};

export async function requireAdminProfile() {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login?error=backend_unavailable");
  }

  const supabase = await createAuthServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!isAllowedAdminEmail(user.email)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  const { data: role, error } = await supabase.rpc("get_website_admin_role");

  if (error || !isAdminRole(role)) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  return {
    user,
    profile: { role } satisfies AdminProfile,
  };
}
