import type { AppLocale } from "@/lib/env";
import type { LocalizedText } from "@/lib/db/types";

export function pickLocalized(
  value: LocalizedText,
  locale: AppLocale
): string {
  return value[locale] || value.en;
}

export function isAppLocale(value: string): value is AppLocale {
  return value === "en" || value === "ka";
}
