import { NextResponse } from "next/server";
import { getPublicServerClientIfConfigured } from "@/lib/supabase/server";
import { validateNewsletterPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const validation = validateNewsletterPayload(body);

  if (!validation.ok) {
    if (validation.error === "spam_detected") {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const supabase = getPublicServerClientIfConfigured();

  if (!supabase) {
    return NextResponse.json({ error: "backend_unavailable" }, { status: 503 });
  }

  const { error } = await supabase.rpc("subscribe_newsletter_email", {
    p_email: validation.value.email,
    p_locale: validation.value.locale,
  });

  if (error) {
    return NextResponse.json({ error: "subscription_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
