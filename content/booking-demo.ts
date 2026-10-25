// Sample restaurant for the booking demo on /services/booking-system. Not a real
// venue and not live data: availability is generated from a fixed pattern.

/** The example business used across the booking page's interfaces. */
export const demoVenue = { name: "Example Restaurant" } as const;

// The floor plan is an 800 × 500 viewBox at 50 units per metre (a 16 × 10 m
// room). The 2D plan draws it directly; the 3D room converts it to metres.
export const PLAN = { width: 800, height: 500, unit: 50 } as const;

export interface PlanRect { x: number; y: number; width: number; height: number }
export type Side = "n" | "s" | "e" | "w";
export type TableArea = "Window" | "Booth" | "Main room" | "Bar side";

export interface DemoTable {
  id: string;
  number: number;
  seats: number;
  area: TableArea;
  /** The table top. */
  shape: PlanRect;
  /** Chairs per side. Booths have a bench either side instead. */
  chairs?: Partial<Record<Side, number>>;
  booth?: true;
}

const table = (number: number, area: TableArea, seats: number, shape: PlanRect, chairs?: Partial<Record<Side, number>>): DemoTable =>
  ({ id: `T${number}`, number, seats, area, shape, ...(chairs ? { chairs } : { booth: true }) });

export const demoTables: readonly DemoTable[] = [
  table(1, "Window", 2, { x: 24, y: 130, width: 40, height: 40 }, { n: 1, s: 1 }),
  table(2, "Window", 2, { x: 24, y: 235, width: 40, height: 40 }, { n: 1, s: 1 }),
  table(3, "Window", 4, { x: 40, y: 350, width: 56, height: 56 }, { n: 1, s: 1, e: 1, w: 1 }),
  table(4, "Booth", 4, { x: 156, y: 0, width: 46, height: 70 }),
  table(5, "Booth", 6, { x: 262, y: 0, width: 46, height: 92 }),
  table(6, "Booth", 6, { x: 368, y: 0, width: 46, height: 92 }),
  table(7, "Main room", 4, { x: 176, y: 196, width: 56, height: 56 }, { n: 1, s: 1, e: 1, w: 1 }),
  table(8, "Main room", 4, { x: 326, y: 196, width: 56, height: 56 }, { n: 1, s: 1, e: 1, w: 1 }),
  table(9, "Main room", 8, { x: 200, y: 330, width: 150, height: 60 }, { n: 3, s: 3, e: 1, w: 1 }),
  table(10, "Bar side", 2, { x: 580, y: 150, width: 40, height: 40 }, { n: 1, s: 1 }),
  table(11, "Bar side", 2, { x: 580, y: 280, width: 40, height: 40 }, { n: 1, s: 1 }),
];

export const tableAreas: readonly TableArea[] = ["Window", "Booth", "Main room", "Bar side"];

/** Fixed parts of the room, shared by the 2D plan and the 3D view. */
export const room = {
  /** Glazed sections of the west wall. */
  windows: [{ y0: 30, y1: 190 }, { y0: 215, y1: 470 }],
  /** Gap in the south wall. */
  entrance: { x0: 650, x1: 750 },
  kitchenPass: { x: 540, y: 0, width: 230, height: 40 },
  bar: { x: 700, y: 120, width: 52, height: 250 },
  backBar: { x: 774, y: 120, width: 26, height: 250 },
  stools: [145, 185, 225, 265, 305, 345].map((y) => ({ x: 676, y })),
  hostStand: { x: 590, y: 446, width: 48, height: 24 },
  planters: [{ x: 38, y: 38, size: 40 }, { x: 476, y: 30, size: 38 }, { x: 470, y: 300, size: 44 }, { x: 34, y: 470, size: 34 }],
} as const;

export const BENCH_WIDTH = 26;
export const CHAIR_SIZE = 20;
const CHAIR_GAP = 6;

/** Centre of each chair around a table, and the side it sits on. */
export function chairSpots(item: DemoTable): { x: number; y: number; side: Side }[] {
  const { x, y, width, height } = item.shape;
  const out = CHAIR_GAP + CHAIR_SIZE / 2;
  const spots: { x: number; y: number; side: Side }[] = [];
  for (const [side, count = 0] of Object.entries(item.chairs ?? {}) as [Side, number | undefined][]) {
    for (let index = 0; index < count; index++) {
      const t = (index + 0.5) / count;
      if (side === "n") spots.push({ x: x + width * t, y: y - out, side });
      if (side === "s") spots.push({ x: x + width * t, y: y + height + out, side });
      if (side === "w") spots.push({ x: x - out, y: y + height * t, side });
      if (side === "e") spots.push({ x: x + width + out, y: y + height * t, side });
    }
  }
  return spots;
}

/** The two benches of a booth, west then east. */
export function boothBenches(item: DemoTable): PlanRect[] {
  const { x, y, width, height } = item.shape;
  return [
    { x: x - BENCH_WIDTH, y, width: BENCH_WIDTH, height },
    { x: x + width, y, width: BENCH_WIDTH, height },
  ];
}

export const demoDays = [
  { short: "Thu", label: "Thursday" },
  { short: "Fri", label: "Friday" },
  { short: "Sat", label: "Saturday" },
] as const;

export const demoTimes = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"] as const;

export const guestLimits = { min: 1, max: 8 } as const;

export interface DemoSlot {
  guests: number;
  /** Index into `demoDays`. */
  day: number;
  /** Index into `demoTimes`. */
  time: number;
}

export type TableStatus = "available" | "booked" | "unsuitable";

/** A table suits a party it can seat without leaving more than two chairs empty. */
export const fitsParty = (item: DemoTable, guests: number) => item.seats >= guests && item.seats <= guests + 2;

// Evenings fill up towards 19:30 and later in the week.
const timeLoad = [0.16, 0.26, 0.4, 0.5, 0.5, 0.4, 0.26, 0.16];
const dayLoad = [0.85, 1.1, 1.3];

function hash(a: number, b: number, c: number) {
  let h = Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Tables already booked at a day and time. Deterministic, so server and browser agree. */
export function bookedTables(day: number, time: number): ReadonlySet<string> {
  const load = timeLoad[time] * dayLoad[day];
  const score = (item: DemoTable) => hash(item.number, day, time);
  const booked = new Set(demoTables.filter((item) => score(item) < load).map((item) => item.id));
  // Keep at least one suitable table for every party size, so the demo never dead-ends.
  for (let guests = guestLimits.min; guests <= guestLimits.max; guests++) {
    const suitable = demoTables.filter((item) => fitsParty(item, guests));
    if (suitable.every((item) => booked.has(item.id))) {
      const freed = suitable.reduce((best, item) => (score(item) > score(best) ? item : best));
      booked.delete(freed.id);
    }
  }
  return booked;
}

export function tableStatus(item: DemoTable, guests: number, booked: ReadonlySet<string>): TableStatus {
  if (!fitsParty(item, guests)) return "unsuitable";
  return booked.has(item.id) ? "booked" : "available";
}
