"use client";

import type { ChangeEvent, CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { contactDetails } from "@/lib/siteContent";

function pageHeroStyle(image: string): CSSProperties {
  return { "--page-image": `url(${image})` } as CSSProperties;
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <section
        className="page-hero"
        style={pageHeroStyle("/media/projects/nikolman-contact-office.jpg")}
      >
        {/* TODO: Replace /media/projects/nikolman-contact-office.jpg with an uploaded Nikolman contact or office image. */}
        <div className="page-hero__inner">
          <span className="eyebrow">{t("hero.eyebrow")}</span>
          <h1>{t("hero.title")}</h1>
          <p className="section-lead">{t("hero.description")}</p>
        </div>
      </section>

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
              <a href="tel:+995599446464">+995 599 446464</a>
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
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="subject">{t("form.inquiryType")}</label>
                    <select
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
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
                  />
                </div>

                <button className="button button--primary" type="submit">
                  {t("form.sendButton")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
