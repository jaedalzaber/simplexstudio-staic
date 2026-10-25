import type { Route } from "next";
import { pages } from "./pages";
import type { ImageSlot } from "./types";

export interface Discipline {
  label: string;
  href: Route;
  image: ImageSlot;
}

export interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
}

export interface Value {
  icon: "briefcase" | "compass" | "target" | "puzzle";
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  photo: ImageSlot;
}

export const disciplines: readonly Discipline[] = [
  { label: "Design", href: pages.expertise.path, image: { src: "/images/about/hover-design.webp", alt: "", width: 585, height: 1203 } },
  { label: "Develop", href: pages.expertise.path, image: { src: "/images/about/hover-develop.webp", alt: "", width: 585, height: 1203 } },
  { label: "Growth", href: pages.expertise.path, image: { src: "/images/about/hover-growth.webp", alt: "", width: 585, height: 1203 } },
];

export const teamPhoto: ImageSlot = { alt: "The Simplex Studio team together in the office", width: 1306, height: 701 };

// The design repeats its first row of figures; replace the second row with approved numbers.
export const impactStats: readonly ImpactStat[] = [
  { value: 40, suffix: "+", label: "International design awards" },
  { value: 200, suffix: "+", label: "Successfully delivered projects" },
  { value: 10, suffix: "", label: "Years average collaboration duration" },
  { value: 40, suffix: "+", label: "International design awards" },
  { value: 200, suffix: "+", label: "Successfully delivered projects" },
  { value: 10, suffix: "", label: "Years average collaboration duration" },
];

const studio = (alt: string, width: number): ImageSlot => ({ alt, width, height: 359 });

export const galleryRows: readonly (readonly ImageSlot[])[] = [
  [
    studio("A designer at a desk in the studio", 281),
    studio("Three teammates reviewing work on a laptop", 336),
    studio("Developers at their desks in a bright open office", 523),
    studio("Two teammates in conversation in the lounge", 261),
  ],
  [
    studio("Engineers working side by side", 279),
    studio("Part of the team smiling together", 522),
    studio("A teammate relaxing between sessions", 336),
    studio("The studio meeting room", 261),
  ],
];

export const values: readonly Value[] = [
  { icon: "briefcase", title: "Collaborative ownership", description: "Every project has our full collective mind, with zero internal bureaucracy. We don’t work in silos or hide behind account managers." },
  { icon: "compass", title: "End-to-End Leadership", description: "Every team member takes full ownership of their part of your business. We take initiative, spot risks early, and drive projects forward." },
  { icon: "target", title: "Outcome Over Output", description: "We measure success by business impact. We focus strictly on solving your real bottlenecks and moving the metrics that grow your business." },
  { icon: "puzzle", title: "Practical Tech & Innovation", description: "AI, new frameworks, and automation aren’t buzzwords to us — we implement modern technology to optimize your processes." },
];

// The design uses one placeholder name for every card; replace with the real team.
const member = (alt: string): TeamMember => ({
  name: "Jaed Al Zaber",
  role: "CEO & Creative Director",
  photo: { alt, width: 340, height: 365 },
});

export const team: readonly TeamMember[] = [
  member("Portrait of a team member"),
  member("Portrait of a team member"),
  member("Portrait of a team member"),
  member("Portrait of a team member"),
  member("Portrait of a team member"),
];
