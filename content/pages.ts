import type { PublicationStatus } from "./types";
import type { Route } from "next";

export type PageKey = "home" | "expertise" | "services" | "work" | "about" | "blog" | "pricing" | "contact";
export interface PageDefinition {
  path: Route;
  title: string;
  status: PublicationStatus;
  description?: string;
}

export const pages: Record<PageKey, PageDefinition> = {
  home: { path: "/", title: "Simplex Studio", status: "draft" },
  expertise: { path: "/expertise", title: "Expertise", status: "draft" },
  services: { path: "/services", title: "Services", status: "draft" },
  work: { path: "/work", title: "Work", status: "draft" },
  about: { path: "/about", title: "About", status: "draft" },
  blog: { path: "/blog", title: "Insights", status: "draft", description: "Our thoughts, data, and trends on user experience, digital solutions, and business." },
  pricing: { path: "/pricing", title: "Pricing", status: "draft" },
  contact: { path: "/contact", title: "Contact", status: "draft" },
};
