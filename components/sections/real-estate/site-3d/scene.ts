import {
  Box3,
  BufferGeometry,
  Fog,
  Group,
  InstancedMesh,
  LineSegments,
  Mesh,
  NeutralToneMapping,
  PerspectiveCamera,
  Raycaster,
  Scene,
  ShaderMaterial,
  Spherical,
  TOUCH,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { HomeConfig, Plot, Unit } from "@/content/real-estate";
import { bakeBoxes, bakedGeometry, createBakedMaterial } from "@/lib/three/bake";
import { HAZE, SITE_LIGHTING, TOWER, rectCenter, shapeRect, type Rect } from "./layout";
import { buildHome, buildProps, buildTower, type HomeModel } from "./models";
import { mulberry32 } from "@/lib/three/noise";
import { createHighlight, createPad, type Pad } from "./overlays";
import { paintSite } from "./paint";
import { createGround, createLake, createSky } from "./terrain";
import type { PickTarget, SiteSelection, SiteState } from "./types";
import { disposePlanting, forestPlanting, plant, sitePlanting } from "./vegetation";

export interface SiteSceneOptions {
  container: HTMLElement;
  /** Holds one `[data-label]` element per plot id, plus `building`. */
  labels: HTMLElement;
  plots: readonly Plot[];
  building: { floors: number; shape: { x: number; y: number; width: number; height: number } };
  units: readonly Unit[];
  state: SiteState;
  reducedMotion: boolean;
  signal: AbortSignal;
  onPick(target: PickTarget): void;
  onHint(kind: "wheel" | "touch"): void;
}

/** Thrown when the browser cannot create a WebGL 2 context. */
export class WebGLUnavailable extends Error {}

export interface SiteScene {
  update(state: SiteState): void;
  zoom(direction: 1 | -1): void;
  resetView(): void;
  dispose(): void;
}

interface Home {
  plot: Plot;
  index: number;
  rect: Rect;
  config: HomeConfig;
  model: HomeModel;
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  pad: Pad;
}

interface View { target: Vector3; radius: number; phi: number; theta: number }

const pause = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sameConfig = (a: HomeConfig, b: HomeConfig) => a.design === b.design && a.finish === b.finish && a.pool === b.pool && a.solar === b.solar;
const selectionKey = (selection: SiteSelection) => (!selection ? "" : selection.kind === "plot" ? `plot:${selection.id}` : `building:${selection.floor ?? ""}:${selection.unit ?? ""}`);
const pickKey = (target: PickTarget | null) => (target ? JSON.stringify(target) : "");
const bakeHome = (model: HomeModel) => bakedGeometry([bakeBoxes(model.boxes, { lighting: SITE_LIGHTING, cell: 0.75, samples: 12 })]);

export async function createSiteScene(options: SiteSceneOptions): Promise<SiteScene> {
  const { container, plots, units, signal } = options;
  const check = () => {
    if (signal.aborted) throw new DOMException("Site view closed", "AbortError");
  };

  // Creating the context here lets a missing WebGL fall back quietly instead of through three's error logging.
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { antialias: true, alpha: false, stencil: false });
  if (!context) throw new WebGLUnavailable("WebGL 2 is unavailable");
  const renderer = new WebGLRenderer({ canvas, context, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, matchMedia("(pointer: coarse)").matches ? 1.5 : 2));
  renderer.toneMapping = NeutralToneMapping;
  Object.assign(canvas.style, { display: "block", width: "100%", height: "100%" });

  const scene = new Scene();
  scene.background = HAZE.clone();
  scene.fog = new Fog(HAZE.clone(), 170, 760);
  const camera = new PerspectiveCamera(30, 1, 1, 2400);
  const cleanup: (() => void)[] = [];

  function disposeAll() {
    for (const task of cleanup) task();
    scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof LineSegments) {
        object.geometry.dispose();
        const materials: Material[] = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) material.dispose();
      }
      if (object instanceof InstancedMesh) object.dispose();
    });
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  try {
    // Homes: one baked mesh per plot, so each can be highlighted, dimmed or rebuilt.
    const homes: Home[] = [];
    const homeGroup = new Group();
    for (const [index, plot] of plots.entries()) {
      const config = options.state.configs[plot.id];
      const model = buildHome(plot, index, config);
      const rect = shapeRect(plot.shape);
      const home: Home = { plot, index, rect, config, model, mesh: new Mesh(bakeHome(model), createBakedMaterial()), pad: createPad(rect, plot.status) };
      homes.push(home);
      homeGroup.add(home.mesh);
      scene.add(home.pad);
      if (index % 3 === 2) {
        await pause();
        check();
      }
    }
    const homeById = new Map(homes.map((home) => [home.plot.id, home]));

    const floors = options.building.floors;
    const towerTop = floors * TOWER.floorHeight;
    const towerBoxes = buildTower(floors);
    const tower = new Mesh(bakedGeometry([bakeBoxes(towerBoxes, { lighting: SITE_LIGHTING, cell: 1.5, samples: 10, radius: 4 })]), createBakedMaterial());
    const buildingRect = shapeRect(options.building.shape);
    const buildingPad = createPad(buildingRect, "Available");
    const propBoxes = buildProps(mulberry32(5));
    const props = new Mesh(bakedGeometry([bakeBoxes(propBoxes, { lighting: SITE_LIGHTING, cell: 0.7, samples: 10 })]), createBakedMaterial());
    scene.add(tower, buildingPad, props);
    await pause();
    check();

    const site = sitePlanting(plots, 7);
    const staticPlanting = [...site.trees, ...site.hedges, ...forestPlanting(13)];
    await pause();
    check();
    scene.add(plant(staticPlanting, 21));
    const homePlanting = () => homes.flatMap((home) => home.model.trees);
    let homeTrees = plant(homePlanting(), 22);
    homeGroup.add(homeTrees);
    scene.add(homeGroup);
    await pause();
    check();

    const textures = paintSite({ homes: homes.map((home) => home.model), yards: homes.map((home) => home.rect), staticBoxes: [...towerBoxes, ...propBoxes], plantings: staticPlanting, homePlantings: homePlanting });
    cleanup.push(() => textures.dispose());
    await pause();
    check();
    const ground = createGround(textures);
    cleanup.push(ground.dispose);
    const lake = createLake();
    const sky = createSky();
    scene.add(ground.mesh, lake.mesh, sky);
    const selectedBox = createHighlight(0.3);
    const hoverBox = createHighlight(0.13);
    scene.add(selectedBox.group, hoverBox.group);
    // Compile every shader before the first frame, off the main thread where the browser allows.
    await renderer.compileAsync(scene, camera);
    check();

    // Camera.
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.55;
    controls.screenSpacePanning = false;
    controls.minDistance = 30;
    controls.maxDistance = 380;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = 1.2;
    // One finger scrolls the page; two fingers turn and zoom the plan.
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
    const overview = (): View => ({
      target: new Vector3(0, 0, 4),
      radius: camera.aspect < 0.9 ? 430 : camera.aspect < 1.35 ? 350 : 300,
      phi: 0.95,
      theta: 0.52,
    });

    let flight: { start: number; duration: number; from: View; to: View } | null = null;
    function fly(to: View, duration = 1100) {
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

    function flyToSelection(selection: SiteSelection) {
      const { theta } = currentView();
      if (!selection) return fly(overview());
      if (selection.kind === "plot") {
        const home = homeById.get(selection.id);
        if (!home) return;
        const [x, z] = rectCenter(home.rect);
        return fly({ target: new Vector3(x, 2, z), radius: 78, phi: 0.9, theta });
      }
      const cx = (TOWER.x0 + TOWER.x1) / 2;
      const cz = (TOWER.z0 + TOWER.z1) / 2;
      if (!selection.floor) return fly({ target: new Vector3(cx, 9, cz), radius: 112, phi: 1, theta });
      fly({ target: new Vector3(cx, (selection.floor - 0.5) * TOWER.floorHeight, cz), radius: selection.unit ? 78 : 92, phi: 1.04, theta });
    }

    // Eased values for highlights, dimming and the homes toggle.
    const springs = new Map<string, { value: number; target: number; apply: (value: number) => void }>();
    function aim(key: string, target: number, apply: (value: number) => void, from?: number) {
      const spring = springs.get(key);
      if (spring && from === undefined) {
        spring.target = target;
        spring.apply = apply;
      } else {
        const start = from ?? target;
        springs.set(key, { value: start, target, apply });
        apply(start);
      }
    }
    function stepSprings(dt: number) {
      const k = options.reducedMotion ? 1 : 1 - Math.exp(-dt * 9);
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

    const unitsByFloor = new Map<number, string[]>();
    for (const unit of units) unitsByFloor.set(unit.floor, [...(unitsByFloor.get(unit.floor) ?? []), unit.id].sort());
    function floorBox(floor: number, unit: string | null): [[number, number, number], [number, number, number]] {
      const g = TOWER.floorHeight;
      let z0 = TOWER.z0 - 0.25;
      let z1 = TOWER.z1 + 0.25;
      const list = unitsByFloor.get(floor) ?? [];
      if (unit && list.includes(unit)) {
        const length = (TOWER.z1 - TOWER.z0) / list.length;
        z0 = TOWER.z0 + list.indexOf(unit) * length;
        z1 = z0 + length;
      }
      return [[TOWER.x0 - 0.3, (floor - 1) * g + 0.03, z0], [TOWER.x1 + 0.3, floor * g - 0.03, z1]];
    }

    let state = options.state;
    let hover: PickTarget | null = null;
    let labels: HTMLElement[] = [];

    function applyVisuals() {
      const shown = new Set(state.shownPlots);
      const selection = state.selection;
      for (const home of homes) {
        const id = home.plot.id;
        const selected = selection?.kind === "plot" && selection.id === id;
        const hovered = hover?.kind === "plot" && hover.id === id;
        aim(`${id}:highlight`, selected ? 1 : hovered ? 0.5 : 0, (v) => (home.mesh.material.uniforms.uHighlight.value = v));
        aim(`${id}:dim`, shown.has(id) ? 0 : 1, (v) => {
          home.mesh.material.uniforms.uDim.value = v;
          home.pad.material.uniforms.uDim.value = v;
        });
        aim(`${id}:selected`, selected ? 1 : 0, (v) => (home.pad.material.uniforms.uSelected.value = v));
        aim(`${id}:hover`, hovered && !selected ? 1 : 0, (v) => (home.pad.material.uniforms.uHover.value = v));
      }
      const buildingSelected = selection?.kind === "building";
      const buildingHovered = hover !== null && hover.kind !== "plot";
      aim("building:highlight", buildingSelected ? 0.55 : buildingHovered ? 0.4 : 0, (v) => (tower.material.uniforms.uHighlight.value = v));
      aim("building:dim", state.buildingShown ? 0 : 1, (v) => {
        tower.material.uniforms.uDim.value = v;
        buildingPad.material.uniforms.uDim.value = v;
      });
      aim("building:selected", buildingSelected ? 1 : 0, (v) => (buildingPad.material.uniforms.uSelected.value = v));
      aim("building:hover", buildingHovered && !buildingSelected ? 1 : 0, (v) => (buildingPad.material.uniforms.uHover.value = v));
      aim("homes", state.homes ? 1 : 0, (v) => {
        ground.material.uniforms.uHomesOn.value = v;
        homeGroup.scale.y = Math.max(v, 0.001);
        homeGroup.visible = v > 0.002;
      });

      if (selection?.kind === "building" && selection.floor) selectedBox.show(...floorBox(selection.floor, selection.unit));
      else selectedBox.hide();
      if (selection?.kind === "building" && hover && (hover.kind === "floor" || hover.kind === "unit")) hoverBox.show(...floorBox(hover.floor, hover.kind === "unit" ? hover.unit : null));
      else hoverBox.hide();

      const hoveredLabel = hover?.kind === "plot" ? hover.id : hover ? "building" : null;
      for (const label of labels) label.toggleAttribute("data-hover", label.dataset.label === hoveredLabel);
      canvas.style.cursor = hover ? "pointer" : "";
      invalidate();
    }

    function applyConfigs(configs: SiteState["configs"]) {
      let changed = false;
      for (const home of homes) {
        const next = configs[home.plot.id];
        if (!next || sameConfig(next, home.config)) continue;
        home.config = next;
        home.model = buildHome(home.plot, home.index, next);
        const previous = home.mesh.geometry;
        home.mesh.geometry = bakeHome(home.model);
        previous.dispose();
        aim(`${home.plot.id}:grow`, 1, (v) => (home.mesh.scale.y = v), 0.55);
        changed = true;
      }
      if (!changed) return;
      textures.repaintHomes(homes.map((home) => home.model));
      homeGroup.remove(homeTrees);
      disposePlanting(homeTrees);
      homeTrees = plant(homePlanting(), 22);
      homeGroup.add(homeTrees);
    }

    // Picking against simple boxes: plot ground, home bounds, and Building A.
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    const hit = new Vector3();
    const plotBox = new Box3();
    const towerBox = new Box3(new Vector3(TOWER.x0, 0, TOWER.z0), new Vector3(TOWER.x1, towerTop + 1, TOWER.z1));
    const buildingGround = new Box3(new Vector3(buildingRect.x0, 0, buildingRect.z0), new Vector3(buildingRect.x1, 0.4, buildingRect.z1));

    function towerTarget(point: Vector3): PickTarget {
      const selection = state.selection;
      if (selection?.kind !== "building") return { kind: "building" };
      const floor = clamp(Math.floor(point.y / TOWER.floorHeight) + 1, 1, floors);
      const list = unitsByFloor.get(floor) ?? [];
      if (selection.floor !== floor || !list.length) return { kind: "floor", floor };
      const slot = clamp(Math.floor(((point.z - TOWER.z0) / (TOWER.z1 - TOWER.z0)) * list.length), 0, list.length - 1);
      return { kind: "unit", floor, unit: list[slot] };
    }

    function pickAt(clientX: number, clientY: number): PickTarget | null {
      const bounds = canvas.getBoundingClientRect();
      ndc.set(((clientX - bounds.left) / bounds.width) * 2 - 1, -((clientY - bounds.top) / bounds.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      const { ray } = raycaster;
      let best = Infinity;
      let target: PickTarget | null = null;
      const consider = (box: Box3, result: () => PickTarget) => {
        if (!ray.intersectBox(box, hit)) return;
        const distance = hit.distanceTo(ray.origin);
        if (distance < best) {
          best = distance;
          target = result();
        }
      };
      const shown = new Set(state.shownPlots);
      for (const home of homes) {
        if (!shown.has(home.plot.id)) continue;
        const id = home.plot.id;
        plotBox.min.set(home.rect.x0, 0, home.rect.z0);
        plotBox.max.set(home.rect.x1, 0.4, home.rect.z1);
        consider(plotBox, () => ({ kind: "plot", id }));
        if (state.homes && home.mesh.geometry.boundingBox) consider(home.mesh.geometry.boundingBox, () => ({ kind: "plot", id }));
      }
      if (state.buildingShown) {
        consider(buildingGround, () => ({ kind: "building" }));
        consider(towerBox, () => towerTarget(hit));
      }
      return target;
    }

    function setHover(target: PickTarget | null) {
      if (pickKey(target) === pickKey(hover)) return;
      hover = target;
      applyVisuals();
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
      const target = pickAt(event.clientX, event.clientY);
      if (target) options.onPick(target);
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
    // Plain wheel scrolls the page; Ctrl/⌘ + wheel (and trackpad pinch) zooms the plan.
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
      // Keep the view over the site.
      const t = controls.target;
      const x = clamp(t.x, -150, 150);
      const y = clamp(t.y, 0, 25);
      const z = clamp(t.z, -120, 120);
      if (x !== t.x || y !== t.y || z !== t.z) {
        camera.position.add(new Vector3(x - t.x, y - t.y, z - t.z));
        t.set(x, y, z);
      }
      invalidate();
    });

    // Rendering happens on demand: while the camera or an animation moves, and when visible.
    let frame = 0;
    let last = performance.now();
    let visible = true;
    let disposed = false;
    const anchor = new Vector3();

    function anchorFor(id: string) {
      if (id === "building") return anchor.set((TOWER.x0 + TOWER.x1) / 2, towerTop + 5.5, (TOWER.z0 + TOWER.z1) / 2);
      const home = homeById.get(id);
      if (!home) return null;
      const [x, z] = rectCenter(home.rect);
      return anchor.set(x, 1.2 + (home.model.height + 1.6) * (springs.get("homes")?.value ?? 1), z);
    }

    function updateLabels() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      for (const label of labels) {
        const point = anchorFor(label.dataset.label ?? "");
        if (!point) continue;
        // Shrink distant labels on small views so they don't pile up.
        const scale = clamp((width / 720) * (300 / point.distanceTo(camera.position)), 0.62, 1);
        point.project(camera);
        const off = point.z > 1 || Math.abs(point.x) > 1.15 || Math.abs(point.y) > 1.15;
        label.style.transform = `translate3d(${(((point.x + 1) / 2) * width).toFixed(1)}px, ${(((1 - point.y) / 2) * height).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        label.style.visibility = off ? "hidden" : "";
      }
    }

    function invalidate() {
      if (frame || disposed || !visible) return;
      frame = requestAnimationFrame(render);
    }

    function render(now: number) {
      frame = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let active = stepFlight(now);
      active = stepSprings(dt) || active;
      active = controls.update() || active;
      if (active && !options.reducedMotion) lake.material.uniforms.uTime.value += dt;
      sky.position.copy(camera.position);
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
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = performance.now();
        invalidate();
      }
    });
    visibilityObserver.observe(container);

    container.prepend(canvas);
    resize();
    const start = overview();
    if (options.state.selection) {
      place(start);
      flyToSelection(options.state.selection);
    } else if (options.reducedMotion) {
      place(start);
    } else {
      // A short descent onto the site.
      place({ ...start, radius: start.radius * 1.45, phi: 0.72, theta: start.theta - 0.45 });
      fly(start, 2400);
    }
    labels = Array.from(options.labels.querySelectorAll<HTMLElement>("[data-label]"));
    applyVisuals();

    return {
      update(next) {
        const moved = selectionKey(next.selection) !== selectionKey(state.selection);
        state = next;
        applyConfigs(next.configs);
        labels = Array.from(options.labels.querySelectorAll<HTMLElement>("[data-label]"));
        applyVisuals();
        if (moved) flyToSelection(next.selection);
      },
      zoom(direction) {
        const view = currentView();
        fly({ ...view, radius: clamp(view.radius * (direction > 0 ? 0.7 : 1 / 0.7), controls.minDistance, controls.maxDistance) }, 450);
      },
      resetView() {
        fly(overview(), 900);
      },
      dispose() {
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
        disposeAll();
      },
    };
  } catch (error) {
    disposeAll();
    throw error;
  }
}
