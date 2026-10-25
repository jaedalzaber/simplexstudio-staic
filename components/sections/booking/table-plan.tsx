"use client";

import { useId } from "react";
import { BENCH_WIDTH, CHAIR_SIZE, PLAN, boothBenches, chairSpots, demoTables, room, type TableStatus } from "@/content/booking-demo";
import styles from "./booking.module.css";

const WALL = 12;

/**
 * The restaurant floor plan. A pointer shortcut: the table list beside it
 * offers every choice to keyboard and screen reader users.
 */
export function TablePlan({ statuses, selected, onSelect }: {
  statuses: Readonly<Record<string, TableStatus>>;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const id = useId();
  const { entrance, kitchenPass, bar, backBar, hostStand } = room;

  return (
    <svg viewBox={`${-WALL - 14} ${-WALL - 14} ${PLAN.width + 2 * WALL + 28} ${PLAN.height + 2 * WALL + 40}`} className={styles.planSvg} aria-hidden="true">
      <defs>
        <pattern id={`${id}-booked`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="7" height="7" fill="#eceff3" />
          <line x1="0" y1="0" x2="0" y2="7" stroke="#bfc6d1" strokeWidth="3" />
        </pattern>
      </defs>

      <rect className={styles.planFloor} x="0" y="0" width={PLAN.width} height={PLAN.height} />
      <rect className={styles.planRug} x="140" y="160" width="290" height="280" rx="10" />

      {/* Walls, with the glazed west wall and the entrance gap in the south wall. */}
      <rect className={styles.planWall} x={-WALL} y={-WALL} width={PLAN.width + 2 * WALL} height={WALL} />
      <rect className={styles.planWall} x={PLAN.width} y={-WALL} width={WALL} height={PLAN.height + 2 * WALL} />
      <rect className={styles.planWall} x={-WALL} y={-WALL} width={WALL} height={PLAN.height + 2 * WALL} />
      <rect className={styles.planWall} x={-WALL} y={PLAN.height} width={entrance.x0 + WALL} height={WALL} />
      <rect className={styles.planWall} x={entrance.x1} y={PLAN.height} width={PLAN.width - entrance.x1 + WALL} height={WALL} />
      {room.windows.map((pane) => (
        <g key={pane.y0} className={styles.planWindow}>
          <rect x={-WALL} y={pane.y0} width={WALL} height={pane.y1 - pane.y0} />
          <line x1={-WALL / 2} x2={-WALL / 2} y1={pane.y0} y2={pane.y1} />
        </g>
      ))}
      <path className={styles.planDoor} d={`M ${entrance.x0} ${PLAN.height} A ${entrance.x1 - entrance.x0} ${entrance.x1 - entrance.x0} 0 0 0 ${entrance.x1} ${PLAN.height - (entrance.x1 - entrance.x0)}`} />
      <text className={styles.planArea} x={(entrance.x0 + entrance.x1) / 2} y={PLAN.height + WALL + 20}>Entrance</text>

      <rect className={styles.planFixture} x={kitchenPass.x} y={kitchenPass.y} width={kitchenPass.width} height={kitchenPass.height} />
      <text className={styles.planFixtureLabel} x={kitchenPass.x + kitchenPass.width / 2} y={kitchenPass.y + 25}>Kitchen pass</text>
      <rect className={styles.planBar} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx="6" />
      <rect className={styles.planFixture} x={backBar.x} y={backBar.y} width={backBar.width} height={backBar.height} />
      <text className={styles.planFixtureLabel} data-light x={bar.x + bar.width / 2} y={bar.y + bar.height / 2} transform={`rotate(-90 ${bar.x + bar.width / 2} ${bar.y + bar.height / 2})`} dy="5">Bar</text>
      {room.stools.map((stool) => <circle key={stool.y} className={styles.planStool} cx={stool.x} cy={stool.y} r="10" />)}
      <rect className={styles.planFixture} x={hostStand.x} y={hostStand.y} width={hostStand.width} height={hostStand.height} rx="4" />
      {room.planters.map((planter) => <circle key={planter.x + planter.y} className={styles.planPlanter} cx={planter.x} cy={planter.y} r={planter.size / 2} />)}

      <text className={styles.planArea} x="120" y="268" transform="rotate(-90 120 268)">Window</text>
      <text className={styles.planArea} x="285" y="128">Booths</text>
      <text className={styles.planArea} x="279" y="296">Main room</text>
      <text className={styles.planArea} x="600" y="240">Bar side</text>

      {demoTables.map((item) => {
        const status = statuses[item.id];
        const isSelected = selected === item.id;
        const { x, y, width, height } = item.shape;
        return (
          <g
            key={item.id}
            className={styles.planTable}
            data-status={status}
            data-selected={isSelected || undefined}
            onClick={() => onSelect(item.id)}
          >
            {item.booth
              ? boothBenches(item).map((bench) => <rect key={bench.x} className={styles.planSeat} x={bench.x + 2} y={bench.y} width={BENCH_WIDTH - 4} height={bench.height} rx="6" />)
              : chairSpots(item).map((chair) => (
                <rect key={`${chair.x}-${chair.y}`} className={styles.planSeat} x={chair.x - CHAIR_SIZE / 2} y={chair.y - CHAIR_SIZE / 2} width={CHAIR_SIZE} height={CHAIR_SIZE} rx="6" />
              ))}
            <rect
              className={styles.planTop}
              x={x}
              y={y}
              width={width}
              height={height}
              rx="5"
              style={status === "booked" && !isSelected ? { fill: `url(#${id}-booked)` } : undefined}
            />
            <text x={x + width / 2} y={y + height / 2 + 5}>{item.number}</text>
          </g>
        );
      })}
    </svg>
  );
}
