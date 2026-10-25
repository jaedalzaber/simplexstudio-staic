import {
  BoxGeometry,
  Color,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector2,
} from "three";
import type { PropertyStatus } from "@/content/real-estate";
import { rectCenter, type Rect } from "./layout";

export const ACCENT = new Color("#62adf3");
const STATUS_COLOR: Record<PropertyStatus, string> = { Available: "#ffffff", Reserved: "#f4b23e", Sold: "#c3cad4" };
// Pattern, not colour alone, tells reserved and sold plots apart, as in the legend.
const STATUS_PATTERN: Record<PropertyStatus, number> = { Available: 0, Reserved: 1, Sold: 2 };

const padVertex = /* glsl */ `
  varying vec2 vLocal;
  #include <fog_pars_vertex>
  void main() {
    vLocal = position.xz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const padFragment = /* glsl */ `
  uniform vec2 uSize;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uPattern;
  uniform float uHover;
  uniform float uSelected;
  uniform float uDim;
  varying vec2 vLocal;
  #include <fog_pars_fragment>
  void main() {
    vec2 q = abs(vLocal) - uSize * 0.5 + 0.8;
    float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.8;
    float aa = fwidth(sd) * 1.5;
    float inside = 1.0 - smoothstep(-aa, 0.0, sd);
    float emphasis = max(uSelected, uHover);
    float width = mix(0.26, 0.42, emphasis);
    float band = inside * smoothstep(-width - aa, -width, sd);
    float along = (q.x > q.y ? vLocal.y : vLocal.x) / 1.6;
    float w = fwidth(along) * 1.5;
    float dash = smoothstep(0.62 + w, 0.62 - w, fract(along)) * smoothstep(0.0, w, fract(along));
    float line = band * mix(dash, 1.0, emphasis);
    float stripes = step(0.5, fract((vLocal.x + vLocal.y) / 1.3));
    float dots = 1.0 - smoothstep(0.17, 0.24, length(fract(vLocal / 1.3) - 0.5));
    float pattern = uPattern > 1.5 ? stripes * 0.22 : (uPattern > 0.5 ? dots * 0.34 : 0.0);
    float glow = (1.0 - smoothstep(0.0, 2.6, -sd)) * (0.32 * uSelected + 0.18 * uHover);
    float fill = inside * max(max(pattern * (1.0 - uSelected), glow), 0.1 * uHover + 0.16 * uSelected);
    gl_FragColor = vec4(mix(uColor, uAccent, uSelected), max(line * 0.95, fill) * (1.0 - 0.85 * uDim));
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

export type Pad = Mesh<PlaneGeometry, ShaderMaterial>;

export function createPad(rect: Rect, status: PropertyStatus): Pad {
  const size = new Vector2(rect.x1 - rect.x0, rect.z1 - rect.z0);
  const geometry = new PlaneGeometry(size.x, size.y);
  geometry.rotateX(-Math.PI / 2);
  const material = new ShaderMaterial({
    uniforms: UniformsUtils.merge([
      UniformsLib.fog,
      {
        uSize: { value: size },
        uColor: { value: new Color(STATUS_COLOR[status]) },
        uAccent: { value: ACCENT.clone() },
        uPattern: { value: STATUS_PATTERN[status] },
        uHover: { value: 0 },
        uSelected: { value: 0 },
        uDim: { value: 0 },
      },
    ]),
    vertexShader: padVertex,
    fragmentShader: padFragment,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    fog: true,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  const mesh = new Mesh(geometry, material);
  const [x, z] = rectCenter(rect);
  mesh.position.set(x, 0.06, z);
  mesh.renderOrder = 2;
  return mesh;
}

/** A translucent box with bright edges, for a floor or apartment of Building A. */
export function createHighlight(opacity: number) {
  const geometry = new BoxGeometry(1, 1, 1);
  const fill = new Mesh(geometry, new MeshBasicMaterial({ color: ACCENT, transparent: true, opacity, depthWrite: false, toneMapped: false }));
  const edges = new LineSegments(new EdgesGeometry(geometry), new LineBasicMaterial({ color: ACCENT, transparent: true, opacity: Math.min(1, opacity * 3), toneMapped: false }));
  const group = new Group();
  group.add(fill, edges);
  group.visible = false;
  group.renderOrder = 3;
  return {
    group,
    show(min: [number, number, number], max: [number, number, number]) {
      group.visible = true;
      group.position.set((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
      group.scale.set(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
    },
    hide() {
      group.visible = false;
    },
  };
}
