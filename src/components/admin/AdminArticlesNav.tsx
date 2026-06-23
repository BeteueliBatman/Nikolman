import Link from "next/link";

type AdminArticlesNavProps = {
  active: "articles" | "media";
};

export default function AdminArticlesNav({ active }: AdminArticlesNavProps) {
  return (
    <nav className="admin-subnav" aria-label="Articles section">
      <Link
        href="/admin/articles"
        className={`admin-subnav__link ${active === "articles" ? "is-active" : ""}`}
        aria-current={active === "articles" ? "page" : undefined}
      >
        Articles
      </Link>
      <Link
        href="/admin/articles/media"
        className={`admin-subnav__link ${active === "media" ? "is-active" : ""}`}
        aria-current={active === "media" ? "page" : undefined}
      >
        Media center
      </Link>
    </nav>
  );
}
