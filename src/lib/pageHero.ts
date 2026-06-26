import type { CSSProperties } from "react";

export const navPageHeroImages = {
  projects: "/media/nav/პროექტები.jpg",
  newsroom: "/media/nav/სიახლეები.jpg",
  whoWeAre: "/media/nav/ჩვენ შესახებ.jpg",
  contact: "/media/nav/კონტაქტი.jpg",
} as const;

export type PageHeroAccent = "left" | "right";

export function pageHeroStyle(image: string): CSSProperties {
  return { "--page-image": `url("${encodeURI(image)}")` } as CSSProperties;
}
