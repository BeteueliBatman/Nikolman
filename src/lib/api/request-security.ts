import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";

const MAX_PUBLIC_API_JSON_BYTES = 64 * 1024;

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();

  try {
    origins.add(new URL(getSiteUrl()).origin);
  } catch {
    // Ignore malformed fallback values.
  }

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  origins.add("http://localhost:3000");
  origins.add("http://127.0.0.1:3000");

  return origins;
}

function hasTrustedOrigin(request: Request): boolean {
  const originHeader = request.headers.get("origin");

  // Non-browser clients (or same-origin server-side requests) may omit Origin.
  if (!originHeader) {
    return true;
  }

  let parsedOrigin: string;
  try {
    parsedOrigin = new URL(originHeader).origin;
  } catch {
    return false;
  }

  return getAllowedOrigins().has(parsedOrigin);
}

function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.toLowerCase().includes("application/json");
}

function isBodyTooLarge(request: Request): boolean {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) {
    return false;
  }

  const length = Number.parseInt(rawLength, 10);
  if (Number.isNaN(length)) {
    return false;
  }

  return length > MAX_PUBLIC_API_JSON_BYTES;
}

export function jsonNoStore(
  payload: unknown,
  init: ResponseInit = {}
): NextResponse {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store, max-age=0");

  return NextResponse.json(payload, {
    ...init,
    headers,
  });
}

export function validatePublicApiRequest(request: Request): NextResponse | null {
  if (request.method !== "POST") {
    return jsonNoStore(
      { error: "method_not_allowed" },
      { status: 405, headers: { Allow: "POST" } }
    );
  }

  if (!hasTrustedOrigin(request)) {
    return jsonNoStore({ error: "forbidden" }, { status: 403 });
  }

  if (!isJsonRequest(request)) {
    return jsonNoStore({ error: "invalid_content_type" }, { status: 415 });
  }

  if (isBodyTooLarge(request)) {
    return jsonNoStore({ error: "payload_too_large" }, { status: 413 });
  }

  return null;
}
