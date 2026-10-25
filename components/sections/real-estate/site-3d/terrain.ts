import {
  BackSide,
  Color,
  DataTexture,
  LinearFilter,
  Mesh,
  PlaneGeometry,
  RGBAFormat,
  ShaderMaterial,
  ShapeGeometry,
  Shape,
  SphereGeometry,
  UniformsLib,
  UniformsUtils,
  Vector2,
  Vector4,
} from "three";
import { HAZE, LAKE, SITE_BOUNDS, SKY_COLOR, SUN, SUN_COLOR, WORLD_HALF, accessRoadLine, forestDensity, heightAt } from "./layout";
import type { SiteTextures } from "./paint";

// Ground, lake and sky. The ground is one mesh whose shader turns the painted
// masks and a forest mask into satellite-style surfaces, with baked light.

const NOISE = /* glsl */ `
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * vnoise(p);
      p = mat2(1.6, 1.2, -1.2, 1.6) * p;
      amplitude *= 0.5;
    }
    return value / 0.9375;
  }
  vec3 linear(vec3 c) { return pow(c, vec3(2.2)); }
`;

const groundVertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormalW;
  #include <fog_pars_vertex>
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const groundFragment = /* glsl */ `
  uniform sampler2D uForest;
  uniform float uWorldHalf;
  uniform sampler2D uGround;
  uniform sampler2D uHomes;
  uniform sampler2D uShade;
  uniform vec4 uSite;
  uniform float uHomesOn;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  uniform sampler2D uRoad;
  uniform vec4 uRoadBounds;
  varying vec3 vWorld;
  varying vec3 vNormalW;
  #include <fog_pars_fragment>
  ${NOISE}

  void main() {
    vec2 p = vWorld.xz;
    float broad = fbm(p * 0.012);
    float mid = vnoise(p * 0.11);
    float small = vnoise(p * 0.9);
    float fine = vnoise(p * 4.3);
    float pixel = fwidth(p.x);

    // Meadow.
    vec3 color = mix(linear(vec3(0.5, 0.58, 0.33)), linear(vec3(0.6, 0.61, 0.39)), smoothstep(0.4, 0.75, broad));
    color = mix(color, linear(vec3(0.4, 0.51, 0.28)), smoothstep(0.45, 0.8, mid * 0.6 + (1.0 - broad) * 0.4) * 0.55);
    color *= (0.88 + 0.2 * small) * (0.94 + 0.1 * fine);

    // Woodland canopy beyond the modelled trees.
    float forest = texture2D(uForest, p / (2.0 * uWorldHalf) + 0.5).r;
    float cover = smoothstep(0.32, 0.58, forest + (mid - 0.5) * 0.3);
    if (cover > 0.001) {
      vec2 g = p / 4.4;
      vec2 gi = floor(g);
      vec2 gf = fract(g);
      float best = 8.0;
      vec2 toCentre = vec2(0.0);
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 o = vec2(float(x), float(y));
          vec2 r = o + 0.15 + 0.7 * hash22(gi + o) - gf;
          float d = dot(r, r);
          if (d < best) { best = d; toCentre = r; id = hash12(gi + o + 7.0); }
        }
      }
      float rr = sqrt(best);
      float lit = clamp(0.5 - dot(toCentre, normalize(uSun.xz)) * 0.9, 0.0, 1.0);
      vec3 leaf = mix(linear(vec3(0.19, 0.31, 0.13)), linear(vec3(0.34, 0.46, 0.2)), id);
      vec3 canopy = mix(linear(vec3(0.07, 0.1, 0.06)), leaf * mix(0.5, 1.3, lit), smoothstep(1.0, 0.5, rr));
      color = mix(color, canopy, cover);
    }

    // Access road with gravel shoulders and edge lines.
    vec2 roadUv = (p - uRoadBounds.xy) / uRoadBounds.zw;
    float onRoadMap = step(0.0, roadUv.x) * step(0.0, roadUv.y) * step(roadUv.x, 1.0) * step(roadUv.y, 1.0);
    float road = mix(ROAD_REACH, texture2D(uRoad, roadUv).r * ROAD_REACH, onRoadMap);
    float aa = fwidth(road) + 0.02;
    color = mix(color, linear(vec3(0.66, 0.62, 0.54)) * (0.9 + 0.15 * small), (1.0 - smoothstep(4.4, 5.4 + aa, road)) * 0.6);
    float tarmac = 1.0 - smoothstep(3.5 - aa, 3.5 + aa, road);
    color = mix(color, linear(vec3(0.5, 0.51, 0.52)) * (0.92 + 0.1 * mid) * (0.95 + 0.07 * fine), tarmac);
    color = mix(color, linear(vec3(0.86)), (1.0 - smoothstep(0.08, 0.08 + aa, abs(road - 3.1))) * tarmac * 0.85);

    // Painted site. Sampled everywhere so mip selection stays smooth; masked outside.
    vec2 suv = (p - uSite.xy) / uSite.zw;
    float inSite = step(0.0, suv.x) * step(0.0, suv.y) * step(suv.x, 1.0) * step(suv.y, 1.0);
    vec3 surface = texture2D(uGround, suv).rgb * inSite;
    vec3 homes = texture2D(uHomes, suv).rgb * inSite;
    vec3 shade = texture2D(uShade, suv).rgb * inSite;

    vec2 tile = abs(fract(p / 0.9) - 0.5);
    float joint = smoothstep(0.43, 0.5, max(tile.x, tile.y)) * (1.0 - smoothstep(0.03, 0.12, pixel));

    float mow = smoothstep(-0.35, 0.35, sin(p.x * 1.2566));
    vec3 lawn = mix(linear(vec3(0.47, 0.6, 0.33)), linear(vec3(0.5, 0.62, 0.35)), mow) * (0.93 + 0.1 * mid) * (0.95 + 0.08 * fine);
    color = mix(color, lawn, surface.b);

    vec3 garden = mix(linear(vec3(0.48, 0.61, 0.33)), linear(vec3(0.51, 0.63, 0.35)), smoothstep(-0.35, 0.35, sin(p.y * 1.5708))) * (0.93 + 0.1 * mid);
    vec3 soil = linear(vec3(0.66, 0.57, 0.45)) * (0.86 + 0.18 * small) * (0.94 + 0.1 * fine);
    color = mix(color, mix(soil, garden, uHomesOn), shade.b);

    color = mix(color, linear(vec3(0.83, 0.82, 0.79)) * (0.95 + 0.06 * small) * (1.0 - 0.07 * joint), surface.g);
    color = mix(color, linear(vec3(0.52, 0.53, 0.54)) * (0.93 + 0.1 * mid) * (0.95 + 0.07 * fine), surface.r);
    color = mix(color, linear(vec3(0.88, 0.85, 0.8)) * (1.0 - 0.1 * joint) * (0.97 + 0.04 * fine), homes.r * uHomesOn);
    color = mix(color, linear(vec3(0.4, 0.75, 0.84)) * (0.92 + 0.12 * vnoise(p * 2.0)), homes.g * uHomesOn);
    color = mix(color, linear(vec3(0.88, 0.82, 0.68)) * (0.94 + 0.08 * fine), homes.b);

    // Baked light: sun with painted shadows, plus sky.
    float shadow = max(shade.g, shade.r * uHomesOn);
    vec3 n = normalize(vNormalW);
    vec3 light = uSunColor * max(dot(n, uSun), 0.0) * (1.0 - shadow) + uSkyColor * (0.78 + 0.22 * n.y) * (1.0 - 0.42 * shadow);
    gl_FragColor = vec4(color * light, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

function forestTexture(): DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const x = ((column + 0.5) / size - 0.5) * 2 * WORLD_HALF;
      const z = ((row + 0.5) / size - 0.5) * 2 * WORLD_HALF;
      const index = (row * size + column) * 4;
      data[index] = Math.round(forestDensity(x, z) * 255);
      data[index + 3] = 255;
    }
  }
  const map = new DataTexture(data, size, size, RGBAFormat);
  map.magFilter = LinearFilter;
  map.minFilter = LinearFilter;
  map.needsUpdate = true;
  return map;
}

// The access road as a distance field: one texture read per pixel instead of a loop over its segments.
const ROAD_REACH = 20;
const ROAD_MAP = { x0: -1000, z0: -140, x1: -80, z1: 50 };

function roadTexture(): DataTexture {
  const width = 1024;
  const height = 256;
  const { x0, z0, x1, z1 } = ROAD_MAP;
  const sx = width / (x1 - x0);
  const sz = height / (z1 - z0);
  const field = new Float32Array(width * height).fill(ROAD_REACH);
  // Visit only the pixels within reach of each segment.
  for (let index = 0; index < accessRoadLine.length - 1; index++) {
    const [ax, az] = accessRoadLine[index];
    const [bx, bz] = accessRoadLine[index + 1];
    const dx = bx - ax;
    const dz = bz - az;
    const length2 = dx * dx + dz * dz;
    const c0 = Math.max(0, Math.floor((Math.min(ax, bx) - ROAD_REACH - x0) * sx));
    const c1 = Math.min(width - 1, Math.ceil((Math.max(ax, bx) + ROAD_REACH - x0) * sx));
    const r0 = Math.max(0, Math.floor((Math.min(az, bz) - ROAD_REACH - z0) * sz));
    const r1 = Math.min(height - 1, Math.ceil((Math.max(az, bz) + ROAD_REACH - z0) * sz));
    for (let row = r0; row <= r1; row++) {
      const z = z0 + (row + 0.5) / sz;
      for (let column = c0; column <= c1; column++) {
        const x = x0 + (column + 0.5) / sx;
        const h = Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / length2));
        const distance = Math.hypot(x - ax - dx * h, z - az - dz * h);
        const slot = row * width + column;
        if (distance < field[slot]) field[slot] = distance;
      }
    }
  }
  const data = new Uint8Array(width * height * 4);
  for (let slot = 0; slot < field.length; slot++) {
    data[slot * 4] = Math.round((field[slot] / ROAD_REACH) * 255);
    data[slot * 4 + 3] = 255;
  }
  const map = new DataTexture(data, width, height, RGBAFormat);
  map.magFilter = LinearFilter;
  map.minFilter = LinearFilter;
  map.needsUpdate = true;
  return map;
}

export function createGround(textures: SiteTextures) {
  const geometry = new PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 220, 220);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.getAttribute("position");
  for (let index = 0; index < position.count; index++) position.setY(index, heightAt(position.getX(index), position.getZ(index)));
  geometry.computeVertexNormals();
  geometry.deleteAttribute("uv");

  const forest = forestTexture();
  const road = roadTexture();
  const material = new ShaderMaterial({
    defines: { ROAD_REACH: ROAD_REACH.toFixed(1) },
    uniforms: UniformsUtils.merge([
      UniformsLib.fog,
      {
        uForest: { value: null },
        uWorldHalf: { value: WORLD_HALF },
        uGround: { value: null },
        uHomes: { value: null },
        uShade: { value: null },
        uSite: { value: new Vector4(SITE_BOUNDS.x0, SITE_BOUNDS.z0, SITE_BOUNDS.x1 - SITE_BOUNDS.x0, SITE_BOUNDS.z1 - SITE_BOUNDS.z0) },
        uHomesOn: { value: 1 },
        uSun: { value: SUN.clone() },
        uSunColor: { value: SUN_COLOR.clone() },
        uSkyColor: { value: SKY_COLOR.clone() },
        uRoad: { value: null },
        uRoadBounds: { value: new Vector4(ROAD_MAP.x0, ROAD_MAP.z0, ROAD_MAP.x1 - ROAD_MAP.x0, ROAD_MAP.z1 - ROAD_MAP.z0) },
      },
    ]),
    vertexShader: groundVertex,
    fragmentShader: groundFragment,
    fog: true,
  });
  // Textures are assigned after merging; UniformsUtils clones uniform values.
  material.uniforms.uForest.value = forest;
  material.uniforms.uRoad.value = road;
  material.uniforms.uGround.value = textures.ground;
  material.uniforms.uHomes.value = textures.homes;
  material.uniforms.uShade.value = textures.shade;

  const mesh = new Mesh(geometry, material);
  mesh.renderOrder = 0;
  return {
    mesh,
    material,
    dispose() {
      forest.dispose();
      road.dispose();
    },
  };
}

const waterVertex = /* glsl */ `
  varying vec3 vWorld;
  #include <fog_pars_vertex>
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const waterFragment = /* glsl */ `
  uniform vec2 uCenter;
  uniform vec2 uRadius;
  uniform float uTime;
  uniform vec3 uSun;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  uniform vec3 uHorizon;
  uniform vec3 uZenith;
  varying vec3 vWorld;
  #include <fog_pars_fragment>
  ${NOISE}

  float waves(vec2 p) {
    return vnoise(p * 0.55 + vec2(uTime * 0.12, uTime * 0.05)) + 0.5 * vnoise(p * 1.4 - vec2(uTime * 0.08, -uTime * 0.11));
  }

  void main() {
    vec2 p = vWorld.xz;
    float edge = length((p - uCenter) / uRadius);
    float e = 0.15;
    float h = waves(p);
    vec3 n = normalize(vec3((h - waves(p + vec2(e, 0.0))) * 0.9, 1.0, (h - waves(p + vec2(0.0, e))) * 0.9));
    vec3 v = normalize(cameraPosition - vWorld);
    vec3 r = reflect(-v, n);
    float fresnel = 0.03 + 0.97 * pow(1.0 - max(dot(n, v), 0.0), 5.0);

    vec3 body = mix(linear(vec3(0.42, 0.62, 0.58)), linear(vec3(0.13, 0.29, 0.33)), smoothstep(0.98, 0.4, edge));
    vec3 color = body * (uSunColor * 0.55 + uSkyColor);
    color = mix(color, mix(uHorizon, uZenith, clamp(r.y * 1.6, 0.0, 1.0)), fresnel * 0.85);
    color += uSunColor * pow(max(dot(r, uSun), 0.0), 240.0) * 2.5;
    color = mix(color, linear(vec3(0.74, 0.78, 0.72)), smoothstep(0.94, 1.0, edge) * 0.45);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

export const ZENITH = new Color("#b7d0ea");

export function createLake() {
  const shape = new Shape();
  shape.absellipse(0, 0, LAKE.rx, LAKE.rz, 0, Math.PI * 2, false, 0);
  const geometry = new ShapeGeometry(shape, 48);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(LAKE.center[0], 0.04, LAKE.center[1]);
  const material = new ShaderMaterial({
    uniforms: UniformsUtils.merge([
      UniformsLib.fog,
      {
        uCenter: { value: new Vector2(...LAKE.center) },
        uRadius: { value: new Vector2(LAKE.rx, LAKE.rz) },
        uTime: { value: 0 },
        uSun: { value: SUN.clone() },
        uSunColor: { value: SUN_COLOR.clone() },
        uSkyColor: { value: SKY_COLOR.clone() },
        uHorizon: { value: HAZE.clone() },
        uZenith: { value: ZENITH.clone() },
      },
    ]),
    vertexShader: waterVertex,
    fragmentShader: waterFragment,
    fog: true,
  });
  const mesh = new Mesh(geometry, material);
  mesh.renderOrder = 1;
  return { mesh, material };
}

export function createSky() {
  const material = new ShaderMaterial({
    uniforms: { uHorizon: { value: HAZE.clone() }, uZenith: { value: ZENITH.clone() } },
    vertexShader: /* glsl */ `
      varying vec3 vDirection;
      void main() {
        vDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uHorizon;
      uniform vec3 uZenith;
      varying vec3 vDirection;
      void main() {
        gl_FragColor = vec4(mix(uHorizon, uZenith, smoothstep(0.02, 0.45, vDirection.y)), 1.0);
        #include <colorspace_fragment>
      }
    `,
    side: BackSide,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  });
  const mesh = new Mesh(new SphereGeometry(1500, 32, 16), material);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;
  return mesh;
}
