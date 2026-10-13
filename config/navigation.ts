import { pages } from "@/content/pages";
import type { Route } from "next";

export interface NavigationLink {
  label: string;
  href: Route;
}

export interface NavigationItem extends NavigationLink {
  children?: readonly NavigationLink[];
}

// Expand dropdowns here as the corresponding pages are implemented.
export const primaryNavigation: readonly NavigationItem[] = [
  {
    label: "Capabilities",
    href: pages.expertise.path,
    children: [{ label: "All capabilities", href: pages.expertise.path }],
  },
  {
    label: "Services",
    href: pages.services.path,
    children: [{ label: "All services", href: pages.services.path }],
  },
  { label: "Work", href: pages.work.path },
  { label: "About", href: pages.about.path },
  { label: "Pricing", href: pages.pricing.path },
];

export const contactNavigation: NavigationLink = {
  label: "Contact us",
  href: pages.contact.path,
};
