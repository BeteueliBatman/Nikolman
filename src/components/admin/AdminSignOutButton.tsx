"use client";

import { signOutAdmin } from "@/lib/admin/actions";

export default function AdminSignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button type="submit" className="admin-shell__sign-out">
        Sign out
      </button>
    </form>
  );
}
