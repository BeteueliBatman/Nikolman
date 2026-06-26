export type AppLocale = "en" | "ka";

let adminEmailAllowlistCache: Set<string> | null = null;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public environment variables are not configured.");
  }

  return { url, anonKey };
}

export function getSupabaseServiceRoleKey(): string {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return serviceRoleKey;
}

export function getAdminEmailAllowlist(): Set<string> {
  if (adminEmailAllowlistCache) {
    return adminEmailAllowlistCache;
  }

  const raw = process.env.ADMIN_EMAILS ?? "";
  const values = raw
    .split(",")
    .map((value) => normalizeEmail(value))
    .filter(Boolean);

  adminEmailAllowlistCache = new Set(values);
  return adminEmailAllowlistCache;
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const allowlist = getAdminEmailAllowlist();

  if (allowlist.size === 0) {
    return true;
  }

  if (!email) {
    return false;
  }

  return allowlist.has(normalizeEmail(email));
}
