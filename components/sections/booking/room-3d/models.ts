import { CHAIR_SIZE, PLAN, boothBenches, chairSpots, room, type DemoTable, type PlanRect, type Side } from "@/content/booking-demo";
import type { Box, Lighting, Vec3 } from "@/lib/three/bake";
import { mulberry32 } from "@/lib/three/noise";

// The restaurant as boxes. World space is metres: x east, z south, y up, with
// the room centred on the origin. Plan units convert at 50 per metre.

const M = 1 / PLAN.unit;
export const HALF_X = (PLAN.width / 2) * M;
export const HALF_Z = (PLAN.height / 2) * M;
const WALL = 0.24;
/** The back (north and west) walls stand full height; the near walls are cut away. */
const TALL = 2.7;
const LOW = 0.95;
const SOUTH = 0.42;
export const TABLE_HEIGHT = 0.76;

const COLORS = {
  floor: "#d6bf9c",
  rug: "#e7dccb",
  wall: "#f1ece4",
  sill: "#e4dcd0",
  glass: "#8ea4b8",
  frame: "#3b4048",
  top: "#7b5739",
  wood: "#4b3527",
  metal: "#2e3137",
  seat: "#d0ac83",
  chairBack: "#8d6747",
  bench: "#5b7462",
  benchBack: "#4f6656",
  barFront: "#3d3029",
  stone: "#e7e2d9",
  steel: "#b9bdc3",
  steelTop: "#e2e4e7",
  kitchen: "#d4d7db",
  pot: "#cfc5b6",
  leaves: ["#5d8752", "#6c975e", "#4c7745"],
  bottles: ["#5d7f5a", "#a8763e", "#d8d2c4", "#7a3434", "#3d5f7a"],
} as const;

const toWorld = (x: number, y: number): [number, number] => [(x - PLAN.width / 2) * M, (y - PLAN.height / 2) * M];

const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, color: string, finish?: Box["finish"]): Box =>
  ({ min: [x0, y0, z0], max: [x1, y1, z1], color, ...(finish ? { finish } : {}) });

/** A plan rectangle raised between two heights, optionally inset (metres). */
function slab(rect: PlanRect, y0: number, y1: number, color: string, inset = 0): Box {
  const [x0, z0] = toWorld(rect.x, rect.y);
  const [x1, z1] = toWorld(rect.x + rect.width, rect.y + rect.height);
  return box(x0 + inset, y0, z0 + inset, x1 - inset, y1, z1 - inset, color);
}

export interface Footprint { x0: number; z0: number; x1: number; z1: number }

/** World centre of a table top. */
export function tableCenter(item: DemoTable): [number, number] {
  const { x, y, width, height } = item.shape;
  return toWorld(x + width / 2, y + height / 2);
}

/** The table with its chairs or benches, used for picking and the selection pad. */
export function tableFootprint(item: DemoTable): Footprint {
  const rects = [item.shape, ...(item.booth ? boothBenches(item) : chairSpots(item).map((chair) => ({ x: chair.x - CHAIR_SIZE / 2, y: chair.y - CHAIR_SIZE / 2, width: CHAIR_SIZE, height: CHAIR_SIZE })))];
  const [x0, z0] = toWorld(Math.min(...rects.map((r) => r.x)), Math.min(...rects.map((r) => r.y)));
  const [x1, z1] = toWorld(Math.max(...rects.map((r) => r.x + r.width)), Math.max(...rects.map((r) => r.y + r.height)));
  return { x0, z0, x1, z1 };
}

function chair(cx: number, cz: number, side: Side): Box[] {
  const h = (CHAIR_SIZE * M) / 2;
  const [x0, x1, z0, z1] = [cx - h, cx + h, cz - h, cz + h];
  const leg = 0.035;
  const out: Box[] = [box(x0, 0.44, z0, x1, 0.48, z1, COLORS.seat)];
  for (const [lx, lz] of [[x0, z0], [x1 - leg, z0], [x0, z1 - leg], [x1 - leg, z1 - leg]]) out.push(box(lx, 0, lz, lx + leg, 0.44, lz + leg, COLORS.metal));
  // The back rest faces away from the table.
  if (side === "n") out.push(box(x0, 0.48, z0, x1, 0.86, z0 + 0.04, COLORS.chairBack));
  if (side === "s") out.push(box(x0, 0.48, z1 - 0.04, x1, 0.86, z1, COLORS.chairBack));
  if (side === "w") out.push(box(x0, 0.48, z0, x0 + 0.04, 0.86, z1, COLORS.chairBack));
  if (side === "e") out.push(box(x1 - 0.04, 0.48, z0, x1, 0.86, z1, COLORS.chairBack));
  return out;
}

/** Top, base, and chairs or booth benches for one table. */
export function buildTable(item: DemoTable): Box[] {
  const top = slab(item.shape, TABLE_HEIGHT - 0.04, TABLE_HEIGHT, COLORS.top);
  const [cx, cz] = tableCenter(item);
  const out: Box[] = [top];
  const long = item.shape.width * M > 1.4 || item.shape.height * M > 1.4;
  if (long) {
    // Four legs for the long table.
    const leg = 0.06;
    for (const x of [top.min[0] + 0.08, top.max[0] - 0.08 - leg]) {
      for (const z of [top.min[2] + 0.08, top.max[2] - 0.08 - leg]) out.push(box(x, 0, z, x + leg, TABLE_HEIGHT - 0.04, z + leg, COLORS.wood));
    }
  } else {
    // Pedestal and foot.
    out.push(box(cx - 0.04, 0.03, cz - 0.04, cx + 0.04, TABLE_HEIGHT - 0.04, cz + 0.04, COLORS.metal));
    out.push(box(cx - 0.2, 0, cz - 0.2, cx + 0.2, 0.03, cz + 0.2, COLORS.metal));
  }
  if (item.booth) {
    boothBenches(item).forEach((bench, index) => {
      out.push(slab(bench, 0, 0.42, COLORS.benchBack, 0.01));
      out.push(slab(bench, 0.42, 0.48, COLORS.bench, 0.02));
      // Upholstered back on the outer edge of each bench.
      const [bx0, bz0] = toWorld(bench.x, bench.y);
      const [bx1, bz1] = toWorld(bench.x + bench.width, bench.y + bench.height);
      if (index === 0) out.push(box(bx0, 0.42, bz0, bx0 + 0.12, 1.15, bz1, COLORS.benchBack));
      else out.push(box(bx1 - 0.12, 0.42, bz0, bx1, 1.15, bz1, COLORS.benchBack));
    });
  } else {
    for (const spot of chairSpots(item)) {
      const [x, z] = toWorld(spot.x, spot.y);
      out.push(...chair(x, z, spot.side));
    }
  }
  return out;
}

function planter(x: number, y: number, size: number, seed: number): Box[] {
  const [cx, cz] = toWorld(x, y);
  const r = (size * M) / 2;
  const random = mulberry32(seed);
  const out = [box(cx - r * 0.8, 0, cz - r * 0.8, cx + r * 0.8, 0.48, cz + r * 0.8, COLORS.pot)];
  for (let index = 0; index < 4; index++) {
    const s = r * (1.05 - index * 0.2) * (0.9 + random() * 0.2);
    const ox = (random() - 0.5) * r * 0.5;
    const oz = (random() - 0.5) * r * 0.5;
    const y0 = 0.48 + index * 0.28;
    out.push(box(cx + ox - s, y0, cz + oz - s, cx + ox + s, y0 + 0.36, cz + oz + s, COLORS.leaves[index % COLORS.leaves.length]));
  }
  return out;
}

export interface RoomModel {
  boxes: Box[];
  /** Unlit glowing boxes: wall lights and heat lamps. */
  lamps: Box[];
}

/** Floor, walls, bar, kitchen pass and the other fixed parts of the room. */
export function buildRoom(): RoomModel {
  const boxes: Box[] = [];
  const lamps: Box[] = [];
  const x0 = -HALF_X;
  const x1 = HALF_X;
  const z0 = -HALF_Z;
  const z1 = HALF_Z;
  const [passX0, passZ0] = toWorld(room.kitchenPass.x, room.kitchenPass.y);
  const [passX1, passZ1] = toWorld(room.kitchenPass.x + room.kitchenPass.width, room.kitchenPass.y + room.kitchenPass.height);
  const nook = 1.2;

  // Floor and rug.
  boxes.push(box(x0 - WALL, -0.1, z0 - WALL, x1 + WALL, 0, z1 + WALL, COLORS.floor));
  boxes.push(slab({ x: 140, y: 160, width: 290, height: 280 }, 0, 0.012, COLORS.rug));

  // North wall, open above the kitchen pass, with the kitchen behind.
  boxes.push(box(x0 - WALL, 0, z0 - WALL, passX0, TALL, z0, COLORS.wall));
  boxes.push(box(passX1, 0, z0 - WALL, x1 + WALL, TALL, z0, COLORS.wall));
  boxes.push(box(passX0, 0, z0 - WALL, passX1, 1, z0, COLORS.wall));
  boxes.push(box(passX0, 2.05, z0 - WALL, passX1, TALL, z0, COLORS.wall));
  boxes.push(box(passX0 - 0.2, -0.1, z0 - WALL - nook, passX1 + 0.2, 0, z0 - WALL, COLORS.kitchen));
  boxes.push(box(passX0 - 0.2, 0, z0 - WALL - nook - 0.2, passX1 + 0.2, TALL, z0 - WALL - nook, COLORS.kitchen));
  boxes.push(box(passX0 - 0.2, 0, z0 - WALL - nook, passX0, TALL, z0 - WALL, COLORS.kitchen));
  boxes.push(box(passX1, 0, z0 - WALL - nook, passX1 + 0.2, TALL, z0 - WALL, COLORS.kitchen));
  boxes.push(box(passX0 + 0.2, 0, z0 - WALL - nook, passX1 - 0.2, 0.92, z0 - WALL - nook + 0.62, COLORS.steel));
  boxes.push(box(passX0, 0, passZ0, passX1, 1, passZ1, COLORS.steel));
  boxes.push(box(passX0 - 0.03, 1, passZ0 - WALL, passX1 + 0.03, 1.05, passZ1 + 0.03, COLORS.steelTop));
  for (let index = 0; index < 3; index++) {
    const x = passX0 + ((index + 0.5) / 3) * (passX1 - passX0);
    lamps.push(box(x - 0.3, 1.78, passZ0 - 0.1, x + 0.3, 1.86, passZ0 + 0.2, "#ffcf8a"));
  }

  // West wall: a low sill with glazing above, piers between, and a header.
  const glazed = room.windows.map(({ y0, y1 }) => [toWorld(0, y0)[1], toWorld(0, y1)[1]] as const);
  boxes.push(box(x0 - WALL, 0, z0, x0, 0.5, z1, COLORS.sill));
  boxes.push(box(x0 - WALL, 2.4, z0, x0, TALL, z1, COLORS.wall));
  let edge = z0;
  for (const [g0, g1] of glazed) {
    if (g0 > edge) boxes.push(box(x0 - WALL, 0.5, edge, x0, 2.4, g0, COLORS.wall));
    boxes.push(box(x0 - WALL + 0.08, 0.5, g0, x0 - 0.08, 2.4, g1, COLORS.glass, "glass"));
    const panes = Math.max(1, Math.round((g1 - g0) / 1.25));
    for (let index = 0; index <= panes; index++) {
      const z = g0 + ((g1 - g0) * index) / panes;
      boxes.push(box(x0 - WALL + 0.04, 0.5, Math.max(g0, z - 0.03), x0 - 0.04, 2.4, Math.min(g1, z + 0.03), COLORS.frame));
    }
    edge = g1;
  }
  if (edge < z1) boxes.push(box(x0 - WALL, 0.5, edge, x0, 2.4, z1, COLORS.wall));

  // Cut-away east and south walls; the entrance is a gap in the south wall.
  const [doorX0] = toWorld(room.entrance.x0, 0);
  const [doorX1] = toWorld(room.entrance.x1, 0);
  boxes.push(box(x1, 0, z0, x1 + WALL, LOW, z1 + WALL, COLORS.wall));
  boxes.push(box(x0 - WALL, 0, z1, doorX0, SOUTH, z1 + WALL, COLORS.wall));
  boxes.push(box(doorX1, 0, z1, x1, SOUTH, z1 + WALL, COLORS.wall));

  // Wall lights above the booths.
  for (const x of [179, 285, 391]) {
    const [lx] = toWorld(x, 0);
    lamps.push(box(lx - 0.14, 1.7, z0, lx + 0.14, 2.02, z0 + 0.08, "#ffd9a0"));
  }

  // Bar, with stools and a back bar of bottles.
  boxes.push(slab(room.bar, 0, 1.02, COLORS.barFront, 0.04));
  const [barX0, barZ0] = toWorld(room.bar.x, room.bar.y);
  const [barX1, barZ1] = toWorld(room.bar.x + room.bar.width, room.bar.y + room.bar.height);
  boxes.push(box(barX0 - 0.08, 1.02, barZ0, barX1, 1.07, barZ1, COLORS.stone));
  boxes.push(slab(room.backBar, 0, 0.92, COLORS.barFront));
  const [backX0, backZ0] = toWorld(room.backBar.x, room.backBar.y);
  const [backX1, backZ1] = toWorld(room.backBar.x + room.backBar.width, room.backBar.y + room.backBar.height);
  boxes.push(box(backX0 - 0.02, 0.92, backZ0, backX1, 0.96, backZ1, COLORS.stone));
  const random = mulberry32(11);
  for (let z = backZ0 + 0.12; z < backZ1 - 0.1; z += 0.13 + random() * 0.1) {
    const height = 0.2 + random() * 0.12;
    boxes.push(box(backX0 + 0.12, 0.96, z, backX0 + 0.2, 0.96 + height, z + 0.08, COLORS.bottles[Math.floor(random() * COLORS.bottles.length)]));
  }
  for (const stool of room.stools) {
    const [sx, sz] = toWorld(stool.x, stool.y);
    boxes.push(box(sx - 0.18, 0.74, sz - 0.18, sx + 0.18, 0.79, sz + 0.18, COLORS.seat));
    boxes.push(box(sx - 0.025, 0.03, sz - 0.025, sx + 0.025, 0.74, sz + 0.025, COLORS.metal));
    boxes.push(box(sx - 0.16, 0, sz - 0.16, sx + 0.16, 0.03, sz + 0.16, COLORS.metal));
  }

  // Host stand and planters.
  boxes.push(slab(room.hostStand, 0, 1.05, COLORS.barFront));
  boxes.push(slab(room.hostStand, 1.05, 1.09, COLORS.stone, -0.03));
  room.planters.forEach((item, index) => boxes.push(...planter(item.x, item.y, item.size, 31 + index)));

  return { boxes, lamps };
}

// Baked light: a soft overhead key from the camera side, ambient sky, warm bounce,
// and warm downlights over every table.
const KEY: Vec3 = (() => {
  const v: Vec3 = [0.3, 1, 0.3];
  const length = Math.hypot(...v);
  return [v[0] / length, v[1] / length, v[2] / length];
})();
const KEY_COLOR: Vec3 = [0.74, 0.7, 0.63];
const SKY_COLOR: Vec3 = [0.6, 0.6, 0.6];
const BOUNCE_COLOR: Vec3 = [0.2, 0.16, 0.12];
const LAMP_COLOR: Vec3 = [1, 0.74, 0.46];

export function roomLighting(tables: readonly DemoTable[]): Lighting {
  const lamps = tables.map((item) => {
    const [x, z] = tableCenter(item);
    return [x, 2.3, z] as Vec3;
  });
  return {
    sun: KEY,
    light(target, sun, sky, bounce, point, normal) {
      let r = KEY_COLOR[0] * sun + SKY_COLOR[0] * sky + BOUNCE_COLOR[0] * bounce;
      let g = KEY_COLOR[1] * sun + SKY_COLOR[1] * sky + BOUNCE_COLOR[1] * bounce;
      let b = KEY_COLOR[2] * sun + SKY_COLOR[2] * sky + BOUNCE_COLOR[2] * bounce;
      for (const lamp of lamps) {
        const dx = lamp[0] - point[0];
        const dy = lamp[1] - point[1];
        const dz = lamp[2] - point[2];
        const d2 = dx * dx + dy * dy + dz * dz;
        const facing = (dx * normal[0] + dy * normal[1] + dz * normal[2]) / Math.sqrt(d2);
        if (facing <= 0) continue;
        const k = (0.34 * facing) / (1 + d2 * 0.9);
        r += LAMP_COLOR[0] * k;
        g += LAMP_COLOR[1] * k;
        b += LAMP_COLOR[2] * k;
      }
      return target.setRGB(r, g, b);
    },
  };
}
