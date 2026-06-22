import { redirect } from "next/navigation";
import { createAuthServerClient } from "@/lib/supabase/server-auth";

export type AdminProfile = {
  role: "admin" | "editor";
};

function isAdminRole(value: unknown): value is AdminProfile["role"] {
  return value === "admin" || value === "editor";
}

export async function requireAdminProfile() {
  const supabase = await createAuthServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
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
