"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteNewsletterSubscribers } from "@/lib/admin/subscribers";
import type { NewsletterSubscriberRow } from "@/lib/db/types";

type AdminSubscribersBoardProps = {
  subscribers: NewsletterSubscriberRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export default function AdminSubscribersBoard({
  subscribers,
}: AdminSubscribersBoardProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [copyNote, setCopyNote] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return subscribers;
    }

    return subscribers.filter((subscriber) => {
      const haystack = [subscriber.email, subscriber.locale]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [subscribers, query]);

  const filteredIds = filtered.map((subscriber) => subscriber.id);
  const allFilteredSelected =
    filtered.length > 0 &&
    filtered.every((subscriber) => selected.includes(subscriber.id));

  function toggleOne(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  }

  function toggleAllFiltered() {
    if (allFilteredSelected) {
      setSelected((current) =>
        current.filter((id) => !filteredIds.includes(id))
      );
      return;
    }

    setSelected((current) => [...new Set([...current, ...filteredIds])]);
  }

  function showCopyNote(text: string) {
    setCopyNote(text);
    window.setTimeout(() => setCopyNote(""), 2000);
  }

  async function handleCopyEmails(emails: string[]) {
    const unique = [...new Set(emails.map((email) => email.trim()).filter(Boolean))];

    if (!unique.length) {
      return;
    }

    await copyText(unique.join(", "));
    showCopyNote(`Copied ${unique.length} email${unique.length === 1 ? "" : "s"}.`);
  }

  function handleDeleteSelected() {
    if (!selected.length) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selected.length} subscriber${selected.length === 1 ? "" : "s"}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("ids", selected.join(","));

    startTransition(() => {
      void deleteNewsletterSubscribers(formData);
    });
  }

  const selectedEmails = subscribers
    .filter((subscriber) => selected.includes(subscriber.id))
    .map((subscriber) => subscriber.email);

  return (
    <>
      <div className="admin-inbox-toolbar">
        <label className="admin-field admin-inbox-toolbar__search">
          <span>Filter</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search email or locale"
          />
        </label>

        <div className="admin-inbox-toolbar__actions">
          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={() =>
              void handleCopyEmails(filtered.map((subscriber) => subscriber.email))
            }
            disabled={!filtered.length}
          >
            Copy all visible emails
          </button>
          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={() => void handleCopyEmails(selectedEmails)}
            disabled={!selectedEmails.length}
          >
            Copy selected emails
          </button>
          <button
            type="button"
            className="admin-button admin-button--danger"
            onClick={handleDeleteSelected}
            disabled={!selected.length || pending}
          >
            {pending ? "Deleting..." : "Delete selected"}
          </button>
        </div>
      </div>

      {copyNote ? <p className="admin-form-note">{copyNote}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-table__check">
                <input
                  type="checkbox"
                  aria-label="Select all visible subscribers"
                  checked={allFilteredSelected}
                  onChange={toggleAllFiltered}
                />
              </th>
              <th>Date</th>
              <th>Email</th>
              <th>Locale</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="admin-table__check">
                    <input
                      type="checkbox"
                      aria-label={`Select ${subscriber.email}`}
                      checked={selected.includes(subscriber.id)}
                      onChange={() => toggleOne(subscriber.id)}
                    />
                  </td>
                  <td>{formatDate(subscriber.created_at)}</td>
                  <td>
                    <a href={`mailto:${subscriber.email}`}>{subscriber.email}</a>
                  </td>
                  <td>{subscriber.locale}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() =>
                          void handleCopyEmails([subscriber.email]).then(() =>
                            showCopyNote("Email copied.")
                          )
                        }
                      >
                        Copy email
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="admin-table__empty">
                  {subscribers.length
                    ? "No subscribers match this filter."
                    : "No newsletter subscribers yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
