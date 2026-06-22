import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, isSupabaseConfigured } from "@/lib/env";

export function createPublicServerClient() {
  const { url, anonKey } = getSupabasePublicEnv();

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getPublicServerClientIfConfigured() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createPublicServerClient();
}
