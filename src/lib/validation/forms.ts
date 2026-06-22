const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  locale: string;
  _hp?: string;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function trim(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactPayload(
  body: unknown
): ValidationResult<ContactPayload> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "invalid_payload" };
  }

  const record = body as Record<string, unknown>;
  const name = trim(record.name);
  const email = trim(record.email).toLowerCase();
  const phone = trim(record.phone);
  const subject = trim(record.subject);
  const message = trim(record.message);
  const locale = trim(record.locale) || "en";
  const _hp = trim(record._hp);

  if (_hp) {
    return { ok: false, error: "spam_detected" };
  }

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "invalid_name" };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { ok: false, error: "invalid_email" };
  }

  if (phone.length > 40) {
    return { ok: false, error: "invalid_phone" };
  }

  if (subject.length > 120) {
    return { ok: false, error: "invalid_subject" };
  }

  if (message.length < 10 || message.length > 5000) {
    return { ok: false, error: "invalid_message" };
  }

  if (locale !== "en" && locale !== "ka") {
    return { ok: false, error: "invalid_locale" };
  }

  return {
    ok: true,
    value: { name, email, phone, subject, message, locale },
  };
}

export function validateNewsletterPayload(
  body: unknown
): ValidationResult<{ email: string; locale: string }> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "invalid_payload" };
  }

  const record = body as Record<string, unknown>;
  const email = trim(record.email).toLowerCase();
  const locale = trim(record.locale) || "en";
  const _hp = trim(record._hp);

  if (_hp) {
    return { ok: false, error: "spam_detected" };
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { ok: false, error: "invalid_email" };
  }

  if (locale !== "en" && locale !== "ka") {
    return { ok: false, error: "invalid_locale" };
  }

  return { ok: true, value: { email, locale } };
}
