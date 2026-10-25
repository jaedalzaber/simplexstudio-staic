import type { Question } from "./home";
import type { ImageSlot } from "./types";

// Copy for /services/ecommerce. The current audit and section strategy live in
// docs/superpowers/specs/2026-10-25-ecommerce-content-audit.md.

export const disciplines = ["Branding", "3D visuals", "Animation", "Product configurators", "Store development", "Marketing support"] as const;

export const heroFilm: ImageSlot = { alt: "Product film: a client product rotating, separating into parts, and switching finishes", width: 1600, height: 900 };

export const clientNames = ["ZETR", "REFIRE", "Mute", "HHHusher", "Ziemi"] as const;

export const facts = [
  { value: 10, suffix: "", label: "Years in business" },
  { value: 500, suffix: "+", label: "Products launched" },
  { value: 25, suffix: "+", label: "In-house specialists" },
  { value: 5, suffix: "", label: "Regions: USA, Europe, Middle East, Asia, Australia" },
] as const;

export const situations = [
  { title: "Launching a product online", text: "Create the brand, product content, and online store you need for launch." },
  { title: "Explaining a complex product", text: "Help customers understand its features, materials, and how it works." },
  { title: "Simplifying custom orders", text: "Let customers choose options and request a quote without repeated emails." },
  { title: "Updating your brand and store", text: "Improve your existing store’s design, buying process, and business systems." },
] as const;

export interface Outcome {
  title: string;
  text: string;
  madeWith: readonly string[];
  image: ImageSlot;
}

const visual = (alt: string): ImageSlot => ({ alt, width: 800, height: 520 });

export const outcomes: readonly Outcome[] = [
  {
    title: "Explain product features",
    text: "Use 3D renders and animation to show materials, product details, and how the product works. Help customers understand what they’re buying.",
    madeWith: ["3D modelling", "Rendering", "Animation"],
    image: visual("Exploded 3D render of a product showing its internal parts"),
  },
  {
    title: "Simplify product selection and quoting",
    text: "Let customers choose sizes, finishes, and options in 3D. Apply your pricing rules or collect the details your sales team needs to prepare a quote.",
    madeWith: ["3D configurator", "Product configurator", "Pricing logic"],
    image: visual("3D product configurator with finish swatches and a live price"),
  },
  {
    title: "Build a consistent brand",
    text: "Create a new identity or update your existing brand. Apply it consistently across your store, packaging, and marketing.",
    madeWith: ["Branding", "Art direction"],
    image: visual("Brand identity applied to packaging and a product page"),
  },
  {
    title: "Manage products and orders",
    text: "Connect a custom storefront, admin tools, and apps to your product and order workflows. Integrate payments, inventory, and ERP where needed.",
    madeWith: ["Store design", "Web & app development", "ERP integration"],
    image: visual("Custom storefront on desktop and mobile beside its admin dashboard"),
  },
  {
    title: "Prepare store and campaign content",
    text: "Use the same 3D product models to create images, animations, ads, and sales materials. Update them as your product range changes.",
    madeWith: ["3D visuals", "Animation", "Marketing content"],
    image: visual("One product render reused across an ad, a store page, and a sales deck"),
  },
  {
    title: "Improve your store after launch",
    text: "Use store data and customer feedback to improve product pages, checkout, and campaigns. Get design and development support for new product launches.",
    madeWith: ["Conversion testing", "Search optimisation", "Campaigns"],
    image: visual("Growth dashboard with conversion and traffic trends"),
  },
];

export interface Project {
  name: string;
  industry: string;
  text: string;
  url: string;
  image: ImageSlot;
}

// The brief identifies these as our work. Describe the product experience,
// without implying we delivered every part of each site or claiming results.
export const projects: readonly Project[] = [
  {
    name: "REFIRE",
    industry: "Hydrogen & fuel-cell systems",
    text: "A product website explaining hydrogen fuel-cell systems and their technical features.",
    url: "https://refire.heycusp.com/products",
    image: { alt: "REFIRE fuel-cell system render", width: 1330, height: 640 },
  },
  {
    name: "Mute · Jetson",
    industry: "Office pods",
    text: "A 3D configurator for choosing pod sizes, finishes, and fabrics before requesting a quote.",
    url: "https://www.mute.design/jetson/",
    image: { alt: "Mute Jetson office pod configurator", width: 640, height: 480 },
  },
  {
    name: "ZETR",
    industry: "Architectural electrical hardware",
    text: "A catalogue of switches and outlets, with finish options and tools for project enquiries.",
    url: "https://www.zetr.co/",
    image: { alt: "ZETR switches in brass and black finishes", width: 640, height: 480 },
  },
  {
    name: "Ziemi",
    industry: "Cycling safety",
    text: "An online bike light store with product explanations, bundles, and direct checkout.",
    url: "https://www.ziemi.com/nl/nl/producten/biomotion-licht/",
    image: { alt: "Ziemi Biomotion light illuminating a cyclist’s moving legs", width: 640, height: 480 },
  },
  {
    name: "HHHusher",
    industry: "Pro audio",
    text: "A product website showing drummers and recording engineers how a hi-hat enclosure works and how to install it.",
    url: "https://www.hhhusher.com/",
    image: { alt: "HHHusher hi-hat enclosure on a drum kit", width: 640, height: 480 },
  },
];

export const team = ["Brand designers", "3D artists", "Animators", "UX designers", "Developers", "Marketers"] as const;

export const benefits = [
  { title: "One point of contact.", text: "Coordinate feedback and decisions with one team." },
  { title: "Consistent design and content.", text: "Develop your branding, product visuals, and store together." },
  { title: "Less coordination for your team.", text: "We manage creative production and development so you can focus on your products and customers." },
] as const;

export const steps = [
  { title: "Discovery", text: "Review your products, customers, and current store. Identify what the new store needs to achieve." },
  { title: "Planning", text: "Agree the scope, brand direction, features, timeline, and budget." },
  { title: "Design", text: "Design your brand, product visuals, and store pages." },
  { title: "Development", text: "Build the store, configurator, and agreed integrations. Test ordering and checkout." },
  { title: "Launch & support", text: "Prepare launch content, plan the switch, and provide ongoing support." },
] as const;

export const terms = [
  { value: "$10k", label: "Projects start at" },
  { value: "1–3 months", label: "Typical project timeline" },
  { value: "Fixed scope", label: "Agreed before development" },
] as const;

export const questions: readonly Question[] = [
  { question: "What does your ecommerce service include?", answer: "Branding, product visuals, and custom store design and development. We can also build admin tools, apps, and product configurators, and connect your business systems." },
  { question: "Do we need 3D for every product?", answer: "No. We recommend it where it helps customers understand features or choose options. We can work from CAD files, photos, drawings, or product samples." },
  { question: "Can you automate pricing and connect to our ERP?", answer: "We can build pricing and quoting around your rules. ERP connections depend on the integration options your system provides, which we review during planning." },
  { question: "How do you rebuild an existing store?", answer: "We prepare the new store while yours stays live. We plan product and content transfers, redirect old links, and test the switch before launch." },
  { question: "How long does a project take?", answer: "Typically 1–3 months. Larger product ranges, complex pricing, or multiple integrations may take longer. We agree a timeline before starting." },
  { question: "What does it cost?", answer: "Projects start at $10k. We confirm the scope, timeline, and price in a proposal after reviewing your requirements." },
  { question: "What support is available after launch?", answer: "We offer design and development updates, conversion testing, search optimisation, and campaign support. We agree priorities using your store’s data and your goals." },
];
