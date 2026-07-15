import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="not-found">
      <div className="not-found__inner">
        <span className="not-found__code" aria-hidden="true">
          404
        </span>
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <div className="not-found__actions">
          <Link className="button button--primary" href="/">
            {t("home")}
          </Link>
          <Link className="button button--secondary" href="/contact">
            {t("contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
