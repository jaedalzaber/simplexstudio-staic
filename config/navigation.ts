import { pages } from "@/content/pages";
import type { Route } from "next";

export interface NavigationLink {
  label: string;
  href: Route;
}

export type NavigationMenu = "capabilities" | "solutions";

export interface NavigationItem extends NavigationLink {
  menu?: NavigationMenu;
}

export interface CapabilityLink extends NavigationLink {
  icon: string;
}

export interface CapabilityGroup {
  title: string;
  links: readonly CapabilityLink[];
}

export interface SolutionLink extends NavigationLink {
  image: string;
}

export interface FooterGroup {
  title: string;
  links: readonly NavigationLink[];
}

export const primaryNavigation: readonly NavigationItem[] = [
  { label: "Capabilities", href: pages.expertise.path, menu: "capabilities" },
  { label: "Solutions", href: pages.services.path, menu: "solutions" },
  { label: "Work", href: pages.work.path },
  { label: "About", href: pages.about.path },
  { label: "Pricing", href: pages.pricing.path },
];

export const contactNavigation: NavigationLink = {
  label: "Contact us",
  href: pages.contact.path,
};

// Capability icons ship in /public/icons under their exported file names.
const icon = (file: string) => `/icons/${encodeURIComponent(file)}`;
const capability = (label: string, file: string): CapabilityLink => ({ label, href: pages.expertise.path, icon: icon(file) });

export const capabilityGroups: readonly CapabilityGroup[] = [
  {
    title: "Design",
    links: [
      capability("Digital Branding & Graphic Design", "67c9f046b30f515ed4cec13a_icon_5 1.svg"),
      capability("User Experience Design (UX)", "67dd83f1387b2f65c7523229_window-cursor (1) 1.svg"),
      capability("Visual Product Design (UI)", "67c9f04fbabd3c136dcd052c_icon_4 1.svg"),
      capability("Design Systems", "67c9eeb32f2ec94f85a1ccf4_icon_15 1.svg"),
      capability("Wireframe & Prototyping", "Vector.svg"),
      capability("Product Design", "67dd7534cc12877ca3c7c685_push 1.svg"),
      capability("3D Product Rendering & Viz", "Vector-1.svg"),
      capability("Motion & 2D/3D Design", "67c9f0b7d3b1a49af922ffdd_icon_16 1.svg"),
      capability("Content Creation", "67c9ee5addb6a5c59359376d_icon_2 1.svg"),
    ],
  },
  {
    title: "Development",
    links: [
      capability("MVP Development", "67dd806ad655241c3a91923c_Vector (8) 1.svg"),
      capability("Web development", "Vector-2.svg"),
      capability("App development", "Vector-3.svg"),
      capability("Software development", "Vector-4.svg"),
      capability("SaaS Development", "Vector-5.svg"),
      capability("DevOps & Cloud consulting", "Vector-6.svg"),
      capability("AI & Machine Learning", "Vector-7.svg"),
      capability("AR/VR", "Vector-8.svg"),
      capability("3D Technology", "Vector-9.svg"),
      capability("Robotics", "Vector-10.svg"),
    ],
  },
  {
    title: "Growth",
    links: [
      capability("Conversion Rate Optimization (CRO)", "67dd80387aa55a9d1cdc67a1_trending-4 1.svg"),
      capability("Website Redesign", "67dd8143bd182b5e0eefc509_sparkles-two 1.svg"),
      capability("Google Business Profile Optimization", "google-my-business-svgrepo-com 1.svg"),
      capability("SEO & GEO", "Vector-11.svg"),
      capability("Media Buying", "Vector-12.svg"),
      capability("Pay-Per-Click Advertising", "Vector-13.svg"),
      capability("Social Media Advertising", "Vector-14.svg"),
      capability("Data and Analytics", "image 563.svg"),
    ],
  },
];

const solution = (label: string, image: string): SolutionLink => ({ label, href: pages.services.path, image: `/images/solutions/${image}.webp` });

export const solutionLinks: readonly SolutionLink[] = [
  solution("eCommerce", "ecommerce"),
  solution("Property Management", "property-management"),
  solution("Booking System", "booking-system"),
  solution("Industrial ERP", "industrial-erp"),
  solution("SaaS Launch", "saas-launch"),
  solution("Product Launch", "product-launch"),
];

export const footerNavigation: readonly FooterGroup[] = [
  {
    title: "Customer experience",
    links: [
      { label: "Digital product design", href: pages.expertise.path },
      { label: "AI product design", href: pages.expertise.path },
      { label: "UI/UX design", href: pages.expertise.path },
      { label: "UX consulting", href: pages.expertise.path },
      { label: "UX audit services", href: pages.expertise.path },
      { label: "Usability testing services", href: pages.expertise.path },
      { label: "B2B design", href: pages.expertise.path },
    ],
  },
  {
    title: "Technology scale",
    links: [
      { label: "Digital product design", href: pages.services.path },
      { label: "AI product design", href: pages.services.path },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "UX consulting", href: pages.services.path },
      { label: "UX audit services", href: pages.services.path },
      { label: "Usability testing services", href: pages.services.path },
    ],
  },
];
