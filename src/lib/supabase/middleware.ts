import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole } from "@/lib/admin/roles";
import { getSupabasePublicEnv, isSupabaseConfigured } from "@/lib/env";

export async function updateAdminSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isSupabaseConfigured()) {
    if (isLoginPage) {
      return NextResponse.next();
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("error", "backend_unavailable");
    return NextResponse.redirect(redirectUrl);
  }

  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && !isLoginPage) {
    const { data: role, error } = await supabase.rpc("get_website_admin_role");

    if (error || !isAdminRole(role)) {
      await supabase.auth.signOut();
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (user && isLoginPage) {
    const { data: role } = await supabase.rpc("get_website_admin_role");

    if (isAdminRole(role)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    await supabase.auth.signOut();
  }

  return response;
}
