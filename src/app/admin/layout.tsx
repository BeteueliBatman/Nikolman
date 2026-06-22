import type { ReactNode } from "react";
import "../globals.css";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="admin-body">{children}</body>
    </html>
  );
}
