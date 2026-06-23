import type { AdminProfile } from "@/lib/admin/require-admin";

export function isAdminRole(value: unknown): value is AdminProfile["role"] {
  return value === "admin" || value === "editor";
}
