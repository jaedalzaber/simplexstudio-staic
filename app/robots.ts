import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", ...(siteConfig.indexable ? { allow: "/", disallow: "/api/" } : { disallow: "/" }) },
    ...(siteConfig.indexable ? { sitemap: `${siteConfig.url}/sitemap.xml` } : {}),
  };
}
