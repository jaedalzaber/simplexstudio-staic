import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";
import { articles } from "@/content/blog";
import { caseStudies } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable) return [];
  const published = Object.values(pages)
    .filter((page) => page.status === "published")
    .map((page) => ({ url: `${siteConfig.url}${page.path}` }));
  const studies = pages.work.status === "published"
    ? caseStudies().map((entry) => ({ url: `${siteConfig.url}/work/${entry.slug}` }))
    : [];
  const articleUrls = pages.blog.status === "published"
    ? articles().map((post) => ({ url: `${siteConfig.url}/blog/${post.slug}`, lastModified: post.date }))
    : [];
  return [...published, ...studies, ...articleUrls];
}
