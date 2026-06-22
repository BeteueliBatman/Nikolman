import { DB_TABLES } from "@/lib/db/tables";
import { createAuthServerClient } from "@/lib/supabase/server-auth";

type DashboardStat = {
  label: string;
  value: number;
  note: string;
};

async function getDashboardStats(): Promise<DashboardStat[]> {
  const supabase = await createAuthServerClient();

  const [projects, articles, contacts, subscribers] = await Promise.all([
    supabase.from(DB_TABLES.projects).select("id", { count: "exact", head: true }),
    supabase.from(DB_TABLES.articles).select("id", { count: "exact", head: true }),
    supabase
      .from(DB_TABLES.contactSubmissions)
      .select("id", { count: "exact", head: true }),
    supabase
      .from(DB_TABLES.newsletterSubscribers)
      .select("id", { count: "exact", head: true }),
  ]);

  return [
    {
      label: "Projects",
      value: projects.count ?? 0,
      note: "All records in website_projects",
    },
    {
      label: "Articles",
      value: articles.count ?? 0,
      note: "All records in website_articles",
    },
    {
      label: "Contact messages",
      value: contacts.count ?? 0,
      note: "Submissions from the contact form",
    },
    {
      label: "Newsletter subscribers",
      value: subscribers.count ?? 0,
      note: "Emails collected from newsroom",
    },
  ];
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Overview</span>
        <h1>Dashboard</h1>
        <p className="admin-page__lead">
          Manage projects, articles, contact messages, and newsletter subscribers.
        </p>
      </div>

      <div className="admin-stats">
        {stats.map((stat) => (
          <article className="admin-stat" key={stat.label}>
            <p className="admin-stat__label">{stat.label}</p>
            <p className="admin-stat__value">{stat.value}</p>
            <p className="admin-stat__note">{stat.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
