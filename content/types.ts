export type PublicationStatus = "draft" | "published";

export interface ContentEntry {
  slug: string;
  title: string;
  summary: string;
  status: PublicationStatus;
  seo?: { title?: string; description?: string };
}

export interface ContentImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** An image position. Leave `src` out to show a grey placeholder of the same proportions. */
export interface ImageSlot {
  src?: string;
  alt: string;
  width: number;
  height: number;
}

export interface Expertise extends ContentEntry { serviceSlugs: string[]; }
export interface Service extends ContentEntry { expertiseSlug: string; }

export type WorkCategory = "Design" | "Development" | "Growth";

export interface CaseStudyChapter {
  label: string;
  title: string;
  body: string[];
  image?: ImageSlot;
}

/** Long-form content for a project's own page. Only projects with a study get a detail route. */
export interface CaseStudy {
  services: string[];
  platforms: string;
  stats: { value: number; suffix: string; label: string }[];
  chapters: CaseStudyChapter[];
  gallery: ImageSlot[];
}

export interface Work extends ContentEntry {
  serviceSlugs: string[];
  cover: ImageSlot;
  client?: string;
  industry: string;
  location: string;
  categories: WorkCategory[];
  study?: CaseStudy;
}
export type BlogCategory = "Design" | "Software" | "Lead Generation";

/** One piece of an article body; headings feed the table of contents. */
export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "list"; ordered?: boolean; items: { lead?: string; text: string }[] }
  | { type: "figure"; image: ImageSlot; caption?: string }
  | { type: "video"; poster: ImageSlot; caption: string; href?: string }
  | { type: "callout"; text: string };

export interface BlogAuthor {
  name: string;
  role: string;
  photo: ImageSlot;
}

/** A blog post. Only posts with a `body` get their own page. */
export interface BlogPost extends ContentEntry {
  /** ISO date, e.g. "2026-10-23". */
  date: string;
  readMinutes: number;
  categories: BlogCategory[];
  cover: ImageSlot;
  author?: BlogAuthor;
  body?: ArticleBlock[];
}

export interface PricingPlan extends ContentEntry {
  price?: string;
  features: string[];
  serviceSlugs: string[];
}
