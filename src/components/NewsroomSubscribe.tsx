"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

type NewsroomSubscribeProps = {
  locale: string;
  labels: {
    eyebrow: string;
    title: string;
    description: string;
    placeholder: string;
    button: string;
    success: string;
    note: string;
    error: string;
    rateLimited: string;
    submitting: string;
    consentPrefix: string;
    consentLink: string;
    consentSuffix: string;
  };
};

export default function NewsroomSubscribe({
  locale,
  labels,
}: NewsroomSubscribeProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          locale,
          privacyAccepted: formData.get("privacyAccepted") === "on",
          _hp: formData.get("_hp"),
        }),
      });

      if (response.status === 429) {
        setError(labels.rateLimited);
        return;
      }

      if (!response.ok) {
        setError(labels.error);
        return;
      }

      setSubmitted(true);
    } catch {
      setError(labels.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="newsroom-subscribe__inner">
      <div className="newsroom-subscribe__copy">
        <span className="eyebrow">{labels.eyebrow}</span>
        <h2>{labels.title}</h2>
        <p>{labels.description}</p>
      </div>

      <div className="newsroom-subscribe__panel">
        {submitted ? (
          <p className="newsroom-subscribe__success">{labels.success}</p>
        ) : (
          <form className="newsroom-subscribe__form" onSubmit={handleSubmit}>
            <label className="newsroom-visually-hidden" htmlFor="newsroom-email">
              {labels.placeholder}
            </label>
            <input
              id="newsroom-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={labels.placeholder}
              disabled={submitting}
            />
            <input
              className="newsroom-visually-hidden"
              type="text"
              name="_hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <button
              className="button button--primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? labels.submitting : labels.button}
            </button>
            <label className="newsroom-subscribe__consent">
              <input
                name="privacyAccepted"
                type="checkbox"
                required
                disabled={submitting}
              />
              <span>
                {labels.consentPrefix}{" "}
                <Link href="/privacy">{labels.consentLink}</Link>
                {labels.consentSuffix}
              </span>
            </label>
            {error ? (
              <p className="newsroom-subscribe__error" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
        <p className="newsroom-subscribe__note">{labels.note}</p>
      </div>
    </div>
  );
}
