import { Box3, BufferGeometry, Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Shape, ShapeGeometry, ShaderMaterial, Vector3 } from "three";
import { factoryAreas, type AreaId, type FactoryArea } from "@/content/factory-demo";
import { bakeBoxes, bakedGeometry, createBakedMaterial } from "@/lib/three/bake";
import { createStage, pause } from "@/lib/three/stage";
import { HALF_X, HALF_Z, areaCenter, buildFactory, factoryLighting, routeChevrons, toWorld } from "./models";

export { WebGLUnavailable } from "@/lib/three/stage";

export interface FactoryState {
  selected: AreaId | null;
  /** Show the followed order's route. */
  follow: boolean;
  attention: readonly AreaId[];
}

export interface FactorySceneOptions {
  container: HTMLElement;
  /** Holds one `[data-label]` element per area id. */
  labels: HTMLElement;
  state: FactoryState;
  reducedMotion: boolean;
  signal: AbortSignal;
  onPick(id: AreaId): void;
  onHint(kind: "wheel" | "touch"): void;
}

export interface FactoryScene {
  update(state: FactoryState): void;
  zoom(direction: 1 | -1): void;
  resetView(): void;
  dispose(): void;
}

interface AreaModel {
  area: FactoryArea;
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  pad: Mesh<PlaneGeometry, MeshBasicMaterial>;
}

const SELECTED_TINT = new Color(0.86, 0.96, 1.3);
const PAD = { blue: new Color("#2f6fd6"), amber: new Color("#e2a42f") };

function chevronGeometry() {
  const shape = new Shape();
  shape.moveTo(-0.5, -0.55);
  shape.lineTo(0.1, 0);
  shape.lineTo(-0.5, 0.55);
  shape.lineTo(-0.15, 0.55);
  shape.lineTo(0.45, 0);
  shape.lineTo(-0.15, -0.55);
  shape.closePath();
  const geometry = new ShapeGeometry(shape);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export async function createFactoryScene(options: FactorySceneOptions): Promise<FactoryScene> {
  let state = options.state;
  let hover: AreaId | null = null;
  const models = new Map<AreaId, AreaModel>();
  const route = new Group();
  const routeMaterial = new MeshBasicMaterial({ color: "#2f6fd6", transparent: true, opacity: 0, depthWrite: false, toneMapped: false });

  const stage = createStage({
    container: options.container,
    labels: options.labels,
    background: "#eef2f7",
    reducedMotion: options.reducedMotion,
    signal: options.signal,
    limits: { minDistance: 14, maxDistance: 120, minPolar: 0.12, maxPolar: 1.25, target: new Box3(new Vector3(-HALF_X, 0, -HALF_Z), new Vector3(HALF_X, 3, HALF_Z)) },
    overview: (aspect) => ({ target: new Vector3(1, 0, 1), radius: aspect < 0.9 ? 100 : aspect < 1.4 ? 76 : 64, phi: 0.82, theta: 0.42 }),
    anchor: (id, out) => {
      const model = models.get(id as AreaId);
      if (!model) return null;
      const [x, z] = areaCenter(model.area.shape);
      return out.set(x, 4.6, z);
    },
    labelDistance: 60,
    onPick: (id) => options.onPick(id as AreaId),
    onHint: (kind) => options.onHint(kind),
    onHover: (id) => {
      hover = id as AreaId | null;
      applyVisuals();
    },
    pickable: () => true,
  });

  function applyVisuals() {
    for (const model of models.values()) {
      const id = model.area.id;
      const selected = state.selected === id;
      const hovered = hover === id;
      const uniforms = model.mesh.material.uniforms;
      model.pad.material.color.copy(state.attention.includes(id) && !selected ? PAD.amber : PAD.blue);
      stage.aim(`${id}:highlight`, selected ? 0.4 : hovered ? 0.22 : 0, (v) => (uniforms.uHighlight.value = v));
      stage.aim(`${id}:pad`, selected ? 0.22 : state.attention.includes(id) ? 0.16 : hovered ? 0.1 : 0, (v) => {
        model.pad.material.opacity = v;
        model.pad.visible = v > 0.002;
      });
    }
    stage.aim("route", state.follow ? 0.75 : 0, (v) => {
      routeMaterial.opacity = v;
      route.visible = v > 0.002;
    });
  }

  try {
    // Bake the hall with all equipment as occluders, then each area against everything else.
    const factory = buildFactory();
    const equipment = Object.values(factory.areas).flat();
    stage.scene.add(new Mesh(bakedGeometry([bakeBoxes(factory.hall, { lighting: factoryLighting, occluders: equipment, cell: 0.5, samples: 10, radius: 3 })]), createBakedMaterial()));
    await pause();
    stage.check();

    for (const area of factoryAreas) {
      const occluders = [...factory.hall, ...factoryAreas.filter((other) => other.id !== area.id).flatMap((other) => factory.areas[other.id])];
      const mesh = new Mesh(bakedGeometry([bakeBoxes(factory.areas[area.id], { lighting: factoryLighting, occluders, cell: 0.22, samples: 10, radius: 3 })]), createBakedMaterial());
      mesh.material.uniforms.uTint.value.copy(SELECTED_TINT);
      const [x0, z0] = toWorld(area.shape.x, area.shape.y);
      const [x1, z1] = toWorld(area.shape.x + area.shape.width, area.shape.y + area.shape.height);
      const pad = new Mesh(new PlaneGeometry(x1 - x0, z1 - z0), new MeshBasicMaterial({ color: PAD.blue, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
      pad.rotation.x = -Math.PI / 2;
      pad.position.set((x0 + x1) / 2, 0.02, (z0 + z1) / 2);
      pad.renderOrder = 1;
      models.set(area.id, { area, mesh, pad });
      stage.targets.push({ id: area.id, bounds: new Box3(new Vector3(x0, 0, z0), new Vector3(x1, 4.2, z1)) });
      stage.scene.add(mesh, pad);
      await pause();
      stage.check();
    }

    const chevron = chevronGeometry();
    for (const { position, angle } of routeChevrons()) {
      const mesh = new Mesh(chevron, routeMaterial);
      mesh.position.set(position[0], 0.03, position[1]);
      mesh.rotation.y = -angle;
      mesh.scale.setScalar(1.2);
      mesh.renderOrder = 2;
      route.add(mesh);
    }
    stage.scene.add(route);

    // A short glide down onto the floor.
    await stage.start((view) => ({ ...view, radius: view.radius * 1.3, phi: 0.6, theta: view.theta + 0.45 }));
    applyVisuals();
  } catch (error) {
    stage.dispose();
    throw error;
  }

  return {
    update(next) {
      state = next;
      stage.refreshLabels();
      applyVisuals();
    },
    zoom: stage.zoom,
    resetView: stage.resetView,
    dispose: stage.dispose,
  };
}
