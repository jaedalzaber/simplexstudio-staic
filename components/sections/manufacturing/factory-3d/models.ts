import { FACTORY, factoryAreas, factoryDoors, type AreaId, type PlanRect } from "@/content/factory-demo";
import type { Box, Lighting, Vec3 } from "@/lib/three/bake";
import { mulberry32 } from "@/lib/three/noise";

// The sample factory as boxes. World space is metres: x east, z south, y up, with the
// hall centred on the origin. Plan units convert at 20 per metre.

const M = 1 / FACTORY.unit;
export const HALF_X = (FACTORY.width / 2) * M;
export const HALF_Z = (FACTORY.height / 2) * M;
const WALL = 0.3;
/** Back (north and west) walls stand full height; the near walls are cut away. */
const TALL = 5;

const COLORS = {
  floor: "#c9ced4",
  aisle: "#d3d7dc",
  marking: "#e3bf45",
  wall: "#e8ebee",
  plinth: "#cfd4da",
  glass: "#9fb2c4",
  door: "#8d97a3",
  column: "#5b6b80",
  upright: "#3d5f8f",
  beam: "#e07b39",
  sheet: "#a9b3be",
  carton: "#c9a06b",
  bin: "#7f9fc6",
  machine: "#eceff2",
  machineDark: "#3f4650",
  accent: "#3d5f8f",
  cabin: "#7d93a8",
  press: "#5a6b7f",
  guard: "#e3bf45",
  screen: "#3f6b52",
  table: "#6b7480",
  benchTop: "#c9b28f",
  enclosure: "#cdd2d0",
  granite: "#3a3f46",
  pallet: "#b48a5a",
  wrap: "#e2e6eb",
  forklift: "#e8a53a",
} as const;

export const toWorld = (x: number, y: number): [number, number] => [(x - FACTORY.width / 2) * M, (y - FACTORY.height / 2) * M];

const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, color: string, finish?: Box["finish"]): Box =>
  ({ min: [x0, y0, z0], max: [x1, y1, z1], color, ...(finish ? { finish } : {}) });

/** A plan rectangle (plan units) raised between two heights in metres. */
function slab(x: number, y: number, width: number, height: number, y0: number, y1: number, color: string): Box {
  const [x0, z0] = toWorld(x, y);
  const [x1, z1] = toWorld(x + width, y + height);
  return box(x0, y0, z0, x1, y1, z1, color);
}

export function areaCenter(shape: PlanRect): [number, number] {
  return toWorld(shape.x + shape.width / 2, shape.y + shape.height / 2);
}

/** A pallet rack along x: uprights, beams on three levels, and loads. */
function rack(x: number, y: number, length: number, seed: number): Box[] {
  const out: Box[] = [];
  const random = mulberry32(seed);
  const bays = 4;
  const bay = length / bays;
  const depth = 22;
  for (let index = 0; index <= bays; index++) {
    const px = x + index * bay;
    out.push(slab(px, y, 2, 2, 0, 4.1, COLORS.upright), slab(px, y + depth - 2, 2, 2, 0, 4.1, COLORS.upright));
  }
  for (const level of [0.12, 1.45, 2.8]) {
    out.push(slab(x, y + depth - 2, length + 2, 2, level + 0.02, level + 0.14, COLORS.beam), slab(x, y, length + 2, 2, level + 0.02, level + 0.14, COLORS.beam));
    for (let index = 0; index < bays; index++) {
      const kind = random();
      const top = level + 0.14 + (kind < 0.4 ? 0.35 : 0.8 + random() * 0.3);
      out.push(slab(x + index * bay + 6, y + 3, bay - 10, depth - 6, level + 0.14, top, kind < 0.4 ? COLORS.sheet : kind < 0.75 ? COLORS.carton : COLORS.bin));
    }
  }
  return out;
}

/** An enclosure standing on a surface at height `y`. Plan position is its footprint corner. */
const enclosure = (x: number, z: number, y: number): Box[] => [slab(x, z, 16, 6, y, y + 1.2, COLORS.enclosure)];

const equipment: Record<AreaId, () => Box[]> = {
  materials: () => [...rack(45, 40, 190, 3), ...rack(45, 92, 190, 4), ...rack(45, 144, 190, 5)],
  cutting: () => [
    // Fibre laser: bed, enclosed cabin, console and shuttle table with a sheet.
    slab(300, 60, 160, 70, 0, 1, COLORS.machine),
    slab(304, 64, 152, 62, 1, 2.1, COLORS.cabin),
    slab(300, 60, 160, 70, 2.1, 2.25, COLORS.machine),
    slab(300, 128, 160, 4, 0.4, 0.55, COLORS.accent),
    slab(470, 80, 22, 16, 0, 1.5, COLORS.machineDark),
    slab(300, 140, 160, 40, 0, 0.85, COLORS.machineDark),
    slab(306, 144, 148, 32, 0.85, 0.88, COLORS.sheet),
    slab(475, 145, 30, 30, 0, 1.2, COLORS.sheet),
  ],
  fabrication: () => [
    // Press brake: side frames, bed and ram, with a guard and a panel trolley.
    slab(568, 52, 10, 30, 0, 2.8, COLORS.press),
    slab(652, 52, 10, 30, 0, 2.8, COLORS.press),
    slab(568, 60, 94, 14, 0, 0.95, COLORS.press),
    slab(568, 60, 94, 14, 1.55, 2.5, COLORS.press),
    slab(572, 84, 86, 2, 0.95, 1.8, COLORS.guard),
    slab(575, 110, 50, 26, 0, 0.9, COLORS.table),
    slab(578, 113, 44, 20, 0.9, 1.15, COLORS.sheet),
    // Two welding cells: screens on three sides and a table.
    ...[50, 122].flatMap((y) => [
      slab(680, y, 80, 3, 0, 1.9, COLORS.screen),
      slab(757, y, 3, 60, 0, 1.9, COLORS.screen),
      slab(680, y + 57, 50, 3, 0, 1.9, COLORS.screen),
      slab(700, y + 16, 36, 26, 0, 0.9, COLORS.table),
      ...enclosure(708, y + 24, 0.9),
    ]),
  ],
  assembly: () => [
    // Three benches with enclosures in progress, and a parts rack.
    ...[300, 352, 404].flatMap((y, index) => [
      slab(572, y, 120, 3, 0, 0.88, COLORS.table),
      slab(572, y, 120, 30, 0.88, 0.94, COLORS.benchTop),
      slab(572, y, 120, 2, 0.94, 1.9, COLORS.machineDark),
      ...enclosure(590, y + 10, 0.94),
      ...(index < 2 ? enclosure(630, y + 10, 0.94) : []),
    ]),
    // Parts shelving with component bins.
    slab(712, 300, 40, 4, 0, 2, COLORS.upright),
    slab(712, 436, 40, 4, 0, 2, COLORS.upright),
    ...[0.35, 0.95, 1.55].flatMap((h, index) => [
      slab(712, 304, 40, 132, h, h + 0.05, COLORS.table),
      ...[0, 1, 2, 3].map((bin) => slab(716, 308 + bin * 32, 32, 26, h + 0.05, h + 0.32, index === 1 ? COLORS.carton : COLORS.bin)),
    ]),
  ],
  inspection: () => [
    // Granite table with an enclosure under inspection, a measuring column, a desk, and a hold cage.
    slab(320, 320, 110, 50, 0, 0.85, COLORS.granite),
    ...enclosure(360, 336, 0.85),
    slab(410, 326, 6, 6, 0.85, 2.3, COLORS.machineDark),
    slab(450, 320, 50, 26, 0, 0.75, COLORS.table),
    slab(456, 322, 18, 4, 0.75, 1.15, COLORS.machineDark),
    slab(300, 400, 70, 2, 0, 1.8, COLORS.door),
    slab(300, 400, 2, 40, 0, 1.8, COLORS.door),
    slab(370, 400, 2, 40, 0, 1.8, COLORS.door),
    slab(312, 412, 24, 16, 0, 1.3, COLORS.wrap),
  ],
  dispatch: () => [
    // Wrapped pallets, a packing table, a forklift and staged loads by the doors.
    ...[[60, 300], [96, 300], [60, 334], [96, 334], [60, 392], [96, 392]].flatMap(([x, y]) => [slab(x, y, 30, 24, 0, 0.15, COLORS.pallet), slab(x + 2, y + 2, 26, 20, 0.15, 1.5, COLORS.wrap)]),
    slab(160, 300, 60, 30, 0, 0.9, COLORS.table),
    ...enclosure(176, 306, 0.9),
    slab(170, 380, 26, 44, 0, 1.4, COLORS.forklift),
    slab(166, 384, 4, 36, 0, 3.0, COLORS.machineDark),
    slab(150, 390, 16, 26, 0.1, 0.16, COLORS.machineDark),
  ],
};

export interface FactoryModel {
  hall: Box[];
  areas: Record<AreaId, Box[]>;
}

export function buildFactory(): FactoryModel {
  const hall: Box[] = [];
  const x0 = -HALF_X;
  const x1 = HALF_X;
  const z0 = -HALF_Z;
  const z1 = HALF_Z;

  hall.push(box(x0 - WALL, -0.12, z0 - WALL, x1 + WALL, 0, z1 + WALL, COLORS.floor));
  // The central aisle and its yellow edge lines.
  hall.push(slab(20, 200, 760, 80, 0, 0.006, COLORS.aisle));
  for (const y of [199, 279]) hall.push(slab(20, y, 760, 2, 0, 0.012, COLORS.marking));

  // North wall with a high window band; west wall with the receiving and loading doors.
  hall.push(box(x0 - WALL, 0, z0 - WALL, x1 + WALL, 3.2, z0, COLORS.wall));
  hall.push(box(x0 - WALL, 3.2, z0 - WALL + 0.08, x1 + WALL, 4.4, z0 - 0.08, COLORS.glass, "glass"));
  hall.push(box(x0 - WALL, 4.4, z0 - WALL, x1 + WALL, TALL, z0, COLORS.wall));
  const doors = [factoryDoors.receiving, ...factoryDoors.loading].map(({ y0, y1 }) => [toWorld(0, y0)[1], toWorld(0, y1)[1]] as const);
  let edge = z0;
  for (const [d0, d1] of doors) {
    hall.push(box(x0 - WALL, 0, edge, x0, TALL, d0, COLORS.wall));
    hall.push(box(x0 - WALL, 4, d0, x0, TALL, d1, COLORS.wall));
    hall.push(box(x0 - WALL - 0.05, 2.6, d0, x0 - WALL + 0.1, 4, d1, COLORS.door));
    edge = d1;
  }
  hall.push(box(x0 - WALL, 0, edge, x0, TALL, z1 + WALL, COLORS.wall));
  hall.push(box(x1, 0, z0, x1 + WALL, 1, z1 + WALL, COLORS.wall));
  hall.push(box(x0, 0, z1, x1, 0.6, z1 + WALL, COLORS.wall));
  hall.push(box(x0, 0, z0, x1, 0.25, z0 + 0.06, COLORS.plinth));

  // Steel columns along the aisle.
  for (const x of [265, 535]) for (const y of [196, 284]) hall.push(slab(x - 4, y - 4, 8, 8, 0, TALL, COLORS.column));

  const areas = Object.fromEntries(factoryAreas.map((area) => [area.id, equipment[area.id]()])) as Record<AreaId, Box[]>;
  return { hall, areas };
}

/** Chevrons along the aisle lanes: eastbound past the back row, westbound past the front row. */
export function routeChevrons(): { position: [number, number]; angle: number }[] {
  const out: { position: [number, number]; angle: number }[] = [];
  for (let x = 120; x <= 680; x += 40) out.push({ position: toWorld(x, 222), angle: 0 });
  out.push({ position: toWorld(700, 240), angle: Math.PI / 2 });
  for (let x = 680; x >= 120; x -= 40) out.push({ position: toWorld(x, 258), angle: Math.PI });
  out.push({ position: toWorld(80, 258), angle: Math.PI });
  return out;
}

// Baked light: cool daylight from the high windows and roof lights, with a soft sky and grey bounce.
const KEY: Vec3 = (() => {
  const v: Vec3 = [0.32, 1, 0.42];
  const length = Math.hypot(...v);
  return [v[0] / length, v[1] / length, v[2] / length];
})();

export const factoryLighting: Lighting = {
  sun: KEY,
  light(target, sun, sky, bounce) {
    return target.setRGB(0.8 * sun + 0.6 * sky + 0.17 * bounce, 0.79 * sun + 0.62 * sky + 0.17 * bounce, 0.76 * sun + 0.67 * sky + 0.16 * bounce);
  },
};
