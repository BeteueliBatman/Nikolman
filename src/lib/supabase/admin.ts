import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublicEnv,
  getSupabaseServiceRoleKey,
  isSupabaseAdminConfigured,
} from "@/lib/env";

export function createAdminClient() {
  const { url } = getSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getAdminClientIfConfigured() {
  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  return createAdminClient();
}
