import { jsonNoStore, validatePublicApiRequest } from "@/lib/api/request-security";
import { getPublicServerClientIfConfigured } from "@/lib/supabase/server";
import { validateContactPayload } from "@/lib/validation/forms";

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

  const validation = validateContactPayload(body);

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
      return jsonNoStore({ error: "rate_limited" }, { status: 429 });
    }

    if (error.message.includes("invalid_")) {
      return jsonNoStore({ error: "invalid_payload" }, { status: 400 });
    }

    return jsonNoStore({ error: "submission_failed" }, { status: 500 });
  }

  return jsonNoStore({ ok: true });
}
