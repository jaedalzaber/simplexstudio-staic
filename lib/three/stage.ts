import { Box3, Color, Mesh, NeutralToneMapping, PerspectiveCamera, Raycaster, Scene, Spherical, TOUCH, Vector2, Vector3, WebGLRenderer, type Material } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// The interactive part of an inline 3D view: renderer, orbit camera with page-friendly
// touch and wheel rules, flights, eased values, picking, projected HTML labels, and
// on-demand rendering. Each scene adds its own meshes and visuals on top.

/** Thrown when the browser cannot create a WebGL 2 context. */
export class WebGLUnavailable extends Error {}

export interface View { target: Vector3; radius: number; phi: number; theta: number }
export interface PickTarget { id: string; bounds: Box3 }

export interface StageOptions {
  container: HTMLElement;
  /** Holds one `[data-label]` element per labelled target. */
  labels: HTMLElement;
  background: string;
  reducedMotion: boolean;
  signal: AbortSignal;
  /** Camera distance and angle limits, and the box the camera target stays inside. */
  limits: { minDistance: number; maxDistance: number; minPolar: number; maxPolar: number; target: Box3 };
  far?: number;
  /** The starting view for a viewport aspect ratio. */
  overview(aspect: number): View;
  /** Where a label sits, or null to hide it. */
  anchor(id: string, out: Vector3): Vector3 | null;
  /** Camera distance at which labels show at full size; further labels shrink a little. */
  labelDistance: number;
  onPick(id: string): void;
  onHint(kind: "wheel" | "touch"): void;
  onHover(id: string | null): void;
  /** Whether a target takes clicks, which shows the pointer cursor over it. */
  pickable(id: string): boolean;
}

export interface Stage {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  /** Pickable boxes; set them before `start`. */
  targets: PickTarget[];
  /** Throws if the view was closed while the scene was being built. */
  check(): void;
  /** Eases a value towards `target`, calling `apply` each frame. */
  aim(key: string, target: number, apply: (value: number) => void): void;
  fly(view: View, duration?: number): void;
  currentView(): View;
  overview(): View;
  invalidate(): void;
  /** Compiles shaders, adds the canvas, and glides in from `intro(overview)` (instantly under reduced motion). */
  start(intro: (overview: View) => View): Promise<void>;
  refreshLabels(): void;
  zoom(direction: 1 | -1): void;
  resetView(): void;
  dispose(): void;
}

/** Yields to the browser between heavy build steps. */
export const pause = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function createStage(options: StageOptions): Stage {
  const { container, limits, signal } = options;

  // Creating the context here lets a missing WebGL fall back quietly instead of through three's error logging.
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { antialias: true, alpha: false, stencil: false });
  if (!context) throw new WebGLUnavailable("WebGL 2 is unavailable");
  const renderer = new WebGLRenderer({ canvas, context, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, matchMedia("(pointer: coarse)").matches ? 1.5 : 2));
  renderer.toneMapping = NeutralToneMapping;
  Object.assign(canvas.style, { display: "block", width: "100%", height: "100%" });

  const scene = new Scene();
  scene.background = new Color(options.background);
  const camera = new PerspectiveCamera(30, 1, 0.5, options.far ?? 400);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.55;
  controls.screenSpacePanning = false;
  controls.minDistance = limits.minDistance;
  controls.maxDistance = limits.maxDistance;
  controls.minPolarAngle = limits.minPolar;
  controls.maxPolarAngle = limits.maxPolar;
  // One finger scrolls the page; two fingers turn and zoom the view.
  controls.touches = { ONE: null, TWO: TOUCH.DOLLY_ROTATE };
  canvas.style.touchAction = "pan-y";

  const spherical = new Spherical();
  function place(view: View) {
    controls.target.copy(view.target);
    camera.position.setFromSpherical(spherical.set(view.radius, view.phi, view.theta)).add(view.target);
    camera.lookAt(view.target);
  }
  function currentView(): View {
    spherical.setFromVector3(camera.position.clone().sub(controls.target));
    return { target: controls.target.clone(), radius: spherical.radius, phi: spherical.phi, theta: spherical.theta };
  }
  const overview = () => options.overview(camera.aspect);

  let flight: { start: number; duration: number; from: View; to: View } | null = null;
  function fly(to: View, duration = 1000) {
    if (options.reducedMotion) {
      flight = null;
      place(to);
    } else {
      const from = currentView();
      const turn = ((((to.theta - from.theta + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) - Math.PI;
      flight = { start: performance.now(), duration, from, to: { ...to, theta: from.theta + turn } };
    }
    invalidate();
  }
  function stepFlight(now: number) {
    if (!flight) return false;
    const t = Math.min(1, (now - flight.start) / flight.duration);
    const k = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const { from, to } = flight;
    place({ target: from.target.clone().lerp(to.target, k), radius: lerp(from.radius, to.radius, k), phi: lerp(from.phi, to.phi, k), theta: lerp(from.theta, to.theta, k) });
    if (t >= 1) flight = null;
    return true;
  }

  const springs = new Map<string, { value: number; target: number; apply: (value: number) => void }>();
  function aim(key: string, target: number, apply: (value: number) => void) {
    const spring = springs.get(key);
    if (spring) {
      spring.target = target;
      spring.apply = apply;
    } else {
      springs.set(key, { value: target, target, apply });
      apply(target);
    }
    invalidate();
  }
  function stepSprings(dt: number) {
    const k = options.reducedMotion ? 1 : 1 - Math.exp(-dt * 10);
    let moving = false;
    for (const spring of springs.values()) {
      if (spring.value === spring.target) continue;
      spring.value += (spring.target - spring.value) * k;
      if (Math.abs(spring.target - spring.value) < 0.002) spring.value = spring.target;
      spring.apply(spring.value);
      moving = true;
    }
    return moving;
  }

  // Picking against each target's box.
  const stage = { targets: [] as PickTarget[] };
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const hit = new Vector3();
  function pickAt(clientX: number, clientY: number): string | null {
    const bounds = canvas.getBoundingClientRect();
    ndc.set(((clientX - bounds.left) / bounds.width) * 2 - 1, -((clientY - bounds.top) / bounds.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    let best = Infinity;
    let found: string | null = null;
    for (const target of stage.targets) {
      if (!raycaster.ray.intersectBox(target.bounds, hit)) continue;
      const distance = hit.distanceTo(raycaster.ray.origin);
      if (distance < best) {
        best = distance;
        found = target.id;
      }
    }
    return found;
  }

  let hover: string | null = null;
  let labels: HTMLElement[] = [];
  function setHover(id: string | null) {
    if (id === hover) return;
    hover = id;
    for (const label of labels) label.toggleAttribute("data-hover", label.dataset.label === id);
    canvas.style.cursor = id && options.pickable(id) ? "pointer" : "";
    options.onHover(id);
    invalidate();
  }

  let press: { x: number; y: number; time: number } | null = null;
  let hoverFrame = 0;
  const onPointerDown = (event: PointerEvent) => {
    press = { x: event.clientX, y: event.clientY, time: performance.now() };
    controls.enableZoom = true;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!press) return;
    const still = Math.hypot(event.clientX - press.x, event.clientY - press.y) < 7 && performance.now() - press.time < 600;
    press = null;
    if (!still || event.button !== 0) return;
    const id = pickAt(event.clientX, event.clientY);
    if (id) options.onPick(id);
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") {
      if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 14) options.onHint("touch");
      return;
    }
    if (event.buttons) return;
    cancelAnimationFrame(hoverFrame);
    hoverFrame = requestAnimationFrame(() => setHover(pickAt(event.clientX, event.clientY)));
  };
  const onPointerLeave = () => {
    cancelAnimationFrame(hoverFrame);
    setHover(null);
  };
  // Plain wheel scrolls the page; Ctrl/⌘ + wheel (and trackpad pinch) zooms the view.
  const onWheel = (event: WheelEvent) => {
    const zoom = event.ctrlKey || event.metaKey;
    controls.enableZoom = zoom;
    if (!zoom) options.onHint("wheel");
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { capture: true, passive: true });
  controls.addEventListener("start", () => (flight = null));
  controls.addEventListener("change", () => {
    // Keep the camera target inside the scene.
    const t = controls.target;
    const { min, max } = limits.target;
    const x = clamp(t.x, min.x, max.x);
    const y = clamp(t.y, min.y, max.y);
    const z = clamp(t.z, min.z, max.z);
    if (x !== t.x || y !== t.y || z !== t.z) {
      camera.position.add(new Vector3(x - t.x, y - t.y, z - t.z));
      t.set(x, y, z);
    }
    invalidate();
  });

  // Rendering happens on demand: while the camera or an eased value moves, and only when visible.
  let frame = 0;
  let last = performance.now();
  let visible = true;
  let started = false;
  let disposed = false;
  const anchor = new Vector3();

  function updateLabels() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    for (const label of labels) {
      const point = options.anchor(label.dataset.label ?? "", anchor);
      if (!point) {
        label.style.visibility = "hidden";
        continue;
      }
      const scale = clamp((width / 720) * (options.labelDistance / point.distanceTo(camera.position)), 0.7, 1);
      point.project(camera);
      const off = point.z > 1 || Math.abs(point.x) > 1.1 || Math.abs(point.y) > 1.1;
      label.style.transform = `translate3d(${(((point.x + 1) / 2) * width).toFixed(1)}px, ${(((1 - point.y) / 2) * height).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      label.style.visibility = off ? "hidden" : "";
    }
  }

  function invalidate() {
    if (frame || disposed || !visible || !started) return;
    frame = requestAnimationFrame(render);
  }

  function render(now: number) {
    frame = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    let active = stepFlight(now);
    active = stepSprings(dt) || active;
    active = controls.update() || active;
    renderer.render(scene, camera);
    updateLabels();
    if (active) invalidate();
  }

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    invalidate();
  }

  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) {
      last = performance.now();
      invalidate();
    }
  });

  function check() {
    if (signal.aborted) throw new DOMException("View closed", "AbortError");
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    cancelAnimationFrame(hoverFrame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("wheel", onWheel, { capture: true });
    controls.dispose();
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.geometry.dispose();
        const materials: Material[] = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) material.dispose();
      }
    });
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  return Object.assign(stage, {
    scene,
    camera,
    renderer,
    check,
    aim,
    fly,
    currentView,
    overview,
    invalidate,
    async start(intro: (overview: View) => View) {
      // Compile every shader before the first frame, off the main thread where the browser allows.
      await renderer.compileAsync(scene, camera);
      check();
      container.prepend(canvas);
      resizeObserver.observe(container);
      visibilityObserver.observe(container);
      started = true;
      resize();
      const view = overview();
      if (options.reducedMotion) {
        place(view);
      } else {
        place(intro(view));
        fly(view, 1800);
      }
      labels = Array.from(options.labels.querySelectorAll<HTMLElement>("[data-label]"));
      invalidate();
    },
    refreshLabels() {
      labels = Array.from(options.labels.querySelectorAll<HTMLElement>("[data-label]"));
      invalidate();
    },
    zoom(direction: 1 | -1) {
      const view = currentView();
      fly({ ...view, radius: clamp(view.radius * (direction > 0 ? 0.72 : 1 / 0.72), controls.minDistance, controls.maxDistance) }, 450);
    },
    resetView() {
      fly(overview(), 900);
    },
    dispose,
  });
}
