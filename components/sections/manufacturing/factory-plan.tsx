"use client";

import { useId } from "react";
import { FACTORY, factoryAreas, factoryDoors, type AreaId, type AreaSummary, type OrderStep } from "@/content/factory-demo";
import styles from "./manufacturing.module.css";

const WALL = 10;

/** Simplified equipment outlines per area, in plan units. */
const equipment: Record<AreaId, readonly [x: number, y: number, width: number, height: number][]> = {
  materials: [[45, 40, 190, 22], [45, 92, 190, 22], [45, 144, 190, 22]],
  cutting: [[300, 60, 160, 70], [300, 140, 160, 40], [470, 80, 22, 16], [475, 145, 30, 30]],
  fabrication: [[568, 52, 94, 30], [575, 110, 50, 26], [680, 50, 80, 60], [680, 122, 80, 60]],
  assembly: [[572, 300, 120, 30], [572, 352, 120, 30], [572, 404, 120, 30], [712, 300, 40, 140]],
  inspection: [[320, 320, 110, 50], [450, 320, 50, 26], [300, 400, 72, 40]],
  dispatch: [[60, 300, 30, 24], [96, 300, 30, 24], [60, 334, 30, 24], [96, 334, 30, 24], [60, 392, 30, 24], [96, 392, 30, 24], [160, 300, 60, 30], [166, 380, 30, 44]],
};

/** Where each area's route marker sits, on the aisle edge. */
export const routeMarkers: Record<AreaId, [number, number]> = {
  materials: [140, 214], cutting: [400, 214], fabrication: [660, 214],
  assembly: [660, 266], inspection: [400, 266], dispatch: [140, 266],
};

/**
 * The factory floor plan. A pointer shortcut: the area list beside it offers
 * every choice to keyboard and screen reader users.
 */
export function FactoryPlan({ selected, follow, summaries, steps, onSelect }: {
  selected: AreaId | null;
  follow: boolean;
  summaries: Readonly<Record<AreaId, AreaSummary>>;
  steps: readonly OrderStep[];
  onSelect: (id: AreaId) => void;
}) {
  const id = useId();
  const stateAt = new Map(steps.map((step) => [step.area, step.state]));

  return (
    <svg viewBox={`${-WALL - 92} ${-WALL - 12} ${FACTORY.width + 2 * WALL + 104} ${FACTORY.height + 2 * WALL + 24}`} className={styles.planSvg} aria-hidden="true">
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#2f6fd6" />
        </marker>
      </defs>
      <rect className={styles.planFloor} x="0" y="0" width={FACTORY.width} height={FACTORY.height} />
      <rect className={styles.planAisle} x="20" y="200" width="760" height="80" />

      {/* Walls, with doors in the west wall. */}
      <rect className={styles.planWall} x={-WALL} y={-WALL} width={FACTORY.width + 2 * WALL} height={WALL} />
      <rect className={styles.planWall} x={FACTORY.width} y={-WALL} width={WALL} height={FACTORY.height + 2 * WALL} />
      <rect className={styles.planWall} x={-WALL} y={FACTORY.height} width={FACTORY.width + 2 * WALL} height={WALL} />
      {[[-WALL, factoryDoors.receiving.y0], [factoryDoors.receiving.y1, factoryDoors.loading[0].y0], [factoryDoors.loading[0].y1, factoryDoors.loading[1].y0], [factoryDoors.loading[1].y1, FACTORY.height + WALL]].map(([y0, y1]) => (
        <rect key={y0} className={styles.planWall} x={-WALL} y={y0} width={WALL} height={y1 - y0} />
      ))}
      <text className={styles.planDoor} x={-WALL - 6} y={(factoryDoors.receiving.y0 + factoryDoors.receiving.y1) / 2} textAnchor="end">Goods in</text>
      <text className={styles.planDoor} x={-WALL - 6} y={(factoryDoors.loading[0].y0 + factoryDoors.loading[1].y1) / 2} textAnchor="end">Loading</text>

      {factoryAreas.map((area) => {
        const summary = summaries[area.id];
        const { x, y, width, height } = area.shape;
        return (
          <g
            key={area.id}
            className={styles.planArea}
            data-attention={summary.status === "attention" || undefined}
            data-selected={selected === area.id || undefined}
            onClick={() => onSelect(area.id)}
          >
            <rect className={styles.planZone} x={x} y={y} width={width} height={height} rx="8" />
            {equipment[area.id].map(([ex, ey, ew, eh]) => <rect key={`${ex}-${ey}`} className={styles.planKit} x={ex} y={ey} width={ew} height={eh} rx="3" />)}
            <text className={styles.planName} x={x + 10} y={y + height - 12}>{area.code} {area.name}</text>
          </g>
        );
      })}

      {follow && (
        <g className={styles.planRoute}>
          <path d="M 140 222 H 640" markerEnd={`url(#${id}-arrow)`} />
          <path d="M 680 222 C 700 222 700 258 680 258" markerEnd={`url(#${id}-arrow)`} />
          <path d="M 640 258 H 70" markerEnd={`url(#${id}-arrow)`} />
          {factoryAreas.map((area) => {
            const [cx, cy] = routeMarkers[area.id];
            const state = stateAt.get(area.id) ?? "scheduled";
            return <circle key={area.id} className={styles.planStep} data-state={state} cx={cx} cy={cy} r="9" />;
          })}
        </g>
      )}
    </svg>
  );
}
