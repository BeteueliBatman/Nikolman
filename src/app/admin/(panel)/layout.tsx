import type { ReactNode } from "react";
import Link from "next/link";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";
import { requireAdminProfile } from "@/lib/admin/require-admin";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, profile } = await requireAdminProfile();

  return (
    <div className="admin-shell">
      <aside className="admin-shell__sidebar">
        <div className="admin-shell__brand">
          <span className="brand__mark" aria-hidden="true" />
          <div>
            <strong>Nikolman</strong>
            <span>Website admin</span>
          </div>
        </div>

        <nav className="admin-shell__nav" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="admin-shell__nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-shell__account">
          <p>{user.email}</p>
          <span>{profile.role}</span>
          <AdminSignOutButton />
        </div>
      </aside>

      <div className="admin-shell__main">
        <header className="admin-shell__header">
          <Link href="/en" className="admin-shell__site-link">
            View website
          </Link>
        </header>
        <div className="admin-shell__content">{children}</div>
      </div>
    </div>
  );
}
