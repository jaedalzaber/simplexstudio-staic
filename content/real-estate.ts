import type { Question } from "./home";
import type { ImageSlot } from "./types";

// Copy for /services/real-estate. The section strategy lives in
// docs/superpowers/specs/2026-10-25-real-estate-solution-content.md.

// Captured previews of the supplied client sites; these are project screenshots.
const masterPlanPreview: ImageSlot = { src: "/images/real-estate/hay-al-wafa-masterplan.png", alt: "Hay Al Wafa rendered master plan with property filters and selectable buildings", width: 1280, height: 720 };
const kitchenPreview: ImageSlot = { src: "/images/real-estate/lowes-kitchen-visualizer.png", alt: "Lowe’s 3D kitchen visualizer with options for cabinets, countertops, and flooring", width: 1280, height: 720 };

export const heroVisual = masterPlanPreview;

export const heroCapabilities = [
  { label: "3D rendering", href: "#visuals-title" },
  { label: "Tours and VR", href: "#tours-vr" },
  { label: "Property selection", href: "#selection-title" },
  { label: "3D configurators", href: "#configuration-title" },
] as const;

export const experience = "Working with real estate and property management clients in the UAE and USA.";

export interface Project {
  name: string;
  kind: string;
  text: string;
  url: string;
  image: ImageSlot;
}

// Captions describe the published experiences only; confirm our exact contribution before adding detail.
export const featuredProjects: readonly Project[] = [
  {
    name: "Hay Al Wafa",
    kind: "Interactive master plan",
    text: "An interactive master plan with filters for property type, availability, area, and price.",
    url: "https://hay-alwafa.voom.cc/master-plan",
    image: masterPlanPreview,
  },
  {
    name: "Type Five",
    kind: "Home builder website",
    text: "A website presenting customisable homes, available layouts, and the design and build process.",
    url: "https://www.typefive.com/",
    image: { alt: "Type Five website showing a customisable home", width: 640, height: 427 },
  },
  {
    name: "Quadplex 80",
    kind: "Property presentation",
    text: "A digital presentation for a Manhattan penthouse.",
    url: "https://quadplex80.com/",
    image: { alt: "Quadplex 80 penthouse presentation", width: 640, height: 427 },
  },
];

export const configurationProject: Project = {
  name: "Lowe’s Kitchen Visualizer",
  kind: "3D interior configuration",
  text: "Compare cabinet finishes, countertops, flooring, and other options in a rendered kitchen.",
  url: "https://kitchendesign2.lowes.com/kitchenvisualizer",
  image: kitchenPreview,
};

export const relatedProjects: readonly Project[] = [
  {
    name: "ABB Landscapes",
    kind: "Smart-home presentation",
    text: "A smart-home presentation.",
    url: "https://landscapes.abb.com/home/smart_city_h/buildings/bt_villa",
    image: { alt: "ABB smart-home villa presentation", width: 480, height: 320 },
  },
];

export const visualItems = [
  { id: "exterior-rendering", title: "Exterior and master-plan rendering", text: "Show buildings, landscaping, amenities, and the wider development in photorealistic views for property marketing." },
  { id: "interior-rendering", title: "Interior rendering", text: "Present furnished rooms, materials, lighting, and layouts so buyers can understand the space before visiting." },
  { id: "architectural-animation", title: "Architectural animation", text: "Walkthrough and flythrough films show how rooms, buildings, and outdoor spaces connect." },
  { id: "tours-vr", title: "360° web tours and VR", text: "Let buyers explore rooms and viewpoints in their browser. Add a dedicated headset-based VR experience where needed." },
] as const;

export const visualSequence: readonly { label: string; text: string; url: string; image: ImageSlot }[] = [
  { label: "Rendered master plan", text: "Hay Al Wafa · Development visualization and property selection", url: featuredProjects[0].url, image: masterPlanPreview },
  { label: "Interactive interior", text: "Lowe’s · Kitchen visualization and finish options", url: configurationProject.url, image: kitchenPreview },
];

export const configurationFeatures = [
  { title: "Compare layouts", text: "Explore room and kitchen arrangements before requesting design changes." },
  { title: "Preview materials", text: "Compare cabinet finishes, countertops, flooring, and fixtures in the same view." },
  { title: "Capture buyer preferences", text: "Connect selected options to an enquiry so your team can review the buyer’s requirements." },
] as const;

export const selectorLabels = ["Rendered master plans", "Plot and apartment selectors", "Availability integration"] as const;

export const websiteBenefits = [
  "Clear property information and mobile-friendly navigation.",
  "Enquiry forms that identify the property the buyer is interested in.",
  "Connections to the tools your sales team uses for follow-up.",
] as const;

export const managementGroups = [
  { title: "Listings and sales", items: ["Property details", "Availability", "Sales enquiries", "Follow-up tracking"] },
  { title: "Property operations", items: ["Tenant and owner access", "Maintenance requests", "Rent and payment tracking", "Reporting"] },
] as const;

export const managementRoles = ["Staff", "Tenants", "Owners"] as const;

// Add an approved management-system screenshot here when one is available; nothing renders until then.
export const managementScreenshot: ImageSlot | undefined = undefined;

export const steps = [
  { title: "Review", text: "Understand the development, buyers, property data, and team workflows." },
  { title: "Plan", text: "Agree the required visuals, features, integrations, budget, and timeline." },
  { title: "Create and build", text: "Produce the visuals and develop the agreed website and tools." },
  { title: "Launch and support", text: "Test the experience, prepare the team, and support updates." },
] as const;

export const questions: readonly Question[] = [
  { question: "Can you create the 3D models and renders?", answer: "Yes. We create models from architectural drawings or prepare existing models, then produce renders, animation, and tours. We confirm the plans and material references before starting." },
  { question: "Can buyers customise interiors as well as choose a unit?", answer: "Yes. We can build configurators for room layouts, finishes, and fixtures. Property selection identifies the unit; interior configuration helps buyers compare options within it." },
  { question: "Do buyers need a VR headset?", answer: "Web tours are designed for browser access. A headset is only needed for a dedicated VR experience." },
  { question: "Can availability connect to our sales system?", answer: "We review your property data and integration options, then agree how availability will be updated." },
  { question: "Can we use only part of the service?", answer: "Yes. Choose 3D rendering, animation, tours, a configurator, a website, management tools, or a combination. We agree the scope around your project." },
  { question: "What will it cost and how long will it take?", answer: "This depends on the development, visual assets, features, and integrations. We agree the budget and timeline after reviewing your requirements." },
];

// Illustrative development for the selector demo. Not a real project and not live data.
export type PropertyStatus = "Available" | "Reserved" | "Sold";
export type PlotType = "Villa" | "Townhouse";

export interface Plot {
  id: string;
  type: PlotType;
  area: number;
  bedrooms: number;
  status: PropertyStatus;
  /** Position on the plan, in the map's 800 × 520 viewBox. */
  shape: { x: number; y: number; width: number; height: number };
}

export interface Unit {
  id: string;
  floor: number;
  area: number;
  bedrooms: number;
  status: PropertyStatus;
}

const statusAt = (index: number): PropertyStatus => (index % 5 === 2 ? "Sold" : index % 7 === 4 ? "Reserved" : "Available");

export const demoPlots: readonly Plot[] = [
  ...Array.from({ length: 6 }, (_, index): Plot => ({
    id: `V${index + 1}`,
    type: "Villa",
    area: 420 + ((index * 37) % 110),
    bedrooms: index % 3 === 0 ? 5 : 4,
    status: statusAt(index),
    shape: { x: 40 + index * 100, y: 56, width: 88, height: 112 },
  })),
  ...Array.from({ length: 8 }, (_, index): Plot => ({
    id: `T${index + 1}`,
    type: "Townhouse",
    area: 220 + ((index * 13) % 45),
    bedrooms: 3,
    status: statusAt(index + 3),
    shape: { x: 40 + index * 74, y: 236, width: 64, height: 84 },
  })),
];

export const demoBuilding = { id: "A", name: "Building A", floors: 6, shape: { x: 662, y: 56, width: 104, height: 264 } } as const;

export const demoUnits: readonly Unit[] = Array.from({ length: demoBuilding.floors * 4 }, (_, index) => {
  const floor = Math.floor(index / 4) + 1;
  const position = (index % 4) + 1;
  return {
    id: `A-${floor}0${position}`,
    floor,
    area: [86, 112, 138, 96][position - 1],
    bedrooms: [1, 2, 3, 2][position - 1],
    status: statusAt(index + 1),
  };
});

// Home customisation in the selector demo. Each design is modelled for both villas and townhouses.
export type HomeDesign = "cubic" | "split" | "courtyard";
export type HomeFinish = "white" | "stone" | "timber";
export interface HomeConfig {
  design: HomeDesign;
  finish: HomeFinish;
  pool: boolean;
  solar: boolean;
}

export const homeDesigns: readonly { id: HomeDesign; label: string }[] = [
  { id: "cubic", label: "Cubic" },
  { id: "split", label: "Split volume" },
  { id: "courtyard", label: "Courtyard" },
];

export const homeFinishes: readonly { id: HomeFinish; label: string; swatch: string }[] = [
  { id: "white", label: "White render", swatch: "#f1efea" },
  { id: "stone", label: "Limestone", swatch: "#d6c4a4" },
  { id: "timber", label: "Charred timber", swatch: "#433f3b" },
];

export const homeExtras = [
  { id: "pool", label: "Pool" },
  { id: "solar", label: "Solar roof" },
] as const;

/** A varied but mostly white starting street, so the demo opens looking like a clean massing model. */
export function defaultHomeConfig(index: number): HomeConfig {
  return {
    design: homeDesigns[index % homeDesigns.length].id,
    finish: index % 5 === 3 ? "stone" : index % 7 === 5 ? "timber" : "white",
    pool: index % 3 !== 1,
    solar: index % 4 === 2,
  };
}
