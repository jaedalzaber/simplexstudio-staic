import { BufferAttribute, BufferGeometry, Color, ShaderMaterial, UniformsLib, UniformsUtils } from "three";
import { SUN, bakedLight } from "./layout";

// Light baking for box-built models. Every building, car and prop is a set of
// axis-aligned boxes, so a tiny ray tracer can bake sun shadows, sky occlusion
// and ground bounce into vertex colours once, at load. Rendering is then unlit.

export type Vec3 = [x: number, y: number, z: number];
export interface Box {
  min: Vec3;
  max: Vec3;
  /** sRGB hex colour. */
  color: string;
  finish?: "solid" | "glass";
}

export interface BakedMesh {
  positions: number[];
  colors: number[];
  indices: number[];
}

interface BakeOptions {
  /** Largest cell edge in metres; smaller cells give smoother shadows. */
  cell?: number;
  /** Sky occlusion rays per vertex. */
  samples?: number;
  /** Sky occlusion reach in metres. */
  radius?: number;
}

// Each visible face: normal axis, sign. Bottom faces are never seen from above.
const FACES: readonly [axis: number, sign: number][] = [[0, 1], [0, -1], [1, 1], [2, 1], [2, -1]];
const EPS = 1e-4;
const GLASS_REFLECTION = new Color(0.085, 0.115, 0.155);

function hemisphere(count: number): Vec3[] {
  return Array.from({ length: count }, (_, index) => {
    const r = Math.sqrt((index + 0.5) / count);
    const phi = index * 2.399963;
    return [r * Math.cos(phi), Math.sqrt(Math.max(0, 1 - r * r)), r * Math.sin(phi)];
  });
}

// Three slightly spread sun rays soften the shadow edges.
const SUN_RAYS: Vec3[] = [[0, 0, 0], [0.03, -0.01, -0.025], [-0.025, 0.012, 0.03]].map(([x, y, z]) => {
  const v = [SUN.x + x, SUN.y + y, SUN.z + z];
  const length = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / length, v[1] / length, v[2] / length];
});

const safe = (value: number) => (Math.abs(value) < 1e-6 ? 1e-6 : value);

/** Nearest hit distance along a ray, or `maxT` when nothing is hit. Boxes that contain the origin are ignored. */
function trace(o: Vec3, d: Vec3, maxT: number, bounds: Float64Array, list: Int32Array, count: number, ground: boolean): number {
  const ix = 1 / safe(d[0]);
  const iy = 1 / safe(d[1]);
  const iz = 1 / safe(d[2]);
  let best = maxT;
  if (ground && d[1] < 0) best = Math.min(best, -o[1] / d[1]);
  for (let n = 0; n < count; n++) {
    const k = list[n] * 6;
    let t0 = (bounds[k] - o[0]) * ix;
    let t1 = (bounds[k + 3] - o[0]) * ix;
    let near = Math.min(t0, t1);
    let far = Math.max(t0, t1);
    t0 = (bounds[k + 1] - o[1]) * iy;
    t1 = (bounds[k + 4] - o[1]) * iy;
    near = Math.max(near, Math.min(t0, t1));
    far = Math.min(far, Math.max(t0, t1));
    t0 = (bounds[k + 2] - o[2]) * iz;
    t1 = (bounds[k + 5] - o[2]) * iz;
    near = Math.max(near, Math.min(t0, t1));
    far = Math.min(far, Math.max(t0, t1));
    if (near >= 0 && far >= near && near < best) best = near;
  }
  return best;
}

/** Grid lines along one face axis: the face edges, the edges of boxes crossing the face, then even steps. */
function splits(lo: number, hi: number, axis: number, bounds: Float64Array, list: readonly number[], cell: number): number[] {
  const marks = [lo, hi];
  for (const n of list) {
    for (const value of [bounds[n * 6 + axis], bounds[n * 6 + 3 + axis]]) {
      if (value > lo + EPS && value < hi - EPS) marks.push(value);
    }
  }
  marks.sort((a, b) => a - b);
  const out = [lo];
  for (let index = 1; index < marks.length; index++) {
    const start = out[out.length - 1];
    const end = marks[index];
    if (end - start < EPS) continue;
    const steps = Math.ceil((end - start) / cell);
    for (let step = 1; step <= steps; step++) out.push(start + ((end - start) * step) / steps);
  }
  return out;
}

export function bakeBoxes(boxes: readonly Box[], options: BakeOptions = {}): BakedMesh {
  const cell = options.cell ?? 0.6;
  const radius = options.radius ?? 3.5;
  const sky = hemisphere(options.samples ?? 18);
  const count = boxes.length;
  const bounds = new Float64Array(count * 6);
  boxes.forEach((box, index) => bounds.set([...box.min, ...box.max], index * 6));
  const all = Int32Array.from({ length: count }, (_, index) => index);
  const near = new Int32Array(count);
  const albedo = new Color();
  const light = new Color();
  const out: BakedMesh = { positions: [], colors: [], indices: [] };

  const inside = (x: number, y: number, z: number, skip: number) => {
    for (let n = 0; n < count; n++) {
      if (n === skip) continue;
      const k = n * 6;
      if (x > bounds[k] + EPS && x < bounds[k + 3] - EPS && y > bounds[k + 1] + EPS && y < bounds[k + 4] - EPS && z > bounds[k + 2] + EPS && z < bounds[k + 5] - EPS) return true;
    }
    return false;
  };

  boxes.forEach((box, boxIndex) => {
    albedo.set(box.color);
    const glass = box.finish === "glass";
    for (const [axis, sign] of FACES) {
      const u = axis === 0 ? 2 : 0;
      const v = axis === 1 ? 2 : 1;
      const plane = sign > 0 ? box.max[axis] : box.min[axis];
      const normal: Vec3 = [0, 0, 0];
      normal[axis] = sign;

      // Boxes within sky-occlusion reach of this face.
      let nearCount = 0;
      for (let n = 0; n < count; n++) {
        const k = n * 6;
        let overlaps = true;
        for (let a = 0; a < 3; a++) {
          const lo = a === axis ? plane : box.min[a];
          const hi = a === axis ? plane : box.max[a];
          if (bounds[k + a] > hi + radius || bounds[k + 3 + a] < lo - radius) overlaps = false;
        }
        if (overlaps) near[nearCount++] = n;
      }

      // Only boxes that meet this face can hide part of it.
      const crossing: number[] = [];
      for (let n = 0; n < count; n++) {
        const k = n * 6;
        if (n === boxIndex || bounds[k + axis] > plane + EPS || bounds[k + 3 + axis] < plane - EPS) continue;
        if (bounds[k + u] >= box.max[u] || bounds[k + 3 + u] <= box.min[u] || bounds[k + v] >= box.max[v] || bounds[k + 3 + v] <= box.min[v]) continue;
        crossing.push(n);
      }
      const us = splits(box.min[u], box.max[u], u, bounds, crossing, cell);
      const vs = splits(box.min[v], box.max[v], v, bounds, crossing, cell);
      const grid = new Int32Array(us.length * vs.length).fill(-1);

      const vertex = (i: number, j: number) => {
        const slot = j * us.length + i;
        if (grid[slot] >= 0) return grid[slot];
        const p: Vec3 = [0, 0, 0];
        p[axis] = plane;
        p[u] = us[i];
        p[v] = vs[j];
        const o: Vec3 = [p[0] + normal[0] * 0.02, p[1] + normal[1] * 0.02, p[2] + normal[2] * 0.02];

        let occlusion = 0;
        for (const s of sky) {
          const d: Vec3 = [0, 0, 0];
          d[axis] = sign * s[1];
          d[u] = s[0];
          d[v] = s[2];
          const t = trace(o, d, radius, bounds, near, nearCount, true);
          if (t < radius) occlusion += 1 - t / radius;
        }
        const ao = 1 - occlusion / sky.length;
        let sun = 0;
        const facing = Math.max(0, normal[0] * SUN.x + normal[1] * SUN.y + normal[2] * SUN.z);
        if (facing > 0) for (const ray of SUN_RAYS) if (trace(o, ray, 400, bounds, all, count, false) >= 400) sun += 1 / SUN_RAYS.length;

        const up = normal[1];
        bakedLight(light, facing * sun, ao * (0.62 + 0.38 * up), ao * (up > 0.5 ? 0 : 1));
        let r = albedo.r * light.r;
        let g = albedo.g * light.g;
        let b = albedo.b * light.b;
        if (glass) {
          const reflect = (0.5 + 0.5 * ao) * (up > 0.5 ? 1.25 : 1) + facing * sun * 0.5;
          r = r * 0.6 + GLASS_REFLECTION.r * reflect;
          g = g * 0.6 + GLASS_REFLECTION.g * reflect;
          b = b * 0.6 + GLASS_REFLECTION.b * reflect;
        }

        const index = out.positions.length / 3;
        out.positions.push(p[0], p[1], p[2]);
        out.colors.push(r, g, b);
        grid[slot] = index;
        return index;
      };

      // u × v points along +z for z faces and against the axis otherwise; wind triangles to face the normal.
      const flip = (axis === 2 ? 1 : -1) * sign < 0;
      for (let j = 0; j < vs.length - 1; j++) {
        for (let i = 0; i < us.length - 1; i++) {
          const c: Vec3 = [0, 0, 0];
          c[axis] = plane + sign * 0.003;
          c[u] = (us[i] + us[i + 1]) / 2;
          c[v] = (vs[j] + vs[j + 1]) / 2;
          if (inside(c[0], c[1], c[2], boxIndex)) continue;
          const a = vertex(i, j);
          const b = vertex(i + 1, j);
          const d = vertex(i + 1, j + 1);
          const e = vertex(i, j + 1);
          if (flip) out.indices.push(a, e, d, a, d, b);
          else out.indices.push(a, b, d, a, d, e);
        }
      }
    }
  });
  return out;
}

export function bakedGeometry(parts: readonly BakedMesh[]): BufferGeometry {
  const vertexCount = parts.reduce((sum, part) => sum + part.positions.length, 0);
  const positions = new Float32Array(vertexCount);
  const colors = new Float32Array(vertexCount);
  const indices: number[] = [];
  let offset = 0;
  for (const part of parts) {
    positions.set(part.positions, offset);
    colors.set(part.colors, offset);
    for (const index of part.indices) indices.push(index + offset / 3);
    offset += part.positions.length;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("baked", new BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

const vertexShader = /* glsl */ `
  attribute vec3 baked;
  varying vec3 vBaked;
  #include <fog_pars_vertex>
  void main() {
    vBaked = baked;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uTint;
  uniform float uHighlight;
  uniform float uDim;
  varying vec3 vBaked;
  #include <fog_pars_fragment>
  void main() {
    vec3 color = vBaked;
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(color, vec3(luma) * 0.75 + 0.28, uDim * 0.82);
    color = mix(color, color * uTint + uTint * 0.05, uHighlight);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

export function createBakedMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: UniformsUtils.merge([
      UniformsLib.fog,
      { uTint: { value: new Color(0.92, 0.98, 1.12) }, uHighlight: { value: 0 }, uDim: { value: 0 } },
    ]),
    vertexShader,
    fragmentShader,
    fog: true,
  });
}
