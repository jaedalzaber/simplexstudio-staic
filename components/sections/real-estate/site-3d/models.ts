import type { HomeConfig, HomeFinish, Plot } from "@/content/real-estate";
import type { Box } from "@/lib/three/bake";
import { PARKING, PIER, TOWER, rectCenter, shapeRect, type Rect } from "./layout";
import { mulberry32, seedFrom, type Random } from "@/lib/three/noise";

// Box massing for every building. Homes are modelled in a local frame
// (+z towards the street, origin at the plot centre) and placed by a frame.

export type TreeKind = "broadleaf" | "conifer" | "columnar" | "shrub";
export interface TreeSpot { x: number; z: number; kind: TreeKind; scale: number }

export interface HomeModel {
  boxes: Box[];
  /** Driveways, paths, patios and pool coping. */
  paving: Rect[];
  pools: Rect[];
  trees: TreeSpot[];
  /** Roof height, for the label anchor. */
  height: number;
}

type Span = [number, number];
type Facade = "front" | "back" | "left" | "right";

interface Volume {
  x: Span;
  z: Span;
  y: Span;
  glaze?: Partial<Record<Facade, Span[]>>;
  roof?: "membrane" | "green";
}

interface Design {
  volumes: Volume[];
  garage?: Span;
  rails?: [x: Span, y: Span, z: Span][];
  paving: [x: Span, z: Span][];
  pool: [x: Span, z: Span];
  trees: TreeSpot[];
}

const FINISHES: Record<HomeFinish, { wall: string; trim: string; roof: string }> = {
  white: { wall: "#f4f2ee", trim: "#e7e4de", roof: "#dddbd6" },
  stone: { wall: "#d9c7a6", trim: "#f1eee8", roof: "#d9d6cf" },
  timber: { wall: "#4a4540", trim: "#efede9", roof: "#d6d4cf" },
};
const GLASS = "#27313c";
const DOOR = "#9a9ea3";
const SOLAR = "#1c2537";
const GREEN_ROOF = "#7f9a5c";
const CAR_COLORS = ["#eef0f2", "#eef0f2", "#b9bec5", "#25282d", "#6c7279", "#3e5878", "#e9e6df"];

const VILLA: Record<HomeConfig["design"], Design> = {
  cubic: {
    volumes: [
      { x: [-6.5, 4.6], z: [-4, 6.5], y: [0, 3.3], glaze: { front: [[-5.6, 3.6]], back: [[-5.6, 0.5]], left: [[-3, 5]] } },
      { x: [4.6, 8.4], z: [0, 7], y: [0, 3] },
      { x: [-7.6, 3.2], z: [-5.4, 5.2], y: [3.3, 6.5], glaze: { front: [[-6.8, 1.8]], back: [[-6.8, 2.4]], left: [[-4.5, 4.4]] } },
    ],
    garage: [5.1, 7.9],
    rails: [[[-6.5, 4.6], [3.56, 4.5], [6.42, 6.5]]],
    paving: [[[4.8, 8.2], [7, 17]], [[-1.7, -0.3], [6.5, 17]], [[-7, 4.6], [-8, -4]]],
    pool: [[-6, 3], [-12.2, -8.6]],
    trees: [{ x: -8.6, z: -11.4, kind: "broadleaf", scale: 0.95 }, { x: 8.7, z: -11, kind: "broadleaf", scale: 0.8 }, { x: -8.8, z: 10.6, kind: "columnar", scale: 0.8 }],
  },
  split: {
    volumes: [
      { x: [-7.5, -1.5], z: [-5.5, 6], y: [0, 6.6], glaze: { front: [[-6.8, -2.2]], back: [[-6.8, -2.2]], left: [[-4, 4]] } },
      { x: [-1.5, 8.4], z: [-3.5, 7.2], y: [0, 3.4], glaze: { front: [[-0.8, 4.2]], back: [[-0.8, 7.6]] }, roof: "green" },
    ],
    garage: [4.9, 7.9],
    paving: [[[4.7, 8.1], [7.2, 17]], [[-5, -3.6], [6, 17]], [[-7.5, 8.4], [-8, -3.5]]],
    pool: [[-1, 8], [-12.2, -8.8]],
    trees: [{ x: -8.6, z: -11.6, kind: "broadleaf", scale: 1 }, { x: -9, z: 10.8, kind: "columnar", scale: 0.85 }, { x: 9.2, z: -3, kind: "conifer", scale: 0.55 }],
  },
  courtyard: {
    volumes: [
      { x: [-7.8, 8.4], z: [1.5, 7], y: [0, 3.4], glaze: { front: [[-6.8, 3.6]], back: [[-2, 4]] } },
      { x: [-7.8, -2.8], z: [-9, 1.5], y: [0, 3.4], glaze: { right: [[-8, 0.5]], left: [[-7, -1]] } },
      { x: [-7.8, -2], z: [-3, 7], y: [3.4, 6.5], glaze: { front: [[-7, -2.8]], back: [[-7, -2.8]], right: [[-2, 6]] } },
    ],
    garage: [4.9, 8],
    paving: [[[4.7, 8.1], [7, 17]], [[-1, 0.4], [7, 17]], [[-2.8, 7.2], [-6.4, 1.5]]],
    pool: [[-1.6, 6.6], [-5.4, -2.3]],
    trees: [{ x: 8.4, z: -10.6, kind: "broadleaf", scale: 1.05 }, { x: -9, z: -12, kind: "columnar", scale: 0.8 }, { x: -9, z: 11, kind: "broadleaf", scale: 0.6 }],
  },
};

const TOWNHOUSE: Record<HomeConfig["design"], Design> = {
  cubic: {
    volumes: [
      { x: [-5, 5], z: [-4.5, 5], y: [0, 6.4], glaze: { front: [[-4.2, -0.4], [0.6, 4.2]], back: [[-4.2, 4.2]] } },
      { x: [-5, 1.2], z: [-4.5, 1.5], y: [6.4, 9.3], glaze: { front: [[-4.4, 0.4]], back: [[-4.2, 0.4]] } },
    ],
    rails: [[[-5, 5], [6.66, 7.6], [4.92, 5]], [[4.92, 5], [6.66, 7.6], [-4.5, 5]]],
    paving: [[[0.8, 4.8], [5, 13]], [[-2.6, -1.4], [5, 13]], [[-5, 5], [-7, -4.5]]],
    pool: [[-4, 1.5], [-9.4, -7.4]],
    trees: [{ x: 6.2, z: -8.6, kind: "broadleaf", scale: 0.75 }, { x: -6.4, z: 9, kind: "shrub", scale: 1.3 }],
  },
  split: {
    volumes: [
      { x: [-5, 0], z: [-5, 5], y: [0, 9.4], glaze: { front: [[-4.3, -0.7]], back: [[-4.3, -0.7]], left: [[-3, 3]] } },
      { x: [0, 5], z: [-4.5, 4.2], y: [0, 6.2], glaze: { front: [[0.6, 4.4]], back: [[0.6, 4.4]] }, roof: "green" },
    ],
    paving: [[[0.8, 4.8], [4.2, 13]], [[-3.2, -2], [5, 13]], [[-5, 5], [-7, -4.5]]],
    pool: [[-1, 4.5], [-9.4, -7.4]],
    trees: [{ x: -6.2, z: -8.6, kind: "broadleaf", scale: 0.8 }, { x: -6.4, z: 9.2, kind: "columnar", scale: 0.6 }],
  },
  courtyard: {
    volumes: [
      { x: [-5, 5], z: [0, 5], y: [0, 6.4], glaze: { front: [[-4.2, -0.6]], back: [[-4.2, 4.2]] } },
      { x: [-5, -0.8], z: [-6.5, 0], y: [0, 3.3], glaze: { right: [[-6, -0.5]] } },
    ],
    paving: [[[0.8, 4.8], [5, 13]], [[-2.6, -1.4], [5, 13]], [[-0.8, 5], [-6.5, 0]]],
    pool: [[0, 4.2], [-5.6, -3.4]],
    trees: [{ x: 6.2, z: -8.8, kind: "broadleaf", scale: 0.8 }, { x: -3, z: -8.8, kind: "shrub", scale: 1.4 }],
  },
};

const box = (x: Span, y: Span, z: Span, color: string, finish?: Box["finish"]): Box => ({ min: [x[0], y[0], z[0]], max: [x[1], y[1], z[1]], color, finish });

/** Glass bands for one facade, one per storey. */
function glazing(volume: Volume, facade: Facade, spans: Span[]): Box[] {
  const storeys = Math.max(1, Math.round((volume.y[1] - volume.y[0]) / 3.1));
  const storey = (volume.y[1] - volume.y[0]) / storeys;
  const out: Box[] = [];
  for (let level = 0; level < storeys; level++) {
    const y: Span = [volume.y[0] + level * storey + (level === 0 && volume.y[0] === 0 ? 0.12 : 0.5), volume.y[0] + (level + 1) * storey - 0.42];
    for (const span of spans) {
      if (facade === "front") out.push(box(span, y, [volume.z[1], volume.z[1] + 0.05], GLASS, "glass"));
      if (facade === "back") out.push(box(span, y, [volume.z[0] - 0.05, volume.z[0]], GLASS, "glass"));
      if (facade === "left") out.push(box([volume.x[0] - 0.05, volume.x[0]], y, span, GLASS, "glass"));
      if (facade === "right") out.push(box([volume.x[1], volume.x[1] + 0.05], y, span, GLASS, "glass"));
    }
  }
  return out;
}

function solarArray(volume: Volume): Box[] {
  const top = volume.y[1] + 0.3;
  const out: Box[] = [];
  const x: Span = [volume.x[0] + 0.7, volume.x[1] - 0.7];
  for (let z = volume.z[0] + 0.7; z + 1.05 <= volume.z[1] - 0.6; z += 1.4) out.push(box(x, [top + 0.08, top + 0.2], [z, z + 1.05], SOLAR, "glass"));
  return out;
}

function homeBoxes(design: Design, config: HomeConfig): Box[] {
  const finish = FINISHES[config.finish];
  const out: Box[] = [];
  for (const volume of design.volumes) {
    out.push(box(volume.x, volume.y, volume.z, finish.wall));
    // Thin roof slab with a small overhang, and an inset membrane or planted roof on top.
    out.push(box([volume.x[0] - 0.22, volume.x[1] + 0.22], [volume.y[1], volume.y[1] + 0.26], [volume.z[0] - 0.22, volume.z[1] + 0.22], finish.trim));
    out.push(box([volume.x[0] + 0.12, volume.x[1] - 0.12], [volume.y[1] + 0.26, volume.y[1] + 0.3], [volume.z[0] + 0.12, volume.z[1] - 0.12], volume.roof === "green" ? GREEN_ROOF : finish.roof));
    for (const facade of ["front", "back", "left", "right"] as const) {
      const spans = volume.glaze?.[facade];
      if (spans) out.push(...glazing(volume, facade, spans));
    }
  }
  if (design.garage) {
    const garage = design.volumes.find((volume) => volume.x[0] <= design.garage![0] && volume.x[1] >= design.garage![1]) ?? design.volumes[0];
    out.push(box(design.garage, [0, 2.45], [garage.z[1], garage.z[1] + 0.05], DOOR));
  }
  for (const [x, y, z] of design.rails ?? []) out.push(box(x, y, z, finish.trim));
  if (config.solar) {
    const highest = design.volumes.reduce((top, volume) => (volume.y[1] > top.y[1] ? volume : top));
    out.push(...solarArray(highest));
  }
  return out;
}

export function carBoxes(x: number, z: number, color: string, alongX = false): Box[] {
  const parts: [Span, Span, Span, string, Box["finish"]?][] = [
    [[-0.86, 0.86], [0, 0.34], [-1.85, 1.85], "#1c1e21"],
    [[-0.92, 0.92], [0.32, 0.92], [-2.25, 2.25], color],
    [[-0.8, 0.8], [0.92, 1.38], [-1.05, 0.95], GLASS, "glass"],
    [[-0.76, 0.76], [1.38, 1.44], [-0.85, 0.75], color],
  ];
  return parts.map(([px, py, pz, colour, finish]) => alongX
    ? box([x + pz[0], x + pz[1]], py, [z + px[0], z + px[1]], colour, finish)
    : box([x + px[0], x + px[1]], py, [z + pz[0], z + pz[1]], colour, finish));
}

interface Frame { cx: number; cz: number; sx: number; sz: number }

const frameX = (frame: Frame, span: Span): Span => {
  const a = frame.cx + frame.sx * span[0];
  const b = frame.cx + frame.sx * span[1];
  return a < b ? [a, b] : [b, a];
};
const frameZ = (frame: Frame, span: Span): Span => {
  const a = frame.cz + frame.sz * span[0];
  const b = frame.cz + frame.sz * span[1];
  return a < b ? [a, b] : [b, a];
};
const frameRect = (frame: Frame, x: Span, z: Span): Rect => {
  const [x0, x1] = frameX(frame, x);
  const [z0, z1] = frameZ(frame, z);
  return { x0, z0, x1, z1 };
};

/** Villas face the main street to the south; townhouses face it to the north. Alternate plots are mirrored. */
export function plotFrame(plot: Plot, index: number): Frame {
  const [cx, cz] = rectCenter(shapeRect(plot.shape));
  const south = plot.type === "Villa";
  const mirror = index % 2 === 1;
  return { cx, cz, sx: (south ? 1 : -1) * (mirror ? -1 : 1), sz: south ? 1 : -1 };
}

export function buildHome(plot: Plot, index: number, config: HomeConfig): HomeModel {
  const design = (plot.type === "Villa" ? VILLA : TOWNHOUSE)[config.design];
  const frame = plotFrame(plot, index);
  const random = mulberry32(seedFrom(plot.id));

  const boxes = homeBoxes(design, config).map((local) => {
    const [x0, x1] = frameX(frame, [local.min[0], local.max[0]]);
    const [z0, z1] = frameZ(frame, [local.min[2], local.max[2]]);
    return { ...local, min: [x0, local.min[1], z0], max: [x1, local.max[1], z1] } satisfies Box;
  });

  const paving = design.paving.map(([x, z]) => frameRect(frame, x, z));
  const pools: Rect[] = [];
  if (config.pool) {
    const [x, z] = design.pool;
    paving.push(frameRect(frame, [x[0] - 0.7, x[1] + 0.7], [z[0] - 0.7, z[1] + 0.7]));
    pools.push(frameRect(frame, x, z));
  }

  // A car on most drives, parked nose-in.
  const drive = design.paving[0];
  if (random() < 0.75) {
    const [x] = frameX(frame, [(drive[0][0] + drive[0][1]) / 2, (drive[0][0] + drive[0][1]) / 2]);
    const [z] = frameZ(frame, [drive[1][0] + 2.9, drive[1][0] + 2.9]);
    boxes.push(...carBoxes(x, z, CAR_COLORS[Math.floor(random() * CAR_COLORS.length)]));
  }

  const trees = design.trees.map((tree) => ({ ...tree, x: frame.cx + frame.sx * tree.x, z: frame.cz + frame.sz * tree.z, scale: tree.scale * (0.9 + random() * 0.2) }));
  const height = Math.max(...boxes.map((item) => item.max[1]));
  return { boxes, paving, pools, trees, height };
}

/** Building A: glass storeys between white slabs, with balcony parapets and rooftop plant. */
export function buildTower(floors: number): Box[] {
  const { x0, x1, z0, z1, floorHeight: g } = TOWER;
  const white = "#f2f1ee";
  const out: Box[] = [];
  for (let floor = 0; floor < floors; floor++) {
    const y = floor * g;
    out.push(box([x0 + 0.7, x1 - 0.7], [y, y + g - 0.34], [z0 + 0.7, z1 - 0.7], GLASS, "glass"));
    out.push(box([x0, x1], [y + g - 0.34, y + g], [z0, z1], white));
    if (floor > 0) {
      out.push(box([x0, x0 + 0.1], [y, y + 1.05], [z0, z1], white));
      out.push(box([x1 - 0.1, x1], [y, y + 1.05], [z0, z1], white));
    }
  }
  const top = floors * g;
  // Fins at the unit party walls and the corners.
  for (let k = 0; k <= 4; k++) {
    const z = z0 + 0.45 + ((z1 - z0 - 0.9) * k) / 4;
    out.push(box([x0 + 0.35, x0 + 0.85], [0, top], [z - 0.25, z + 0.25], white));
    out.push(box([x1 - 0.85, x1 - 0.35], [0, top], [z - 0.25, z + 0.25], white));
  }
  out.push(box([x0, x1], [top, top + 0.9], [z0, z0 + 0.22], white));
  out.push(box([x0, x1], [top, top + 0.9], [z1 - 0.22, z1], white));
  out.push(box([x0, x0 + 0.22], [top, top + 0.9], [z0 + 0.22, z1 - 0.22], white));
  out.push(box([x1 - 0.22, x1], [top, top + 0.9], [z0 + 0.22, z1 - 0.22], white));
  out.push(box([x0 + 0.22, x1 - 0.22], [top, top + 0.05], [z0 + 0.22, z1 - 0.22], "#dad8d3"));
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  out.push(box([cx - 3.5, cx + 3.5], [top, top + 3], [cz - 5, cz + 5], "#e9e7e3"));
  for (const side of [-1, 1]) {
    for (let row = 0; row < 7; row++) {
      const z = side < 0 ? z0 + 1.4 + row * 1.5 : z1 - 2.4 - row * 1.5;
      out.push(box([x0 + 1.4, x1 - 1.4], [top + 0.15, top + 0.3], [z, z + 1.05], SOLAR, "glass"));
    }
  }
  // Entrance canopy facing the park.
  out.push(box([cx - 4, cx + 4], [g - 0.34, g], [z1, z1 + 3.5], white));
  return out;
}

/** Cars in the residents' car park, plus the gatehouse, pier and play equipment. */
export function buildProps(random: Random): Box[] {
  const out: Box[] = [];
  for (let stall = 0; stall < 10; stall++) {
    if (random() < 0.35) continue;
    const x = PARKING.x0 + 1.25 + stall * 2.5;
    out.push(...carBoxes(x, PARKING.z0 + 2.6, CAR_COLORS[Math.floor(random() * CAR_COLORS.length)]));
  }
  out.push(box([PIER.x0, PIER.x1], [0, 0.42], [PIER.z0, PIER.z1], "#a88a68"));
  out.push(box([-109, -104], [0, 2.9], [-26.5, -21.5], "#f2f1ee"));
  out.push(box([-109.3, -103.7], [2.9, 3.15], [-26.8, -21.2], "#e3e1dc"));
  out.push(box([-104.05, -104], [0.3, 2.4], [-25.5, -22.5], GLASS, "glass"));
  // Play equipment.
  out.push(box([-82, -79], [0, 2.2], [50, 51], "#c99b6a"));
  out.push(box([-82, -79], [2.2, 2.35], [49.6, 51.4], "#e9e6df"));
  out.push(box([-76, -73.5], [0, 0.9], [52.5, 55], "#8fb3c9"));
  return out;
}
