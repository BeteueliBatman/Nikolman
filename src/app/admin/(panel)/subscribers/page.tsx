import { getNewsletterSubscribers } from "@/lib/admin/subscribers";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminSubscribersPage() {
  const subscribers = await getNewsletterSubscribers();

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Newsletter</span>
        <h1>Subscribers</h1>
        <p className="admin-page__lead">
          Email addresses collected from the newsroom newsletter form.
        </p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Email</th>
              <th>Locale</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length ? (
              subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{formatDate(subscriber.created_at)}</td>
                  <td>
                    <a href={`mailto:${subscriber.email}`}>{subscriber.email}</a>
                  </td>
                  <td>{subscriber.locale}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="admin-table__empty">
                  No newsletter subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
