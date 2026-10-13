import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable) return [];
  return Object.values(pages)
    .filter((page) => page.status === "published")
    .map((page) => ({ url: `${siteConfig.url}${page.path}` }));
}
