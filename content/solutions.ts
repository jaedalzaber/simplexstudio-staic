import type { Route } from "next";
import type { ImageSlot } from "./types";

export interface Solution {
  slug: string;
  title: string;
  /** Short label shown on the visual card. */
  label: string;
  summary: string;
  highlights: readonly string[];
  image: ImageSlot & { src: string };
  /** Has its own route in app/(site)/services/<slug>; the generic placeholder page skips it. */
  ownPage?: true;
}

const image = (file: string, alt: string, width: number, height: number) => ({ src: `/images/solutions/${file}.webp`, alt, width, height });

// Copy describes what each solution covers; it makes no claims about results.
export const solutions: readonly Solution[] = [
  {
    slug: "ecommerce",
    title: "eCommerce",
    label: "Online retail",
    summary: "Storefronts that make products easy to find, compare, and buy, connected to the stock, payment, and fulfilment systems behind them.",
    highlights: ["Product discovery and search", "Checkout and payments", "Inventory and order sync", "Conversion-focused UX"],
    image: image("ecommerce", "Online store interface showing product listings", 919, 666),
    ownPage: true,
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    label: "Property",
    summary: "3D property rendering, virtual tours, unit selectors, and interior configurators, connected to websites and property management tools.",
    highlights: ["Interior and exterior rendering", "Web tours and 3D configurators", "Plot and apartment selection", "Property websites and management"],
    image: { src: "/images/real-estate/hay-al-wafa-masterplan.png", alt: "Rendered development master plan with interactive property selection", width: 1280, height: 720 },
    ownPage: true,
  },
  {
    slug: "booking-system",
    title: "Booking Systems",
    label: "Scheduling",
    summary: "Custom booking for appointments, reservations, spaces, and seats, with the websites, apps, and staff tools around it.",
    highlights: ["Appointments and reservations", "2D and 3D space selection", "Customer management", "Websites and apps"],
    image: image("booking-system", "Booking interface with a calendar and available time slots", 960, 610),
    ownPage: true,
  },
  {
    slug: "industrial-erp",
    title: "Manufacturing & Logistics",
    label: "Operations",
    summary: "Custom manufacturing ERP and logistics software, with 3D product configurators, factory digital twins, and VR/AR training.",
    highlights: ["Custom manufacturing ERP", "3D configuration and quoting", "Warehouse and logistics software", "Digital twins and VR/AR training"],
    image: image("industrial-erp", "Manufacturing ERP dashboard with production and inventory data", 960, 562),
    ownPage: true,
  },
  {
    slug: "saas-launch",
    title: "SaaS Launch",
    label: "Software products",
    summary: "From the first prototype to a product people pay for: onboarding, subscriptions, and the analytics to learn from every release.",
    highlights: ["MVP scope and prototyping", "Onboarding and activation", "Subscriptions and billing", "Product analytics"],
    image: image("saas-launch", "SaaS product dashboard on launch", 796, 548),
  },
  {
    slug: "product-launch",
    title: "Product Launch",
    label: "Go-to-market",
    summary: "Everything a new product needs on day one: a brand, a website that explains it, and campaigns that bring the right people to it.",
    highlights: ["Brand and visual identity", "Launch website", "Campaign creative", "Lead generation setup"],
    image: image("product-launch", "Product launch website and campaign visuals", 960, 548),
  },
];

export function solutionHref(solution: Solution) {
  return `/services/${solution.slug}` as Route;
}
