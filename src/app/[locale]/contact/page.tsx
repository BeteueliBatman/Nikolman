"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import PageHero from "@/components/PageHero";
import { navPageHeroImages } from "@/lib/pageHero";
import { contactDetails } from "@/lib/siteContent";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function handleChange(
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          locale,
          _hp: formData.get("_hp"),
        }),
      });

      if (response.status === 429) {
        setError(t("errors.rateLimited"));
        return;
      }

      if (!response.ok) {
        setError(t("errors.generic"));
        return;
      }

      setSubmitted(true);
    } catch {
      setError(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero image={navPageHeroImages.contact} accent="right">
        <span className="eyebrow">{t("hero.eyebrow")}</span>
        <h1>{t("hero.title")}</h1>
        <p className="section-lead">{t("hero.description")}</p>
      </PageHero>

      <section className="section">
        <div className="section-inner contact-grid">
          <aside className="contact-aside">
            <div>
              <span className="eyebrow">{t("directContact")}</span>
              {contactDetails.map((detail) => (
                <div className="contact-detail" key={detail.href}>
                  <span>{t(detail.labelKey)}</span>
                  <a
                    href={detail.href}
                    target={detail.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      detail.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {detail.value}
                  </a>
                </div>
              ))}
            </div>

            <div className="call-panel">
              <span>{t("preferToTalk")}</span>
              <a href="tel:+995599446464">+995 599 44 64 64</a>
              <p>{t("workingHours")}</p>
            </div>
          </aside>

          <div>
            <div className="section-header">
              <span className="eyebrow">{t("sendMessage")}</span>
            </div>

            {submitted ? (
              <div className="success-panel">
                <strong>
                  {t("success.title", {
                    name: form.name || t("form.namePlaceholder"),
                  })}
                </strong>
                <p>{t("success.message")}</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">{t("form.fullName")} *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder={t("form.namePlaceholder")}
                      disabled={submitting}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="email">{t("form.email")} *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="phone">{t("form.phone")}</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+995 5xx xxx xxx"
                      disabled={submitting}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="subject">{t("form.inquiryType")}</label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      disabled={submitting}
                    >
                      <option value="">{t("form.selectTopic")}</option>
                      <option>{t("form.standardProducts")}</option>
                      <option>{t("form.wallPanels")}</option>
                      <option>{t("form.customStructures")}</option>
                      <option>{t("form.modularStructures")}</option>
                      <option>{t("form.residentialProject")}</option>
                      <option>{t("form.commercialProject")}</option>
                      <option>{t("form.medicalFacility")}</option>
                      <option>{t("form.generalInquiry")}</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="message">{t("form.message")} *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder={t("form.messagePlaceholder")}
                    disabled={submitting}
                  />
                </div>

                <input
                  className="newsroom-visually-hidden"
                  type="text"
                  name="_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {error ? (
                  <p className="contact-form__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <button
                  className="button button--primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? t("form.sending") : t("form.sendButton")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
