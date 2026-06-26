import { jsonNoStore, validatePublicApiRequest } from "@/lib/api/request-security";
import { getPublicServerClientIfConfigured } from "@/lib/supabase/server";
import { validateNewsletterPayload } from "@/lib/validation/forms";

export async function POST(request: Request) {
  const requestGuard = validatePublicApiRequest(request);
  if (requestGuard) {
    return requestGuard;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: "invalid_payload" }, { status: 400 });
  }

  const validation = validateNewsletterPayload(body);

  if (!validation.ok) {
    if (validation.error === "spam_detected") {
      return jsonNoStore({ ok: true });
    }

    return jsonNoStore({ error: validation.error }, { status: 400 });
  }

  const supabase = getPublicServerClientIfConfigured();

  if (!supabase) {
    return jsonNoStore({ error: "backend_unavailable" }, { status: 503 });
  }

  const { error } = await supabase.rpc("subscribe_newsletter_email", {
    p_email: validation.value.email,
    p_locale: validation.value.locale,
  });

  if (error) {
    if (error.message.includes("rate_limited")) {
      return jsonNoStore({ error: "rate_limited" }, { status: 429 });
    }

    if (error.message.includes("invalid_email")) {
      return jsonNoStore({ error: "invalid_email" }, { status: 400 });
    }

    if (error.message.includes("invalid_")) {
      return jsonNoStore({ error: "invalid_payload" }, { status: 400 });
    }

    return jsonNoStore({ error: "subscription_failed" }, { status: 500 });
  }

  return jsonNoStore({ ok: true });
}
