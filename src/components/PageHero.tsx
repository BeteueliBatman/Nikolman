import type { CSSProperties, ReactNode } from "react";
import type { PageHeroAccent } from "@/lib/pageHero";
import { pageHeroStyle } from "@/lib/pageHero";

type PageHeroProps = {
  image: string;
  accent: PageHeroAccent;
  children: ReactNode;
  className?: string;
};

export default function PageHero({
  image,
  accent,
  children,
  className = "",
}: PageHeroProps) {
  const classes = ["page-hero", `page-hero--accent-${accent}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} style={pageHeroStyle(image) as CSSProperties}>
      <div className="page-hero__media" aria-hidden="true" />
      <div className="page-hero__shade" aria-hidden="true" />
      <div className="page-hero__accent" aria-hidden="true" />
      <div className="page-hero__inner">{children}</div>
    </section>
  );
}
