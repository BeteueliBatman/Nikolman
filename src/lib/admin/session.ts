import { isAdminRole } from "@/lib/admin/roles";
import type { AdminProfile } from "@/lib/admin/require-admin";
import { isAllowedAdminEmail, isSupabaseConfigured } from "@/lib/env";
import { createAuthServerClient } from "@/lib/supabase/server-auth";

export async function getAdminSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createAuthServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  if (!isAllowedAdminEmail(user.email)) {
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
