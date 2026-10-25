import type { Question } from "./home";
import type { ImageSlot } from "./types";

// Copy for /services/industrial-erp (Manufacturing & Logistics). The section
// strategy lives in docs/superpowers/specs/2026-10-25-manufacturing-logistics-content.md.
// Sample references and quantities come from content/factory-demo.ts.

export const heroLinks = [
  { label: "Custom ERP", href: "#erp-title" },
  { label: "3D configuration", href: "#configuration-title" },
  { label: "Factory digital twins", href: "#factory-title" },
  { label: "Logistics software", href: "#logistics-title" },
  { label: "VR/AR training", href: "#training-title" },
] as const;

/** Still of the factory demo, captured from its 3D view. */
export const factoryPreview: ImageSlot = { src: "/images/manufacturing/factory-preview.webp", alt: "", width: 1440, height: 960 };

// Skywings scope comes from the user's brief. Confirm the public brand spelling,
// images and ERP modules before adding media; the slots render grey until then.
export const skywings = {
  name: "Skywings",
  caption:
    "For Skywings, a machinery and metalwork manufacturer, we developed an ecommerce frontend with a 3D product viewer and configurator, created product renders, and built ERP software for its manufacturing process.",
  views: [
    { title: "Manufacturing software", text: "The ERP interface and the manufacturing workflow it supports.", image: { alt: "Skywings manufacturing ERP interface", width: 1330, height: 600 } },
    { title: "Customer experience", text: "Ecommerce interface and product configuration.", image: { alt: "Skywings ecommerce interface with product configuration", width: 660, height: 440 } },
    { title: "Product presentation", text: "3D viewer and renders for the manufactured products.", image: { alt: "Skywings product renders", width: 660, height: 440 } },
  ],
} as const;

export const workflow = [
  { label: "3D configuration" },
  { label: "Quote" },
  { label: "Approved specification", approval: true },
  { label: "Material planning" },
  { label: "Production order" },
  { label: "Inspection and dispatch" },
] as const;

export const configurationOutcomes = [
  { title: "Review choices visually", text: "Customers and sales teams can see each product option before they request a quote." },
  { title: "A clear specification", text: "Engineering receives a versioned specification to review and approve." },
  { title: "Planned materials and work", text: "Approved requirements can inform the bill of materials, stock checks and work orders, through the rules and integrations you agree." },
] as const;

export const erpViews = [
  { id: "materials", title: "Materials and purchasing", text: "Parts, bills of materials, stock availability, supplier orders and shortages." },
  { id: "planning", title: "Planning and work orders", text: "Production routes, work centres, schedules, assigned jobs and progress, with a simple tablet view for the shop floor." },
  { id: "quality", title: "Quality and traceability", text: "Inspection records, issue handling, and the history of each job, batch or serial-numbered item." },
] as const;

export type ErpView = (typeof erpViews)[number]["id"];

export const logisticsStages = [
  { title: "Receive and store", text: "Goods received, stock locations, transfers and material allocation." },
  { title: "Prepare and dispatch", text: "Picking, packing, shipment preparation and dispatch status." },
  { title: "Transport and delivery", text: "Carrier or fleet assignment, shipment updates and delivery records where required." },
] as const;

export const trainingSequence = [
  { title: "Identify components", text: "Name each part of the machine before handling it." },
  { title: "Guided assembly", text: "Follow the approved steps in a virtual workshop." },
  { title: "Inspect the result", text: "Check the work against the same criteria as the line." },
  { title: "Review feedback", text: "See which steps took several attempts, and practise them again." },
] as const;

export const trainingApplications = ["Onboarding", "Equipment familiarisation", "Assembly", "Inspection", "Maintenance practice"] as const;

export const capabilities = [
  { title: "Process analysis and UX", text: "Workflows and screens suited to planners, operators, warehouse staff and customers." },
  { title: "Custom software and integrations", text: "Connected orders, engineering records, stock, production and logistics data." },
  { title: "3D modelling and CAD preparation", text: "Recognisable product and factory assets, optimised for the interface they appear in." },
  { title: "Rendering and animation", text: "Clear product presentation, process explanations, and launch and sales materials." },
  { title: "Interactive 3D development", text: "Configurators, spatial operational views, and selectable equipment or locations." },
  { title: "VR/AR development", text: "Guided practice, visual instructions and task assessment." },
  { title: "Website and app design", text: "Customer ordering, staff tools, mobile workflows and your brand presence." },
] as const;

export const steps = [
  { title: "Review workflows", text: "Map the process, the people involved, and the data and systems it depends on." },
  { title: "Design a focused pilot", text: "Agree one process or module to prove first, with its screens and data preparation." },
  { title: "Build and connect", text: "Develop the software and visuals, connect the agreed systems, and test with users." },
  { title: "Roll out and support", text: "Train the team, roll out in phases, and support updates after launch." },
] as const;

export const questions: readonly Question[] = [
  { question: "Can you build an ERP without a new ecommerce website?", answer: "Yes. The project can focus on your internal manufacturing or logistics operations on their own." },
  { question: "Can the software work with our existing ERP and equipment?", answer: "We review the available APIs, records, devices and data connections first, then agree the integration scope with you." },
  { question: "Can configuration create material requirements?", answer: "Yes, once the configuration rules and engineering data are validated, and with the approval step you agree before work enters production." },
  { question: "Does a digital twin need live sensor data?", answer: "It depends on its purpose. Operational records can show job progress; machine telemetry needs a connection to the equipment or sensors." },
  { question: "Can we start with one process or training module?", answer: "Yes. We agree a pilot, validate it with your users, and plan the next stages from the results." },
];
