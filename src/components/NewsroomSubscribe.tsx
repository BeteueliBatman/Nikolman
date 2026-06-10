"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type NewsroomSubscribeProps = {
  labels: {
    eyebrow: string;
    title: string;
    description: string;
    placeholder: string;
    button: string;
    success: string;
    note: string;
  };
};

export default function NewsroomSubscribe({ labels }: NewsroomSubscribeProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Connect this to a real email service or newsletter backend.
    setSubmitted(true);
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
            />
            <button className="button button--primary" type="submit">
              {labels.button}
            </button>
          </form>
        )}
        <p className="newsroom-subscribe__note">{labels.note}</p>
      </div>
    </div>
  );
}
