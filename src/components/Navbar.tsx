"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { navLinks } from "@/lib/siteContent";
import { useEffect, useState } from "react";

type Locale = "en" | "ka";

export default function Navbar() {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isSolid, setIsSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const updateHeader = () => setIsSolid(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  function switchLocale(nextLocale: Locale) {
    setMenuOpen(false);
    router.replace(pathname || "/", { locale: nextLocale });
  }

  return (
    <header className={`site-header ${isSolid || menuOpen ? "is-solid" : ""}`}>
      <div className="site-header__bar">
        <Link href="/" className="brand" aria-label={common("brandHome")}>
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__text">Nikolman</span>
        </Link>

        <nav className="primary-nav" aria-label={t("primaryNavigation")}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`primary-nav__link ${
                pathname === link.href ? "is-active" : ""
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="language-switcher" aria-label={common("languageSelector")}>
            <button
              className={`language-switcher__option ${
                locale === "en" ? "is-active" : ""
              }`}
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => switchLocale("en")}
            >
              EN
            </button>
            <span className="language-switcher__divider" aria-hidden="true" />
            <button
              className={`language-switcher__option ${
                locale === "ka" ? "is-active" : ""
              }`}
              type="button"
              aria-pressed={locale === "ka"}
              onClick={() => switchLocale("ka")}
            >
              GE
            </button>
          </div>

          <button
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            type="button"
            aria-label={t("toggleMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label={t("mobileNavigation")}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "is-active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
