"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAdmin, type AdminSignInState } from "@/lib/admin/actions";

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const [state, formAction, pending] = useActionState<
    AdminSignInState | null,
    FormData
  >(signInAdmin, null);

  return (
    <form className="admin-login__form" action={formAction}>
      {errorCode === "unauthorized" ? (
        <p className="admin-login__alert" role="alert">
          This account does not have admin access.
        </p>
      ) : null}

      {errorCode === "backend_unavailable" ? (
        <p className="admin-login__alert" role="alert">
          Website backend is not configured. Add Supabase environment variables
          and restart the app.
        </p>
      ) : null}

      {state?.error ? (
        <p className="admin-login__alert" role="alert">
          {state.error}
        </p>
      ) : null}

      <label className="admin-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </label>

      <label className="admin-field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>

      <button
        type="submit"
        className="button button--primary admin-login__submit"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
