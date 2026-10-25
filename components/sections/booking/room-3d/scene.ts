import { Box3, BoxGeometry, BufferGeometry, Color, Mesh, MeshBasicMaterial, PlaneGeometry, ShaderMaterial, Vector3 } from "three";
import type { DemoTable, TableStatus } from "@/content/booking-demo";
import { bakeBoxes, bakedGeometry, createBakedMaterial, type Box } from "@/lib/three/bake";
import { createStage, pause } from "@/lib/three/stage";
import { HALF_X, HALF_Z, TABLE_HEIGHT, buildRoom, buildTable, roomLighting, tableCenter, tableFootprint } from "./models";

export { WebGLUnavailable } from "@/lib/three/stage";

export interface RoomState {
  statuses: Readonly<Record<string, TableStatus>>;
  selected: string | null;
}

export interface RoomSceneOptions {
  container: HTMLElement;
  /** Holds one `[data-label]` element per table id. */
  labels: HTMLElement;
  tables: readonly DemoTable[];
  state: RoomState;
  reducedMotion: boolean;
  signal: AbortSignal;
  onPick(id: string): void;
  onHint(kind: "wheel" | "touch"): void;
}

export interface RoomScene {
  update(state: RoomState): void;
  zoom(direction: 1 | -1): void;
  resetView(): void;
  dispose(): void;
}

interface TableModel {
  item: DemoTable;
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  pad: Mesh<PlaneGeometry, MeshBasicMaterial>;
}

const SELECTED_TINT = new Color(0.86, 0.96, 1.3);
const dimFor: Record<TableStatus, number> = { available: 0, booked: 0.5, unsuitable: 0.86 };

export async function createRoomScene(options: RoomSceneOptions): Promise<RoomScene> {
  const { tables } = options;
  let state = options.state;
  let hover: string | null = null;
  const modelById = new Map<string, TableModel>();

  const stage = createStage({
    container: options.container,
    labels: options.labels,
    background: "#eef2f7",
    reducedMotion: options.reducedMotion,
    signal: options.signal,
    far: 200,
    limits: { minDistance: 9, maxDistance: 46, minPolar: 0.12, maxPolar: 1.28, target: new Box3(new Vector3(-HALF_X, 0, -HALF_Z), new Vector3(HALF_X, 1.5, HALF_Z)) },
    overview: (aspect) => ({ target: new Vector3(0.8, 0, 0.5), radius: aspect < 0.9 ? 42 : aspect < 1.4 ? 32 : 29, phi: 0.84, theta: 0.5 }),
    anchor: (id, out) => {
      const model = modelById.get(id);
      if (!model) return null;
      const [x, z] = tableCenter(model.item);
      return out.set(x, model.item.booth ? 1.3 : TABLE_HEIGHT + 0.5, z);
    },
    labelDistance: 26,
    onPick: (id) => options.onPick(id),
    onHint: (kind) => options.onHint(kind),
    onHover: (id) => {
      hover = id;
      applyVisuals();
    },
    pickable: (id) => state.statuses[id] === "available",
  });

  function applyVisuals() {
    for (const model of modelById.values()) {
      const id = model.item.id;
      const status = state.statuses[id] ?? "available";
      const selected = state.selected === id;
      const hovered = hover === id && status === "available";
      const uniforms = model.mesh.material.uniforms;
      // A light tint: the pad and label carry the selection, so the furniture keeps its colours.
      stage.aim(`${id}:highlight`, selected ? 0.35 : hovered ? 0.22 : 0, (v) => (uniforms.uHighlight.value = v));
      stage.aim(`${id}:dim`, selected ? 0 : dimFor[status], (v) => (uniforms.uDim.value = v));
      stage.aim(`${id}:pad`, selected ? 0.32 : hovered ? 0.16 : 0, (v) => {
        model.pad.material.opacity = v;
        model.pad.visible = v > 0.002;
      });
    }
  }

  function flyToSelection(id: string | null) {
    const view = stage.currentView();
    if (!id) return stage.fly({ ...stage.overview(), theta: view.theta });
    const model = modelById.get(id);
    if (!model) return;
    const [x, z] = tableCenter(model.item);
    // Bring the table towards the centre without losing the room around it.
    stage.fly({ target: new Vector3(x * 0.6, 0, z * 0.6), radius: Math.min(view.radius, 22), phi: Math.min(view.phi, 0.9), theta: view.theta });
  }

  try {
    // Bake the room with every table as an occluder, then each table against the room and its neighbours.
    const lighting = roomLighting(tables);
    const fixed = buildRoom();
    const tableBoxes = tables.map((item) => buildTable(item));
    stage.scene.add(new Mesh(bakedGeometry([bakeBoxes(fixed.boxes, { lighting, occluders: tableBoxes.flat(), cell: 0.22, samples: 12, radius: 2.5 })]), createBakedMaterial()));
    await pause();
    stage.check();

    for (const [index, item] of tables.entries()) {
      const occluders: Box[] = [...fixed.boxes, ...tableBoxes.filter((_, other) => other !== index).flat()];
      const mesh = new Mesh(bakedGeometry([bakeBoxes(tableBoxes[index], { lighting, occluders, cell: 0.12, samples: 12, radius: 2.5 })]), createBakedMaterial());
      mesh.material.uniforms.uTint.value.copy(SELECTED_TINT);
      const footprint = tableFootprint(item);
      const pad = new Mesh(
        new PlaneGeometry(footprint.x1 - footprint.x0 + 0.24, footprint.z1 - footprint.z0 + 0.24),
        new MeshBasicMaterial({ color: "#2f6fd6", transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
      );
      pad.rotation.x = -Math.PI / 2;
      pad.position.set((footprint.x0 + footprint.x1) / 2, 0.016, (footprint.z0 + footprint.z1) / 2);
      pad.renderOrder = 1;
      modelById.set(item.id, { item, mesh, pad });
      stage.targets.push({ id: item.id, bounds: new Box3(new Vector3(footprint.x0, 0, footprint.z0), new Vector3(footprint.x1, item.booth ? 1.15 : 0.9, footprint.z1)) });
      stage.scene.add(mesh, pad);
      if (index % 3 === 2) {
        await pause();
        stage.check();
      }
    }

    const lampMaterial = new MeshBasicMaterial({ color: "#ffd6a0", toneMapped: false });
    for (const lamp of fixed.lamps) {
      const mesh = new Mesh(new BoxGeometry(lamp.max[0] - lamp.min[0], lamp.max[1] - lamp.min[1], lamp.max[2] - lamp.min[2]), lampMaterial);
      mesh.position.set((lamp.min[0] + lamp.max[0]) / 2, (lamp.min[1] + lamp.max[1]) / 2, (lamp.min[2] + lamp.max[2]) / 2);
      stage.scene.add(mesh);
    }

    // A short glide into the room.
    await stage.start((view) => ({ ...view, radius: view.radius * 1.35, phi: 0.62, theta: view.theta + 0.5 }));
    applyVisuals();
    if (state.selected) flyToSelection(state.selected);
  } catch (error) {
    stage.dispose();
    throw error;
  }

  return {
    update(next) {
      const moved = next.selected !== state.selected;
      state = next;
      stage.refreshLabels();
      applyVisuals();
      if (moved) flyToSelection(next.selected);
    },
    zoom: stage.zoom,
    resetView: stage.resetView,
    dispose: stage.dispose,
  };
}
