import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { contactDetails, navLinks } from "@/lib/siteContent";

export default async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const contact = await getTranslations("contact");
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <Link href="/" className="brand brand--footer">
            <span className="brand__mark" aria-hidden="true" />
            <span className="brand__text">Nikolman</span>
          </Link>
          <p>{t("description")}</p>
        </div>

        <div className="site-footer__column">
          <h2>{t("navigation")}</h2>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{nav(link.labelKey)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__column">
          <h2>{t("contact")}</h2>
          <ul>
            {contactDetails.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <span>{contact(item.labelKey)}</span>
                  {item.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>
          &copy; {year} Nikolman. {t("copyright")}
        </p>
        <nav className="site-footer__legal" aria-label={t("legalNavigation")}>
          <Link href="/privacy">{t("privacy")}</Link>
          <span aria-hidden="true">•</span>
          <p>{t("tagline")}</p>
        </nav>
      </div>
    </footer>
  );
}
