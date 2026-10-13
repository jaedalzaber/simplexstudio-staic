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

export interface Expertise extends ContentEntry { serviceSlugs: string[]; }
export interface Service extends ContentEntry { expertiseSlug: string; }
export interface Work extends ContentEntry {
  serviceSlugs: string[];
  cover?: ContentImage;
  client?: string;
  industry?: string;
}
export interface PricingPlan extends ContentEntry {
  price?: string;
  features: string[];
  serviceSlugs: string[];
}
