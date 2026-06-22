import { createAuthServerClient } from "@/lib/supabase/server-auth";
import type { AdminProfile } from "@/lib/admin/require-admin";

function isAdminRole(value: unknown): value is AdminProfile["role"] {
  return value === "admin" || value === "editor";
}

export async function getAdminSession() {
  const supabase = await createAuthServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: role, error } = await supabase.rpc("get_website_admin_role");

  if (error || !isAdminRole(role)) {
    return null;
  }

  return {
    supabase,
    user,
    profile: { role } satisfies AdminProfile,
  };
}
