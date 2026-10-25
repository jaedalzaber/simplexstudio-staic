import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries, mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import type { Plot } from "@/content/real-estate";
import {
  LAKE,
  PARK,
  PARK_LOOP,
  PARK_PATHS,
  PLAN_CORNER,
  PLAN_RECT,
  PLAYGROUND,
  ROAD_A,
  STREET_LINES,
  SUN,
  TOWER,
  accessRoadDistance,
  bakedLight,
  distanceToPolyline,
  forestDensity,
  heightAt,
  rectDistance,
  shapeRect,
  type Point,
} from "./layout";
import type { TreeKind, TreeSpot } from "./models";
import { fbm2, mulberry32, type Random } from "./noise";

// Low-poly trees with faceted, baked light. One instanced mesh per species
// and level of detail keeps thousands of trees to a handful of draw calls.

export type Species = TreeKind | "hedge";
export interface Planting extends Omit<TreeSpot, "kind"> { kind: Species; far?: boolean }

/** Canopy centre height and radius at scale 1, for painting ground shadows. */
export const CANOPY: Record<Species, { height: number; radius: number; strength: number }> = {
  broadleaf: { height: 4.7, radius: 2.5, strength: 0.78 },
  conifer: { height: 4.2, radius: 1.9, strength: 0.72 },
  columnar: { height: 4.3, radius: 1.15, strength: 0.7 },
  shrub: { height: 0.55, radius: 0.8, strength: 0.55 },
  hedge: { height: 0.6, radius: 0.75, strength: 0.6 },
};

const ALBEDO: Record<Species | "trunk", string> = {
  broadleaf: "#5a8a3a",
  conifer: "#3f6a37",
  columnar: "#58833c",
  shrub: "#5f8b3f",
  hedge: "#4b7a36",
  trunk: "#6a5442",
};

const albedo = new Color();
const light = new Color();

/** Bakes faceted light into a non-indexed geometry: sun, sky and height-based occlusion. */
function bake(geometry: BufferGeometry, color: string, random: Random, occlusion: [low: number, high: number] = [0.45, 1]): BufferGeometry {
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox!;
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  const normal = new Vector3();
  albedo.set(color);
  for (let index = 0; index < position.count; index += 3) {
    a.fromBufferAttribute(position, index);
    b.fromBufferAttribute(position, index + 1);
    c.fromBufferAttribute(position, index + 2);
    normal.subVectors(c, b).cross(a.clone().sub(b)).normalize();
    const height = ((a.y + b.y + c.y) / 3 - min.y) / Math.max(0.001, max.y - min.y);
    const ao = occlusion[0] + (occlusion[1] - occlusion[0]) * height;
    const sun = Math.max(0, normal.dot(SUN));
    bakedLight(light, sun * 0.92, ao * (0.55 + 0.45 * Math.max(0, normal.y)), ao * 0.6);
    const jitter = 0.9 + random() * 0.18;
    for (let corner = 0; corner < 3; corner++) {
      colors[(index + corner) * 3] = albedo.r * light.r * jitter;
      colors[(index + corner) * 3 + 1] = albedo.g * light.g * jitter;
      colors[(index + corner) * 3 + 2] = albedo.b * light.b * jitter;
    }
  }
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return geometry;
}

function plain(geometry: BufferGeometry): BufferGeometry {
  const out = geometry.index ? geometry.toNonIndexed() : geometry;
  out.deleteAttribute("normal");
  out.deleteAttribute("uv");
  return out;
}

/** A lumpy sphere: shared vertices are pushed in and out before faceting. */
function blob(detail: number, random: Random, amount = 0.32): BufferGeometry {
  const sphere = new IcosahedronGeometry(1, detail);
  sphere.deleteAttribute("normal");
  sphere.deleteAttribute("uv");
  const merged = mergeVertices(sphere);
  const position = merged.getAttribute("position");
  const v = new Vector3();
  for (let index = 0; index < position.count; index++) {
    v.fromBufferAttribute(position, index);
    v.multiplyScalar(1 + (random() - 0.5) * amount);
    position.setXYZ(index, v.x, v.y, v.z);
  }
  return merged.toNonIndexed();
}

function trunk(height: number, radius: number, random: Random): BufferGeometry {
  const geometry = plain(new CylinderGeometry(radius * 0.7, radius, height, 5, 1, true));
  geometry.translate(0, height / 2, 0);
  return bake(geometry, ALBEDO.trunk, random, [0.5, 0.9]);
}

function speciesGeometry(species: Species, far: boolean, random: Random): BufferGeometry {
  if (species === "broadleaf") {
    const crown = blob(far ? 0 : 1, random);
    crown.scale(2.5, 2.2, 2.5).translate(0, 4.7, 0);
    const parts = [bake(crown, ALBEDO.broadleaf, random)];
    if (!far) {
      const side = blob(1, random);
      side.scale(1.6, 1.4, 1.6).translate(1.3, 3.8, 0.6);
      parts.push(bake(side, ALBEDO.broadleaf, random), trunk(3.2, 0.24, random));
    }
    return mergeGeometries(parts)!;
  }
  if (species === "conifer") {
    const tiers = far ? 2 : 3;
    const parts: BufferGeometry[] = [];
    for (let tier = 0; tier < tiers; tier++) {
      const t = tier / tiers;
      const cone = plain(new ConeGeometry(2.1 * (1 - t * 0.55), 4.6 - t, far ? 6 : 7, 1, true));
      cone.translate(0, 2.6 + tier * (far ? 2.6 : 1.9) + (4.6 - t) / 2, 0);
      parts.push(bake(cone, ALBEDO.conifer, random, [0.35, 1]));
    }
    if (!far) parts.push(trunk(2.8, 0.22, random));
    return mergeGeometries(parts)!;
  }
  if (species === "columnar") {
    const crown = blob(1, random, 0.22);
    crown.scale(1.15, 2.7, 1.15).translate(0, 4.4, 0);
    return mergeGeometries([bake(crown, ALBEDO.columnar, random), trunk(1.9, 0.16, random)])!;
  }
  const bush = blob(0, random, 0.35);
  if (species === "hedge") bush.scale(0.8, 0.75, 0.8).translate(0, 0.6, 0);
  else bush.scale(0.85, 0.65, 0.85).translate(0, 0.5, 0);
  return bake(bush, ALBEDO[species], random, [0.55, 1]);
}

const material = new MeshBasicMaterial({ vertexColors: true });

/** Instanced meshes for a list of plantings, grouped by species and detail. */
export function plant(spots: readonly Planting[], seed: number): Group {
  const random = mulberry32(seed);
  const group = new Group();
  const buckets = new Map<string, Planting[]>();
  for (const spot of spots) {
    const key = `${spot.kind}:${spot.far ? 1 : 0}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(spot);
    else buckets.set(key, [spot]);
  }
  const matrix = new Matrix4();
  const rotation = new Quaternion();
  const up = new Vector3(0, 1, 0);
  const position = new Vector3();
  const scale = new Vector3();
  const tint = new Color();
  for (const [key, list] of buckets) {
    const [kind, far] = key.split(":") as [Species, string];
    const mesh = new InstancedMesh(speciesGeometry(kind, far === "1", random), material, list.length);
    list.forEach((spot, index) => {
      rotation.setFromAxisAngle(up, random() * Math.PI * 2);
      position.set(spot.x, heightAt(spot.x, spot.z) - 0.12, spot.z);
      const s = spot.scale;
      scale.set(s * (0.9 + random() * 0.2), s * (0.88 + random() * 0.26), s * (0.9 + random() * 0.2));
      mesh.setMatrixAt(index, matrix.compose(position, rotation, scale));
      const shade = 0.84 + random() * 0.3;
      const warm = (random() - 0.5) * 0.12;
      mesh.setColorAt(index, tint.setRGB(shade * (1 + warm), shade, shade * (1 - warm * 1.4)));
    });
    mesh.computeBoundingSphere();
    group.add(mesh);
  }
  return group;
}

export function disposePlanting(group: Group) {
  group.traverse((child) => {
    if (child instanceof InstancedMesh) {
      child.geometry.dispose();
      child.dispose();
    }
  });
}

function pick<T>(random: Random, options: readonly [T, number][]): T {
  let roll = random() * options.reduce((sum, [, weight]) => sum + weight, 0);
  for (const [value, weight] of options) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return options[0][0];
}

function smoothPathDistance(x: number, z: number) {
  return Math.min(...PARK_PATHS.map((path) => distanceToPolyline(x, z, path)));
}

/** Street, park, lake-shore and courtyard trees, plus clipped hedges along the plots and the boundary. */
export function sitePlanting(plots: readonly Plot[], seed: number): { trees: Planting[]; hedges: Planting[] } {
  const random = mulberry32(seed);
  const trees: Planting[] = [];
  const hedges: Planting[] = [];

  // Street trees in the verges, between the plots.
  for (const type of ["Villa", "Townhouse"] as const) {
    const rects = plots.filter((plot) => plot.type === type).map((plot) => shapeRect(plot.shape)).sort((a, b) => a.x0 - b.x0);
    const z = type === "Villa" ? STREET_LINES.north : STREET_LINES.south;
    const xs = [rects[0].x0 - 2, ...rects.slice(1).map((rect, index) => (rect.x0 + rects[index].x1) / 2), rects[rects.length - 1].x1 + 2];
    for (const x of xs) trees.push({ x, z, kind: "broadleaf", scale: 0.72 + random() * 0.08 });
  }
  for (let x = -88; x <= 86; x += 9) {
    if (Math.abs(x + 62) < 3.5 || Math.abs(x + 86) < 3.5 || Math.abs(x - 40) < 3.5) continue;
    trees.push({ x, z: STREET_LINES.park, kind: "broadleaf", scale: 0.78 + random() * 0.1 });
  }

  // Park groves, kept off the paths, the central lawn and the playground.
  for (let attempt = 0, placed = 0; attempt < 600 && placed < 34; attempt++) {
    const x = PARK.x0 + 2 + random() * (PARK.x1 - PARK.x0 - 4);
    const z = PARK.z0 + 2 + random() * (PARK.z1 - PARK.z0 - 4);
    const loop = Math.hypot((x - PARK_LOOP.center[0]) / PARK_LOOP.rx, (z - PARK_LOOP.center[1]) / PARK_LOOP.rz);
    if (smoothPathDistance(x, z) < 3 || loop < 1.35 || rectDistance(x, z, PLAYGROUND) < 2.5) continue;
    if (trees.some((tree) => Math.hypot(tree.x - x, tree.z - z) < 4.2)) continue;
    trees.push({ x, z, kind: pick(random, [["broadleaf", 0.62], ["conifer", 0.2], ["columnar", 0.18]]), scale: 0.75 + random() * 0.5 });
    placed++;
  }

  // Lake shore, on the far bank.
  for (let index = 0; index < 15; index++) {
    const angle = 0.12 * Math.PI + (index / 14) * 1.05 * Math.PI + (random() - 0.5) * 0.12;
    const reach = 4.5 + random() * 4;
    const x = LAKE.center[0] + Math.cos(angle) * (LAKE.rx + reach);
    const z = Math.min(61.5, LAKE.center[1] + Math.sin(angle) * (LAKE.rz + reach));
    if (x < PARK.x1 + 3) continue;
    trees.push({ x, z, kind: pick(random, [["broadleaf", 0.6], ["conifer", 0.4]]), scale: 0.8 + random() * 0.45 });
  }

  // Building A: a row of columns along the east lawn, and a small plaza grove.
  for (let z = TOWER.z0 + 2; z <= TOWER.z1 - 1; z += 5.5) trees.push({ x: 90.2, z, kind: "columnar", scale: 0.85 });
  for (let x = 71; x <= 86; x += 5) trees.push({ x, z: 13.2, kind: "broadleaf", scale: 0.62 });

  // Entrance avenue.
  for (let x = -106; x >= -150; x -= 8) {
    for (const side of [-1, 1]) trees.push({ x, z: ROAD_A + side * 6, kind: "columnar", scale: 0.92 });
  }

  // Plot hedges along the sides and backs.
  for (const plot of plots) {
    const rect = shapeRect(plot.shape);
    const back = plot.type === "Villa" ? rect.z0 + 0.5 : rect.z1 - 0.5;
    const front = plot.type === "Villa" ? rect.z1 - 1.5 : rect.z0 + 1.5;
    const row = (from: Point, to: Point) => {
      const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
      const count = Math.max(1, Math.round(length / 0.95));
      for (let step = 0; step <= count; step++) {
        const t = step / count;
        hedges.push({ x: from[0] + (to[0] - from[0]) * t, z: from[1] + (to[1] - from[1]) * t, kind: "hedge", scale: 0.95 + random() * 0.15 });
      }
    };
    row([rect.x0 + 0.5, back], [rect.x1 - 0.5, back]);
    row([rect.x0 + 0.5, back], [rect.x0 + 0.5, front]);
    row([rect.x1 - 0.5, back], [rect.x1 - 0.5, front]);
  }

  // Boundary hedge around the development, open at the gate.
  const { x0, z0, x1, z1 } = { x0: PLAN_RECT.x0 + 0.9, z0: PLAN_RECT.z0 + 0.9, x1: PLAN_RECT.x1 - 0.9, z1: PLAN_RECT.z1 - 0.9 };
  const r = PLAN_CORNER - 0.9;
  const perimeter = 2 * (x1 - x0 + z1 - z0);
  for (let s = 0; s < perimeter; s += 0.9) {
    let x: number;
    let z: number;
    if (s < x1 - x0) [x, z] = [x0 + s, z0];
    else if (s < x1 - x0 + z1 - z0) [x, z] = [x1, z0 + s - (x1 - x0)];
    else if (s < 2 * (x1 - x0) + z1 - z0) [x, z] = [x1 - (s - (x1 - x0) - (z1 - z0)), z1];
    else [x, z] = [x0, z1 - (s - 2 * (x1 - x0) - (z1 - z0))];
    // Round the corners.
    const cx = Math.min(Math.max(x, x0 + r), x1 - r);
    const cz = Math.min(Math.max(z, z0 + r), z1 - r);
    const d = Math.hypot(x - cx, z - cz);
    if (d > r) [x, z] = [cx + ((x - cx) / d) * r, cz + ((z - cz) / d) * r];
    if (x < x0 + 1 && Math.abs(z - ROAD_A) < 7.5) continue;
    hedges.push({ x, z, kind: "hedge", scale: 1.05 + random() * 0.15 });
  }

  return { trees, hedges };
}

/** Woodland around the clearing: full detail near the site, simpler trees in the haze. */
export function forestPlanting(seed: number): Planting[] {
  const random = mulberry32(seed);
  const out: Planting[] = [];
  const rings: [inner: number, outer: number, step: number][] = [[0, 330, 6.3], [330, 560, 9]];
  for (const [inner, outer, step] of rings) {
    for (let gx = -outer; gx <= outer; gx += step) {
      for (let gz = -outer; gz <= outer; gz += step) {
        const x = gx + (random() - 0.5) * step * 0.9;
        const z = gz + (random() - 0.5) * step * 0.9;
        const radius = Math.hypot(x, z);
        if (radius < inner || radius >= outer) continue;
        const edge = rectDistance(x, z, PLAN_RECT);
        if (edge < 7 || accessRoadDistance(x, z, 8) < 7.5) continue;
        const density = forestDensity(x, z);
        const stray = edge > 12 && random() < 0.01;
        if (!stray && random() > density * 1.2) continue;
        const conifer = fbm2(x * 0.01, z * 0.01, 2, 21) + (random() - 0.5) * 0.3 > 0.55;
        const far = edge > 70;
        out.push({ x, z, kind: conifer ? "conifer" : "broadleaf", far, scale: (far ? 1.35 : 1.15) + random() * 0.45 });
      }
    }
  }
  return out;
}
