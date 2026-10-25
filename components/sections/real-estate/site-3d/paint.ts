import { DataTexture, LinearFilter, LinearMipmapLinearFilter, RGBAFormat, UnsignedByteType } from "three";
import type { Box } from "@/lib/three/bake";
import {
  LAKE,
  PARK_LOOP,
  PARK_PATHS,
  PARKING,
  PLAN_CORNER,
  PLAN_RECT,
  PLAYGROUND,
  ROAD_A,
  SHADOW_STEP,
  SITE_BOUNDS,
  SITE_ROADS,
  SUN,
  TOWER,
  TURNING_CIRCLE,
  type Point,
  type Rect,
} from "./layout";
import type { HomeModel } from "./models";
import { CANOPY, type Planting } from "./vegetation";

// The site is painted as material masks, not colours: the ground shader turns
// each mask into textured asphalt, paving, lawn, water or soil and lights it.
//   ground: R asphalt, G concrete, B lawn (painted in order, so they never overlap)
//   homes:  R home paving, G pools, B sand
//   shade:  R home shadows, G other shadows, B plot yards

const GROUND_RES = 5;
const DETAIL_RES = 3;

const width = (res: number) => Math.round((SITE_BOUNDS.x1 - SITE_BOUNDS.x0) * res);
const height = (res: number) => Math.round((SITE_BOUNDS.z1 - SITE_BOUNDS.z0) * res);

function canvas(res: number) {
  const element = document.createElement("canvas");
  element.width = width(res);
  element.height = height(res);
  const context = element.getContext("2d", { willReadFrequently: true })!;
  context.setTransform(res, 0, 0, res, -SITE_BOUNDS.x0 * res, -SITE_BOUNDS.z0 * res);
  context.fillStyle = "#000";
  context.fillRect(SITE_BOUNDS.x0, SITE_BOUNDS.z0, SITE_BOUNDS.x1 - SITE_BOUNDS.x0, SITE_BOUNDS.z1 - SITE_BOUNDS.z0);
  return context;
}

function texture(res: number, data: Uint8Array) {
  const map = new DataTexture(data, width(res), height(res), RGBAFormat, UnsignedByteType);
  map.generateMipmaps = true;
  map.minFilter = LinearMipmapLinearFilter;
  map.magFilter = LinearFilter;
  map.anisotropy = 8;
  map.needsUpdate = true;
  return map;
}

const fillRect = (context: CanvasRenderingContext2D, rect: Rect) => context.fillRect(rect.x0, rect.z0, rect.x1 - rect.x0, rect.z1 - rect.z0);

function roundRect(context: CanvasRenderingContext2D, rect: Rect, radius: number) {
  context.beginPath();
  context.roundRect(rect.x0, rect.z0, rect.x1 - rect.x0, rect.z1 - rect.z0, radius);
  context.fill();
}

function smoothPath(context: CanvasRenderingContext2D, points: readonly Point[]) {
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length - 1; index++) {
    const [x, z] = points[index];
    const [nx, nz] = points[index + 1];
    context.quadraticCurveTo(x, z, (x + nx) / 2, (z + nz) / 2);
  }
  const [lx, lz] = points[points.length - 1];
  context.lineTo(lx, lz);
  context.stroke();
}

function polyline(context: CanvasRenderingContext2D, points: readonly Point[]) {
  context.beginPath();
  points.forEach(([x, z], index) => (index ? context.lineTo(x, z) : context.moveTo(x, z)));
  context.stroke();
}

function paintGround(): Uint8Array {
  const context = canvas(GROUND_RES);
  const ASPHALT = "#f00";
  const CONCRETE = "#0f0";
  const LAWN = "#00f";

  context.fillStyle = LAWN;
  roundRect(context, PLAN_RECT, PLAN_CORNER);

  // Building A sits on a paved plaza with a planted strip and a car park.
  context.fillStyle = CONCRETE;
  fillRect(context, { x0: 65.5, z0: -51, x1: 91.5, z1: 15 });
  context.fillStyle = LAWN;
  fillRect(context, { x0: 88.6, z0: TOWER.z0, x1: 91.5, z1: TOWER.z1 });
  fillRect(context, { x0: 66.4, z0: 11.6, x1: 88.6, z1: 14.8 });

  context.lineJoin = "round";
  context.lineCap = "butt";
  context.strokeStyle = CONCRETE;
  for (const road of SITE_ROADS) {
    if (!road.walk) continue;
    context.lineWidth = road.width + road.walk * 2;
    polyline(context, road.points);
  }
  context.fillStyle = CONCRETE;
  context.beginPath();
  context.arc(TURNING_CIRCLE.center[0], TURNING_CIRCLE.center[1], TURNING_CIRCLE.radius + 2, 0, Math.PI * 2);
  context.fill();

  // Park paths, the loop and its little plaza.
  context.lineCap = "round";
  context.lineWidth = 2.2;
  for (const path of PARK_PATHS) smoothPath(context, path);
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(PARK_LOOP.center[0], PARK_LOOP.center[1], PARK_LOOP.rx, PARK_LOOP.rz, 0, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(PARK_LOOP.center[0], PARK_LOOP.center[1], 3.4, 0, Math.PI * 2);
  context.fill();
  // Gate apron.
  fillRect(context, { x0: -111, z0: -28, x1: -100, z1: ROAD_A - 3.75 });

  context.strokeStyle = ASPHALT;
  context.fillStyle = ASPHALT;
  context.lineCap = "butt";
  for (const road of SITE_ROADS) {
    context.lineWidth = road.width;
    polyline(context, road.points);
  }
  context.beginPath();
  context.arc(TURNING_CIRCLE.center[0], TURNING_CIRCLE.center[1], TURNING_CIRCLE.radius, 0, Math.PI * 2);
  context.fill();
  fillRect(context, PARKING);
  fillRect(context, { x0: 63, z0: -48, x1: 66.2, z1: -42.5 });

  // Markings read as paving over asphalt.
  context.strokeStyle = CONCRETE;
  context.lineWidth = 0.15;
  context.setLineDash([3, 4.5]);
  for (const road of SITE_ROADS.filter((item) => item.centreLine)) polyline(context, road.points);
  context.setLineDash([]);
  context.lineWidth = 0.12;
  for (let stall = 0; stall <= 10; stall++) {
    const x = PARKING.x0 + stall * 2.5;
    polyline(context, [[x, PARKING.z0], [x, PARKING.z0 + 5.2]]);
  }
  context.fillStyle = CONCRETE;
  for (const crossing of [-97, 54]) {
    for (let stripe = 0; stripe < 7; stripe++) context.fillRect(crossing - 1.6, ROAD_A - 3.4 + stripe * 1.05, 3.2, 0.5);
  }

  return new Uint8Array(context.getImageData(0, 0, width(GROUND_RES), height(GROUND_RES)).data.buffer);
}

/** Convex hull, for the ground shadow of a box. */
function hull(points: Point[]): Point[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Point, a: Point, b: Point) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Point[] = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper: Point[] = [];
  for (const point of [...sorted].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function boxShadows(contact: CanvasRenderingContext2D, cast: CanvasRenderingContext2D, boxes: readonly Box[]) {
  contact.fillStyle = "rgba(255,255,255,0.32)";
  cast.fillStyle = "#fff";
  for (const box of boxes) {
    if (box.min[1] < 0.05) contact.fillRect(box.min[0] - 0.7, box.min[2] - 0.7, box.max[0] - box.min[0] + 1.4, box.max[2] - box.min[2] + 1.4);
    const corners: Point[] = [];
    for (const x of [box.min[0], box.max[0]]) {
      for (const z of [box.min[2], box.max[2]]) {
        for (const y of [box.min[1], box.max[1]]) corners.push([x + SHADOW_STEP[0] * y, z + SHADOW_STEP[1] * y]);
      }
    }
    cast.beginPath();
    hull(corners).forEach(([x, z], index) => (index ? cast.lineTo(x, z) : cast.moveTo(x, z)));
    cast.closePath();
    cast.fill();
  }
}

function treeShadows(cast: CanvasRenderingContext2D, plantings: readonly Planting[]) {
  const angle = Math.atan2(SHADOW_STEP[1], SHADOW_STEP[0]);
  for (const tree of plantings) {
    const canopy = CANOPY[tree.kind];
    const lift = canopy.height * tree.scale;
    const radius = canopy.radius * tree.scale;
    cast.fillStyle = `rgba(255,255,255,${canopy.strength})`;
    cast.beginPath();
    cast.ellipse(tree.x + SHADOW_STEP[0] * lift, tree.z + SHADOW_STEP[1] * lift, radius / SUN.y, radius, angle, 0, Math.PI * 2);
    cast.fill();
  }
}

/** Shadow amount for a set of boxes and trees: shapes are drawn sharp, then each layer is softened once. */
function shadowLayer(boxes: readonly Box[], plantings: readonly Planting[]) {
  const contact = canvas(DETAIL_RES);
  const cast = canvas(DETAIL_RES);
  contact.globalCompositeOperation = "lighten";
  cast.globalCompositeOperation = "lighten";
  boxShadows(contact, cast, boxes);
  treeShadows(cast, plantings);
  const out = canvas(DETAIL_RES);
  out.setTransform(1, 0, 0, 1, 0, 0);
  out.globalCompositeOperation = "lighten";
  out.filter = "blur(4px)";
  out.drawImage(contact.canvas, 0, 0);
  out.filter = "blur(0.6px)";
  out.drawImage(cast.canvas, 0, 0);
  return channel(out);
}

function inSite(tree: Planting) {
  return tree.x > SITE_BOUNDS.x0 - 10 && tree.x < SITE_BOUNDS.x1 + 10 && tree.z > SITE_BOUNDS.z0 - 10 && tree.z < SITE_BOUNDS.z1 + 10;
}

function channel(context: CanvasRenderingContext2D) {
  return context.getImageData(0, 0, context.canvas.width, context.canvas.height).data;
}

export interface SiteTextures {
  ground: DataTexture;
  homes: DataTexture;
  shade: DataTexture;
  /** Repaints the home layers after a home is customised. */
  repaintHomes(homes: readonly HomeModel[]): void;
  dispose(): void;
}

export function paintSite(options: { homes: readonly HomeModel[]; yards: readonly Rect[]; staticBoxes: readonly Box[]; plantings: readonly Planting[]; homePlantings: () => readonly Planting[] }): SiteTextures {
  const ground = texture(GROUND_RES, paintGround());

  const staticData = shadowLayer(options.staticBoxes, options.plantings.filter(inSite));

  const yards = canvas(DETAIL_RES);
  yards.fillStyle = "#fff";
  for (const yard of options.yards) fillRect(yards, yard);
  const yardData = channel(yards);

  const size = width(DETAIL_RES) * height(DETAIL_RES) * 4;
  const homes = texture(DETAIL_RES, new Uint8Array(size));
  const shade = texture(DETAIL_RES, new Uint8Array(size));

  function repaintHomes(models: readonly HomeModel[]) {
    const layer = canvas(DETAIL_RES);
    // Lake shore and playground sand.
    layer.fillStyle = "#00f";
    layer.beginPath();
    layer.ellipse(LAKE.center[0], LAKE.center[1], LAKE.rx + 2.4, LAKE.rz + 2.4, 0, 0, Math.PI * 2);
    layer.fill();
    roundRect(layer, PLAYGROUND, 1.5);
    layer.fillStyle = "#f00";
    for (const model of models) for (const rect of model.paving) fillRect(layer, rect);
    layer.fillStyle = "#0f0";
    for (const model of models) for (const rect of model.pools) roundRect(layer, rect, 0.35);
    (homes.image.data as Uint8Array).set(channel(layer));
    homes.needsUpdate = true;

    const castData = shadowLayer(models.flatMap((model) => model.boxes), options.homePlantings());
    const data = shade.image.data as Uint8Array;
    for (let index = 0; index < size; index += 4) {
      data[index] = castData[index];
      data[index + 1] = staticData[index];
      data[index + 2] = yardData[index];
      data[index + 3] = 255;
    }
    shade.needsUpdate = true;
  }

  repaintHomes(options.homes);

  return {
    ground,
    homes,
    shade,
    repaintHomes,
    dispose() {
      ground.dispose();
      homes.dispose();
      shade.dispose();
    },
  };
}
