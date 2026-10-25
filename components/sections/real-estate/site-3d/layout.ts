import { Color, Vector3 } from "three";
import type { Lighting } from "@/lib/three/bake";
import { fbm2, smoothstep } from "@/lib/three/noise";

// World space is metres: x east, z south, y up. The development keeps the
// sample plan's 800 × 520 viewBox, so the 2D and 3D plans always agree.

export const PLAN_SCALE = 0.25;

export interface Rect { x0: number; z0: number; x1: number; z1: number }
export type Point = [x: number, z: number];

export const toWorld = (x: number, y: number): Point => [(x - 400) * PLAN_SCALE, (y - 260) * PLAN_SCALE];

export function shapeRect(shape: { x: number; y: number; width: number; height: number }): Rect {
  const [x0, z0] = toWorld(shape.x, shape.y);
  const [x1, z1] = toWorld(shape.x + shape.width, shape.y + shape.height);
  return { x0, z0, x1, z1 };
}

export const rectCenter = (rect: Rect): Point => [(rect.x0 + rect.x1) / 2, (rect.z0 + rect.z1) / 2];

/** The fenced development: the plan's land rectangle. */
export const PLAN_RECT: Rect = { x0: -100, z0: -65, x1: 100, z1: 65 };
export const PLAN_CORNER = 5.5;

/** Area covered by the painted site textures; the forest clearing around the plan. */
export const SITE_BOUNDS: Rect = { x0: -200, z0: -105, x1: 160, z1: 125 };
/** Terrain and region-mask extent. */
export const WORLD_HALF = 900;

// Baked light. Ground, buildings and trees all share these values.
export const SUN = new Vector3(-0.52, 0.74, 0.42).normalize();
export const SUN_COLOR = new Color(1, 0.95, 0.86).multiplyScalar(1.15);
export const SKY_COLOR = new Color(0.62, 0.71, 0.86).multiplyScalar(0.62);
export const BOUNCE_COLOR = new Color(0.46, 0.45, 0.36).multiplyScalar(0.3);
/** Sets `target` to the baked light from sun, sky and ground bounce at the given strengths. */
export function bakedLight(target: Color, sun: number, sky: number, bounce: number): Color {
  return target.setRGB(
    SUN_COLOR.r * sun + SKY_COLOR.r * sky + BOUNCE_COLOR.r * bounce,
    SUN_COLOR.g * sun + SKY_COLOR.g * sky + BOUNCE_COLOR.g * bounce,
    SUN_COLOR.b * sun + SKY_COLOR.b * sky + BOUNCE_COLOR.b * bounce,
  );
}
/** Sun and sky for baking homes, the tower and props. */
export const SITE_LIGHTING: Lighting = { sun: [SUN.x, SUN.y, SUN.z], light: bakedLight };
/** Ground offset of a shadow cast from a height of 1 m. */
export const SHADOW_STEP: Point = [-SUN.x / SUN.y, -SUN.z / SUN.y];
/** Haze the scene fades into; matches the page's sky. */
export const HAZE = new Color("#e8eef5");

export interface Road {
  points: Point[];
  width: number;
  /** Sidewalk width either side. */
  walk: number;
  centreLine?: boolean;
}

const roadA = (203 - 260) * PLAN_SCALE;
const roadC = (347 - 260) * PLAN_SCALE;
const roadB = (644 - 400) * PLAN_SCALE;

export const SITE_ROADS: readonly Road[] = [
  { points: [[-100, roadA], [roadB, roadA]], width: 7.5, walk: 2, centreLine: true },
  { points: [[roadB, -60], [roadB, roadC]], width: 6, walk: 1.5 },
  { points: [[-94.5, roadC], [90, roadC]], width: 6, walk: 2 },
  { points: [[-94.5, roadA], [-94.5, roadC]], width: 5.5, walk: 0 },
];
export const TURNING_CIRCLE = { center: [90, roadC] as Point, radius: 6.5 };
export const ROAD_A = roadA;
/** Verge lines for street trees. */
export const STREET_LINES = { north: roadA - 7.25, south: roadA + 7, park: roadC + 6.35 };

/** The access road from the gate out through the forest, as Catmull–Rom control points. */
export const ACCESS_ROAD: readonly Point[] = [[-100, roadA], [-150, roadA], [-215, roadA - 12], [-300, -70], [-420, -96], [-560, -90], [-760, -40], [-980, 20]];
export const ACCESS_WIDTH = 7;

export const PARK: Rect = shapeRect({ x: 40, y: 378, width: 360, height: 118 });
export const PARK_PATHS: readonly Point[][] = [
  [[-62, 26.5], [-56, 36], [-45, 37.5], [-31, 44], [-18, 52], [-6, 47], [6, 40]],
  [[-86, 26.5], [-84, 38], [-74, 43], [-58, 45]],
];
export const PARK_LOOP = { center: [-45, 45] as Point, rx: 13, rz: 7.5 };
export const PLAYGROUND: Rect = { x0: -84, z0: 48, x1: -71, z1: 57 };

export const LAKE = { center: toWorld(600, 436), rx: 170 * PLAN_SCALE, rz: 54 * PLAN_SCALE };
export const PIER: Rect = { x0: 38.5, z0: 27.8, x1: 41.5, z1: 36.5 };

export const TOWER = { x0: 69.5, z0: -38, x1: 87.5, z1: 10, floorHeight: 3.3 };
export const PARKING: Rect = { x0: 66, z0: -50.5, x1: 91, z1: -40 };

export function sampleSpline(points: readonly Point[], count: number): Point[] {
  const out: Point[] = [];
  const segments = points.length - 1;
  for (let index = 0; index <= count; index++) {
    const t = (index / count) * segments;
    const i = Math.min(segments - 1, Math.floor(t));
    const u = t - i;
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const u2 = u * u;
    const u3 = u2 * u;
    const axis = (k: 0 | 1) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3);
    out.push([axis(0), axis(1)]);
  }
  return out;
}

export const accessRoadLine = sampleSpline(ACCESS_ROAD, 40);

export function distanceToPolyline(x: number, z: number, line: readonly Point[]): number {
  let best = Infinity;
  for (let index = 0; index < line.length - 1; index++) {
    const [ax, az] = line[index];
    const [bx, bz] = line[index + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const h = Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
    const ex = x - ax - dx * h;
    const ez = z - az - dz * h;
    best = Math.min(best, ex * ex + ez * ez);
  }
  return Math.sqrt(best);
}

const roadBox = accessRoadLine.reduce((box, [x, z]) => ({ x0: Math.min(box.x0, x), z0: Math.min(box.z0, z), x1: Math.max(box.x1, x), z1: Math.max(box.z1, z) }), { x0: Infinity, z0: Infinity, x1: -Infinity, z1: -Infinity });

/** Distance to the access road, or `reach` when it is at least that far away. */
export function accessRoadDistance(x: number, z: number, reach: number): number {
  if (x < roadBox.x0 - reach || x > roadBox.x1 + reach || z < roadBox.z0 - reach || z > roadBox.z1 + reach) return reach;
  return Math.min(reach, distanceToPolyline(x, z, accessRoadLine));
}

/** Signed distance from a rectangle (negative inside). */
export function rectDistance(x: number, z: number, rect: Rect): number {
  const dx = Math.abs(x - (rect.x0 + rect.x1) / 2) - (rect.x1 - rect.x0) / 2;
  const dz = Math.abs(z - (rect.z0 + rect.z1) / 2) - (rect.z1 - rect.z0) / 2;
  return Math.hypot(Math.max(dx, 0), Math.max(dz, 0)) + Math.min(Math.max(dx, dz), 0);
}

/** Forest cover in [0, 1]: a clearing around the development, kept off the access road. */
export function forestDensity(x: number, z: number): number {
  const edge = rectDistance(x, z, PLAN_RECT);
  const wobble = (fbm2(x * 0.013, z * 0.013, 3, 11) - 0.5) * 56;
  const clearing = smoothstep(30, 62, edge + wobble);
  const road = smoothstep(8, 16, accessRoadDistance(x, z, 16));
  const patches = smoothstep(0.3, 0.55, fbm2(x * 0.005, z * 0.005, 3, 5));
  return clearing * road * (0.55 + 0.45 * patches);
}

/** Ground height: a level site in gently rolling woodland, rising to hills in the haze. */
export function heightAt(x: number, z: number): number {
  const edge = rectDistance(x, z, PLAN_RECT);
  const rolling = (fbm2(x * 0.006, z * 0.006, 3, 3) - 0.45) * 18 * smoothstep(45, 230, edge);
  const hills = smoothstep(320, 860, Math.hypot(x, z)) * (30 + 70 * fbm2(x * 0.0025, z * 0.0025, 3, 9));
  return rolling + hills;
}
