// One sample order and an illustrative metalwork factory, shared by every view on
// /services/industrial-erp: the hero, configuration, ERP, warehouse and factory demo.
// Not a client and not live data; the records follow the chosen scenario.

export const sampleOrder = {
  product: "Equipment enclosure",
  code: "EN-1200",
  quantity: 12,
  /** Millimetres. */
  size: { height: 1200, width: 800, depth: 300 },
  material: "1.5 mm mild steel",
  door: "Single solid door",
  finish: "RAL 7035 powder coat",
  extras: ["Gland plate", "Mounting plate"],
  quote: "Q-2417",
  specification: "SPEC-2417 rev B",
  salesOrder: "SO-2417",
  workOrder: "WO-3108",
  shipment: "SH-5520",
} as const;

/** Parts and quantities to make the order: its bill of materials. */
export const orderParts = [
  { code: "SH-1525", name: "Steel sheet 2500 × 1250 × 1.5 mm", quantity: 6, unit: "sheets" },
  { code: "EN-1200-B", name: "Body shell", quantity: 12, unit: "pcs" },
  { code: "EN-1200-D", name: "Door panel", quantity: 12, unit: "pcs" },
  { code: "MP-1200", name: "Mounting plate, galvanised", quantity: 12, unit: "pcs" },
  { code: "GP-800", name: "Gland plate", quantity: 12, unit: "pcs" },
  { code: "HK-20", name: "Hinge kit", quantity: 12, unit: "kits" },
  { code: "GS-1200", name: "Door gasket kit", quantity: 12, unit: "kits" },
  { code: "L-3", name: "Quarter-turn lock", quantity: 12, unit: "pcs" },
] as const;

/** Quote lines with sample prices. */
export const sampleQuote = {
  lines: [
    { item: "Enclosure EN-1200, configured", detail: "1200 × 800 × 300 mm · 1.5 mm steel", quantity: 12, unit: 386 },
    { item: "Gland and mounting plates", detail: "Fitted", quantity: 12, unit: 34 },
    { item: "Powder coat RAL 7035", detail: "Inside and out", quantity: 12, unit: 22 },
  ],
  currency: "USD",
} as const;

// The factory floor is an 800 × 480 viewBox at 20 units per metre (a 40 × 24 m hall).
export const FACTORY = { width: 800, height: 480, unit: 20 } as const;

export interface PlanRect { x: number; y: number; width: number; height: number }

export type AreaId = "materials" | "cutting" | "fabrication" | "assembly" | "inspection" | "dispatch";

export interface FactoryArea {
  id: AreaId;
  code: string;
  name: string;
  /** What the area holds, for the area details. */
  equipment: string;
  shape: PlanRect;
}

// A U-shaped flow: materials, cutting and fabrication along the back; assembly,
// inspection and dispatch along the front, ending at the loading doors.
export const factoryAreas: readonly FactoryArea[] = [
  { id: "materials", code: "A1", name: "Materials", equipment: "Sheet and component racks", shape: { x: 30, y: 30, width: 220, height: 170 } },
  { id: "cutting", code: "A2", name: "Cutting", equipment: "Fibre laser cutter", shape: { x: 280, y: 30, width: 240, height: 170 } },
  { id: "fabrication", code: "A3", name: "Fabrication", equipment: "Press brake and welding cells", shape: { x: 550, y: 30, width: 220, height: 170 } },
  { id: "assembly", code: "A4", name: "Assembly", equipment: "Assembly benches", shape: { x: 550, y: 280, width: 220, height: 170 } },
  { id: "inspection", code: "A5", name: "Inspection", equipment: "Inspection table and gauges", shape: { x: 280, y: 280, width: 240, height: 170 } },
  { id: "dispatch", code: "A6", name: "Dispatch", equipment: "Packing and loading bays", shape: { x: 30, y: 280, width: 220, height: 170 } },
];

export const areaById = (id: AreaId) => factoryAreas.find((area) => area.id === id)!;

/** Doors in the west wall, as plan y ranges. */
export const factoryDoors = { receiving: { y0: 70, y1: 160 }, loading: [{ y0: 300, y1: 360 }, { y0: 380, y1: 440 }] } as const;

export interface Job {
  id: string;
  product: string;
  quantity: number;
  route: readonly AreaId[];
  /** Where the job is now. */
  at: AreaId;
  progress: string;
}

const fullRoute: readonly AreaId[] = ["materials", "cutting", "fabrication", "assembly", "inspection", "dispatch"];
const partRoute: readonly AreaId[] = ["materials", "cutting", "fabrication", "inspection", "dispatch"];

export const jobs: readonly Job[] = [
  { id: "WO-3114", product: "Cable trays CT-300", quantity: 40, route: partRoute, at: "materials", progress: "Picking sheet for cutting" },
  { id: "WO-3111", product: "Cabinet doors CD-600", quantity: 24, route: fullRoute, at: "cutting", progress: "10 of 24 cut" },
  { id: sampleOrder.workOrder, product: "Equipment enclosures EN-1200", quantity: 12, route: fullRoute, at: "fabrication", progress: "8 of 12 bent and welded" },
  { id: "WO-3099", product: "Control panel housings CP-450", quantity: 8, route: fullRoute, at: "assembly", progress: "5 of 8 assembled" },
  { id: "WO-3105", product: "Mounting brackets MB-40", quantity: 200, route: partRoute, at: "inspection", progress: "150 of 200 checked" },
  { id: "WO-3102", product: "Base frames BF-900", quantity: 6, route: partRoute, at: "dispatch", progress: "Packed, awaiting collection on SH-5517" },
];

export type Scenario = "normal" | "shortage";
export const scenarios: readonly { id: Scenario; label: string }[] = [
  { id: "normal", label: "Normal progress" },
  { id: "shortage", label: "Material shortage" },
];

export type StepState = "done" | "active" | "scheduled" | "waiting" | "hold";
export const stepLabels: Record<StepState, string> = {
  done: "Complete",
  active: "In progress",
  scheduled: "Scheduled",
  waiting: "Waiting for material",
  hold: "On hold",
};

export interface OrderStep { area: AreaId; state: StepState; note: string }

/** The followed order's route through the factory in a scenario. */
export function orderSteps(scenario: Scenario): OrderStep[] {
  const short = scenario === "shortage";
  return [
    { area: "materials", state: "done", note: "Sheet and components issued" },
    { area: "cutting", state: "done", note: "12 of 12 cut" },
    { area: "fabrication", state: "active", note: "8 of 12 bent and welded" },
    short
      ? { area: "assembly", state: "waiting", note: "6 of 12 door gasket kits in stock" }
      : { area: "assembly", state: "scheduled", note: "Parts allocated" },
    short ? { area: "inspection", state: "hold", note: "Waits for assembly" } : { area: "inspection", state: "scheduled", note: `Checks from ${sampleOrder.specification}` },
    short ? { area: "dispatch", state: "hold", note: `${sampleOrder.shipment} not released` } : { area: "dispatch", state: "scheduled", note: `Shipment ${sampleOrder.shipment} prepared` },
  ];
}

/** What the followed order needs at each step: specification and parts, where relevant. */
export const orderStepDetail: Record<AreaId, readonly string[]> = {
  materials: ["6 sheets 2500 × 1250 × 1.5 mm", "Hinge, gasket and lock kits for 12 units"],
  cutting: ["12 body shells and 12 door panels", "12 mounting plates and 12 gland plates"],
  fabrication: ["Bend and weld 12 shells and doors", `Tolerances from ${sampleOrder.specification}`],
  assembly: ["Fit 12 hinge kits HK-20 and gasket kits GS-1200", "Fit 12 quarter-turn locks L-3 and mounting plates"],
  inspection: [`Dimensions, door alignment and seal from ${sampleOrder.specification}`, "Finish check, RAL 7035"],
  dispatch: ["2 pallets, 6 enclosures each", `Shipment ${sampleOrder.shipment} and delivery note`],
};

export type MaterialState = "ready" | "short";
export interface AreaSummary {
  /** Running normally, or an issue needs attention here. */
  status: "running" | "attention";
  statusLabel: string;
  jobs: Job[];
  materials: { item: string; state: MaterialState; note: string }[];
  next: string;
  /** The followed order's step here, if its route passes through. */
  order?: OrderStep;
}

const areaMaterials: Record<AreaId, AreaSummary["materials"]> = {
  materials: [
    { item: "Steel sheet 1.5 mm", state: "ready", note: "18 sheets in stock" },
    { item: "Door gasket kits GS-1200", state: "ready", note: "12 of 12 allocated to WO-3108" },
  ],
  cutting: [{ item: "Sheet for WO-3111", state: "ready", note: "4 of 4 sheets issued" }],
  fabrication: [
    { item: "Cut panels for WO-3108", state: "ready", note: "12 of 12 at the press brake" },
    { item: "Welding wire and gas", state: "ready", note: "Stocked at the cells" },
  ],
  assembly: [
    { item: "Hinge kits HK-20", state: "ready", note: "12 allocated, location B-04-2" },
    { item: "Door gasket kits GS-1200", state: "ready", note: "12 allocated" },
    { item: "Quarter-turn locks L-3", state: "ready", note: "12 allocated" },
  ],
  inspection: [{ item: "Gauges and checklists", state: "ready", note: "Calibrated, checklist rev C" }],
  dispatch: [{ item: "Pallets and wrap", state: "ready", note: "In stock" }],
};

const shortGaskets = { item: "Door gasket kits GS-1200", state: "short" as const, note: "6 of 12 in stock; PO-7782 raised" };

export function areaSummary(id: AreaId, scenario: Scenario): AreaSummary {
  const index = factoryAreas.findIndex((area) => area.id === id);
  const step = orderSteps(scenario).find((item) => item.area === id);
  const short = scenario === "shortage";
  const materials = areaMaterials[id].map((line) => (short && line.item === shortGaskets.item ? shortGaskets : line));
  const attention = short && (id === "materials" || id === "assembly");
  return {
    status: attention ? "attention" : "running",
    statusLabel: !attention ? "Running" : id === "materials" ? "Short: door gasket kits" : `${sampleOrder.workOrder} waiting for material`,
    jobs: jobs.filter((job) => job.at === id),
    materials,
    next: index < factoryAreas.length - 1 ? `${factoryAreas[index + 1].code} ${factoryAreas[index + 1].name}` : "Collection by the carrier",
    order: step,
  };
}

export function scenarioSummary(scenario: Scenario): string {
  return scenario === "normal"
    ? `${sampleOrder.workOrder} is in fabrication: 8 of 12 enclosures bent and welded. Parts for assembly are allocated.`
    : `Only 6 of 12 door gasket kits are in stock, so ${sampleOrder.workOrder} waits for material before assembly. Inspection and dispatch are on hold, and purchasing has raised PO-7782.`;
}
