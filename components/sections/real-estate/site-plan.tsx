"use client";

import { useId } from "react";
import { demoBuilding, demoPlots, type Plot } from "@/content/real-estate";
import type { SiteSelection } from "./site-3d/types";
import styles from "./real-estate.module.css";

const floors = Array.from({ length: demoBuilding.floors }, (_, index) => index + 1);

/** The flat master plan, shown where WebGL is unavailable. */
export function SitePlan({ selection, plotShown, buildingShown, onSelect }: {
  selection: SiteSelection;
  plotShown: (plot: Plot) => boolean;
  buildingShown: boolean;
  onSelect: (selection: SiteSelection) => void;
}) {
  const id = useId();
  const floor = selection?.kind === "building" ? selection.floor : null;

  return (
    <svg viewBox="0 0 800 520" className={styles.planSvg}>
      <defs>
        <pattern id={`${id}-sold`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="#e4e8ee" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="#b9c1cd" strokeWidth="3" />
        </pattern>
        <pattern id={`${id}-reserved`} width="9" height="9" patternUnits="userSpaceOnUse">
          <rect width="9" height="9" fill="#f6efe0" />
          <circle cx="4.5" cy="4.5" r="1.6" fill="#d2b77c" />
        </pattern>
      </defs>
      <rect className={styles.land} x="0" y="0" width="800" height="520" rx="22" />
      <rect className={styles.road} x="20" y="188" width="620" height="30" rx="6" />
      <rect className={styles.road} x="636" y="20" width="16" height="320" rx="6" />
      <rect className={styles.road} x="20" y="336" width="760" height="22" rx="6" />
      <rect className={styles.park} x="40" y="378" width="360" height="118" rx="18" />
      {[80, 140, 210, 270, 340].map((cx, index) => <circle key={cx} className={styles.tree} cx={cx} cy={index % 2 ? 418 : 452} r={index % 2 ? 16 : 20} />)}
      <ellipse className={styles.lake} cx="600" cy="436" rx="170" ry="54" />
      <text className={styles.areaLabel} x="220" y="490">Park</text>
      <text className={styles.areaLabel} x="600" y="442">Lake</text>

      {demoPlots.map((item) => {
        const selected = selection?.kind === "plot" && selection.id === item.id;
        const fill = item.status === "Sold" ? `url(#${id}-sold)` : item.status === "Reserved" ? `url(#${id}-reserved)` : undefined;
        return (
          <g
            key={item.id}
            className={styles.plot}
            data-status={item.status}
            data-selected={selected || undefined}
            data-dim={!plotShown(item) || undefined}
            onClick={() => plotShown(item) && onSelect({ kind: "plot", id: item.id })}
          >
            <rect x={item.shape.x} y={item.shape.y} width={item.shape.width} height={item.shape.height} rx="8" style={fill && !selected ? { fill } : undefined} />
            <text x={item.shape.x + item.shape.width / 2} y={item.shape.y + item.shape.height / 2 + 5}>{item.id}</text>
          </g>
        );
      })}

      <g
        className={styles.plot}
        data-building
        data-selected={selection?.kind === "building" || undefined}
        data-dim={!buildingShown || undefined}
        onClick={() => buildingShown && onSelect({ kind: "building", floor: null, unit: null })}
      >
        <rect x={demoBuilding.shape.x} y={demoBuilding.shape.y} width={demoBuilding.shape.width} height={demoBuilding.shape.height} rx="10" />
        {floors.map((level) => (
          <line
            key={level}
            className={styles.floorLine}
            data-active={floor === level || undefined}
            x1={demoBuilding.shape.x + 12}
            x2={demoBuilding.shape.x + demoBuilding.shape.width - 12}
            y1={demoBuilding.shape.y + demoBuilding.shape.height - level * 38}
            y2={demoBuilding.shape.y + demoBuilding.shape.height - level * 38}
          />
        ))}
        <text x={demoBuilding.shape.x + demoBuilding.shape.width / 2} y={demoBuilding.shape.y + 26}>A</text>
      </g>
    </svg>
  );
}
