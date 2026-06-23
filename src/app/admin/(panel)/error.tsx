"use client";

type AdminPanelErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminPanelError({
  error,
  reset,
}: AdminPanelErrorProps) {
  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Admin</span>
        <h1>Something went wrong</h1>
        <p className="admin-page__lead">
          The admin panel hit an unexpected error. Try again, or restart the dev
          server with a clean cache.
        </p>
      </div>

      <p className="admin-login__alert" role="alert">
        {error.message || "Unexpected admin error."}
      </p>

      <div className="admin-form__actions">
        <button className="button button--primary" type="button" onClick={reset}>
          Try again
        </button>
        <a className="button button--ghost" href="/admin/login">
          Back to login
        </a>
      </div>
    </section>
  );
}
