import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { pages, type PageKey } from "@/content/pages";

export function pageMetadata(key: PageKey): Metadata {
  const page = pages[key];
  const index = siteConfig.indexable && page.status === "published";
  const description = page.description ?? siteConfig.description;
  return {
    title: key === "home" ? { absolute: siteConfig.name } : page.title,
    description,
    alternates: { canonical: page.path },
    robots: { index, follow: index },
    openGraph: {
      title: page.title,
      description,
      url: page.path,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
    },
  };
}
