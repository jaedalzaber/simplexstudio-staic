import type { ReactNode, SVGProps } from "react";

// Isometric SVG drawings built from axis-aligned boxes: the configured product, the
// warehouse and the training views. They read as 3D without loading WebGL.
// x runs to the right-back, z to the left-front, y up; the viewer looks from +x, +y, +z.

export type Vec3 = [x: number, y: number, z: number];

export interface IsoBox {
  min: Vec3;
  max: Vec3;
  /** Top face colour; the two sides are shaded from it. */
  fill: string;
  stroke?: string;
  /** Marks a box for highlighting styles. */
  tone?: string;
}

const COS = Math.cos(Math.PI / 6);

export function project([x, y, z]: Vec3): [number, number] {
  return [(x - z) * COS, (x + z) * 0.5 - y];
}

function shade(hex: string, factor: number) {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((value >> shift) & 255) * factor);
  return `rgb(${channel(16)} ${channel(8)} ${channel(0)})`;
}

const points = (corners: Vec3[]) => corners.map((corner) => project(corner).map((n) => n.toFixed(1)).join(",")).join(" ");

/** True when `a` must be drawn before `b`: it lies behind or below it. */
function behind(a: IsoBox, b: IsoBox) {
  return a.max[0] <= b.min[0] || a.max[2] <= b.min[2] || a.max[1] <= b.min[1];
}

/** Painter's order: a topological sort on "behind", falling back to depth when boxes interlock. */
function order(boxes: readonly IsoBox[]): IsoBox[] {
  const depth = (box: IsoBox) => box.min[0] + box.min[2] + box.min[1] * 0.5;
  const remaining = new Set(boxes.map((_, index) => index));
  const result: IsoBox[] = [];
  while (remaining.size) {
    let pick = -1;
    for (const index of remaining) {
      const blocked = [...remaining].some((other) => other !== index && behind(boxes[other], boxes[index]) && !behind(boxes[index], boxes[other]));
      if (!blocked && (pick < 0 || depth(boxes[index]) < depth(boxes[pick]))) pick = index;
    }
    if (pick < 0) pick = [...remaining].reduce((best, index) => (depth(boxes[index]) < depth(boxes[best]) ? index : best));
    remaining.delete(pick);
    result.push(boxes[pick]);
  }
  return result;
}

export function IsoBoxes({ boxes, className }: { boxes: readonly IsoBox[]; className?: string }) {
  return (
    <g className={className}>
      {order(boxes).map((box, index) => {
        const [x0, y0, z0] = box.min;
        const [x1, y1, z1] = box.max;
        const stroke = box.stroke ?? "rgb(8 11 19 / 0.18)";
        return (
          <g key={index} data-tone={box.tone} strokeWidth="0.8" strokeLinejoin="round" stroke={stroke}>
            <polygon points={points([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill={box.fill} vectorEffect="non-scaling-stroke" />
            <polygon points={points([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])} fill={shade(box.fill, 0.8)} vectorEffect="non-scaling-stroke" />
            <polygon points={points([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill={shade(box.fill, 0.9)} vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
    </g>
  );
}

/** The 2D bounds of a set of points once projected, with padding. */
export function viewBoxFor(corners: readonly Vec3[], pad: number | [x: number, y: number]) {
  const projected = corners.map(project);
  const [px, py] = Array.isArray(pad) ? pad : [pad, pad];
  const xs = projected.map(([x]) => x);
  const ys = projected.map(([, y]) => y);
  const minX = Math.min(...xs) - px;
  const minY = Math.min(...ys) - py;
  return `${minX.toFixed(0)} ${minY.toFixed(0)} ${(Math.max(...xs) - minX + px).toFixed(0)} ${(Math.max(...ys) - minY + py).toFixed(0)}`;
}

/** A text label placed at a 3D point. */
export function IsoText({ at, children, ...props }: { at: Vec3; children: ReactNode } & SVGProps<SVGTextElement>) {
  const [x, y] = project(at);
  return <text x={x} y={y} {...props}>{children}</text>;
}

/** A line between two 3D points. */
export function IsoLine({ from, to, ...props }: { from: Vec3; to: Vec3 } & Omit<SVGProps<SVGLineElement>, "from" | "to">) {
  const [x1, y1] = project(from);
  const [x2, y2] = project(to);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} {...props} />;
}

const box = (min: Vec3, max: Vec3, fill: string, tone?: string): IsoBox => ({ min, max, fill, ...(tone ? { tone } : {}) });

/**
 * The EN-1200 enclosure in millimetres: 800 wide (x), 1200 high (y), 300 deep (z),
 * door on the front (+z) face. `open` slides the door forward for the training view.
 */
export function enclosureBoxes({ open = 0, highlight }: { open?: number; highlight?: "gasket" | "hinges" | "lock" } = {}): IsoBox[] {
  const body = "#cdd2d0";
  const door = "#d9dddb";
  const z = 300 + open;
  return [
    box([0, 0, 0], [800, 1200, 300], body),
    box([0, -40, 20], [800, 0, 280], "#9aa0a6"),
    // Door gasket, visible when the door is open.
    ...(open > 0 ? [box([36, 46, 300], [764, 1154, 306], highlight === "gasket" ? "#2f6fd6" : "#3b4048", highlight === "gasket" ? "focus" : undefined)] : []),
    box([30, 40, z], [770, 1160, z + 14], door),
    box([8, 160, z - 4], [30, 250, z + 16], highlight === "hinges" ? "#2f6fd6" : "#4b5158", highlight === "hinges" ? "focus" : undefined),
    box([8, 950, z - 4], [30, 1040, z + 16], highlight === "hinges" ? "#2f6fd6" : "#4b5158", highlight === "hinges" ? "focus" : undefined),
    box([700, 560, z + 14], [730, 650, z + 34], highlight === "lock" ? "#2f6fd6" : "#23272d", highlight === "lock" ? "focus" : undefined),
  ];
}
