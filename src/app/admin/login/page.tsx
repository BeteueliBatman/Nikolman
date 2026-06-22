import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <span className="brand__mark" aria-hidden="true" />
          <h1>Nikolman Admin</h1>
          <p>Sign in to manage website content.</p>
        </div>

        <Suspense fallback={<p className="admin-login__loading">Loading...</p>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
