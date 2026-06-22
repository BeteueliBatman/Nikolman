import { NextResponse } from "next/server";
import { getPublicServerClientIfConfigured } from "@/lib/supabase/server";
import { validateContactPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const validation = validateContactPayload(body);

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

  const { error } = await supabase.rpc("submit_contact_message", {
    p_name: validation.value.name,
    p_email: validation.value.email,
    p_phone: validation.value.phone,
    p_subject: validation.value.subject,
    p_message: validation.value.message,
    p_locale: validation.value.locale,
  });

  if (error) {
    if (error.message.includes("rate_limited")) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    return NextResponse.json({ error: "submission_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
