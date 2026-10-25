import type { Route } from "next";
import type { Work, WorkCategory } from "./types";

export const workCategories: readonly WorkCategory[] = ["Design", "Development", "Growth"];

const card = (alt: string, wide = false) => ({ alt, width: wide ? 825 : 620, height: wide ? 574 : 482 });

// Titles and meta follow the supplied design. Cards repeat its placeholder
// copy until each project's approved title, industry, and location arrive.
// Add `src` to a cover to replace its grey placeholder.
export const work: Work[] = [
  {
    slug: "ridgeline",
    title: "From paper reports in a helicopter to ML forecasting: How we built a closed B2G ecosystem for U.S. government departments",
    summary: "",
    status: "published",
    serviceSlugs: [],
    cover: card("Survey mapping app on a tablet"),
    industry: "Auctions, Heavy Machinery",
    location: "Australia",
    categories: ["Design", "Development"],
  },
  {
    slug: "yumed",
    title: "From paper reports in a helicopter to ML forecasting: How we built a closed B2G ecosystem for U.S. government departments",
    summary: "",
    status: "published",
    serviceSlugs: [],
    cover: card("Patient portal dashboard on a laptop"),
    industry: "Auctions, Heavy Machinery",
    location: "Australia",
    categories: ["Design", "Development"],
  },
  {
    slug: "slattery-auctions",
    title: "How a Business-Driven UX Strategy Accelerated the Growth of an Australian Auction Platform",
    summary: "Slattery Auctions sells vehicles, heavy machinery, and general goods to buyers across Australia. We rebuilt the buying journey on web and mobile around how bidders really search, compare, and bid.",
    status: "published",
    serviceSlugs: [],
    cover: card("Slattery Auctions website on a desktop monitor, featuring weekly car auctions", true),
    client: "Slattery Auctions",
    industry: "Auctions, Heavy Machinery",
    location: "Australia",
    categories: ["Design", "Development", "Growth"],
    // Placeholder narrative: replace with the approved case study copy.
    study: {
      services: ["UX strategy", "UX research", "UI design", "Design system"],
      platforms: "Web & mobile",
      stats: [
        { value: 12, suffix: "+", label: "Years on market" },
        { value: 98, suffix: "%", label: "Clients’ referral rate" },
        { value: 5, suffix: "+", label: "Years average collaboration duration" },
      ],
      chapters: [
        {
          label: "Challenge",
          title: "A growing catalogue that had outgrown its interface",
          body: [
            "Every auction category, from family cars to excavators, had grown its own way of presenting lots. Bidders had to relearn the page each time they switched categories, and the most valuable listings were the hardest to find.",
            "The business needed a single experience that could carry weekly car auctions and large machinery sales alike, without slowing the team down on launch day.",
          ],
          image: { alt: "Category navigation across vehicles, trucks, heavy equipment, agriculture, and marine lots", width: 1760, height: 1148 },
        },
        {
          label: "Approach",
          title: "Research first, then one system for every lot",
          body: [
            "We interviewed bidders and the auction team, mapped how people moved from discovery to bid, and tested the riskiest moments with prototypes before any visual design began.",
            "The result was a shared design system: one lot card, one search pattern, and one bidding flow that adapt to each category’s details rather than reinventing them.",
          ],
          image: { alt: "Slattery Auctions mobile app showing search results and a featured lot", width: 629, height: 461 },
        },
        {
          label: "Outcome",
          title: "A platform the team can grow with",
          body: [
            "Bidders now find relevant auctions faster and follow their lots across web and mobile. The team launches new categories with existing components instead of new builds.",
            "The partnership continues as the platform grows, with improvements shipped in regular, measured releases.",
          ],
        },
      ],
      gallery: [
        { alt: "Weekly car auctions landing page", width: 1200, height: 800 },
        { alt: "Lot detail page on mobile", width: 600, height: 800 },
        { alt: "Bidding flow on mobile", width: 600, height: 800 },
      ],
    },
  },
  {
    slug: "aquir",
    title: "From paper reports in a helicopter to ML forecasting: How we built a closed B2G ecosystem for U.S. government departments",
    summary: "",
    status: "published",
    serviceSlugs: [],
    cover: card("Hydration tracking app on a phone"),
    industry: "Auctions, Heavy Machinery",
    location: "Australia",
    categories: ["Design", "Growth"],
  },
  {
    slug: "element-x",
    title: "From paper reports in a helicopter to ML forecasting: How we built a closed B2G ecosystem for U.S. government departments",
    summary: "",
    status: "published",
    serviceSlugs: [],
    cover: card("Sports marketing platform on a desktop monitor"),
    industry: "Auctions, Heavy Machinery",
    location: "Australia",
    categories: ["Design", "Growth"],
  },
  {
    slug: "okko",
    title: "How a Business-Driven UX Strategy Accelerated the Growth of an Australian Auction Platform",
    summary: "",
    status: "published",
    serviceSlugs: [],
    cover: card("Fuel voucher app on a phone", true),
    industry: "Auctions, Heavy Machinery",
    location: "Australia",
    categories: ["Design", "Development"],
  },
];

/** Projects that have a published long-form case study page. */
export function caseStudies() {
  return work.filter((entry) => entry.status === "published" && entry.study);
}

/** A project as listed on cards: everything except the case study body, plus its page link. */
export type WorkTile = Omit<Work, "study"> & { href?: Route };

export function workTiles(entries: readonly Work[] = work): WorkTile[] {
  return entries
    .filter((entry) => entry.status === "published")
    .map(({ study, ...entry }) => ({ ...entry, href: study ? (`/work/${entry.slug}` as Route) : undefined }));
}
