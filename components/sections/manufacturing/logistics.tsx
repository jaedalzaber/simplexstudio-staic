import { Eyebrow } from "@/components/ui/eyebrow";
import { logisticsStages } from "@/content/manufacturing";
import shared from "@/components/sections/solution/solution.module.css";
import { IsoBoxes, IsoText, project, viewBoxFor, type IsoBox, type Vec3 } from "./iso";
import styles from "./manufacturing.module.css";
import previews from "./previews.module.css";

// Warehouse racks in metres: three rows (A–C) of four bays on two levels, with wide aisles
// so each row stays readable from the isometric angle.
const BAY = 2.2;
const DEPTH = 1;
const PITCH = 4.8;
const ROWS = ["A", "B", "C"] as const;
const LEVELS = [0.15, 1.35];
const selected = { row: "B", bay: 4, level: 2 };
const loads = ["#c9a06b", "#7f9fc6", "#b9c3cf", "#d1b07c", "#8eb0d4", "#c9a06b"];
const LENGTH = 4 * BAY;

function warehouseBoxes(): IsoBox[] {
  const boxes: IsoBox[] = [{ min: [-1.4, -0.08, -1], max: [LENGTH + 1, 0, 2 * PITCH + DEPTH + 1.8], fill: "#e7ebf0" }];
  ROWS.forEach((row, r) => {
    const z0 = r * PITCH;
    const z1 = z0 + DEPTH;
    for (let bay = 0; bay <= 4; bay++) {
      const x = bay * BAY;
      boxes.push({ min: [x, 0, z0], max: [x + 0.08, 2.6, z0 + 0.08], fill: "#3d5f8f" }, { min: [x, 0, z1 - 0.08], max: [x + 0.08, 2.6, z1], fill: "#3d5f8f" });
    }
    for (let bay = 0; bay < 4; bay++) {
      LEVELS.forEach((y, level) => {
        const x0 = bay * BAY + 0.08;
        const x1 = (bay + 1) * BAY;
        boxes.push({ min: [x0, y, z0 + 0.08], max: [x1, y + 0.1, z1], fill: "#e07b39" });
        const isSelected = row === selected.row && bay + 1 === selected.bay && level + 1 === selected.level;
        const fill = isSelected ? "#2f6fd6" : loads[(r * 5 + bay * 3 + level * 2) % loads.length];
        boxes.push({ min: [x0 + 0.2, y + 0.1, z0 + 0.15], max: [x1 - 0.2, y + 0.95 - ((bay + level + r) % 2) * 0.2, z1 - 0.12], fill, ...(isSelected ? { tone: "focus" } : {}) });
      });
    }
  });
  // Staged pallets for dispatch in front of the racks.
  [0.4, 2].forEach((x) => boxes.push({ min: [x, 0, 2 * PITCH + DEPTH + 0.5], max: [x + 1.2, 1.1, 2 * PITCH + DEPTH + 1.5], fill: "#dfe4ea" }));
  return boxes;
}

function WarehouseDrawing() {
  const corners: Vec3[] = [[-1.4, 0, -1], [LENGTH + 1, 2.6, -1], [-1.4, 0, 2 * PITCH + DEPTH + 1.8], [LENGTH + 1, 0, 2 * PITCH + DEPTH + 1.8], [LENGTH + 1, 5.2, PITCH]];
  const row = ROWS.indexOf(selected.row as (typeof ROWS)[number]);
  const [px, py] = project([(selected.bay - 0.5) * BAY, LEVELS[selected.level - 1] + 0.9, row * PITCH + DEPTH]);
  return (
    <svg viewBox={viewBoxFor(corners, [0.8, 0.6])} className={previews.drawing} aria-hidden="true">
      <IsoBoxes boxes={warehouseBoxes()} />
      {ROWS.map((name, r) => <IsoText key={name} at={[-0.5, 0, r * PITCH + DEPTH + 0.3]} className={previews.isoLabel} textAnchor="end">Row {name}</IsoText>)}
      <polyline points={`${px},${py} ${px},${py - 2.4}`} fill="none" stroke="#2f6fd6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={px} cy={py} r="0.14" fill="#2f6fd6" />
      <text x={px} y={py - 2.6} className={previews.isoPin} textAnchor="middle">B-04-2</text>
    </svg>
  );
}

export function Logistics() {
  return (
    <section className={`site-container ${styles.logistics}`} aria-labelledby="logistics-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Warehouse and logistics software</Eyebrow>
          <h2 id="logistics-title" data-reveal="lines">Connect inventory, <br />dispatch, and delivery</h2>
        </div>
        <p data-reveal>
          Track materials and finished goods as they move through storage, production, and delivery. Give warehouse and
          logistics teams the information they need to prepare, dispatch, and follow each order.
        </p>
      </div>

      <ol className={styles.stages} data-reveal="stagger">
        {logisticsStages.map((stage, index) => (
          <li key={stage.title}>
            <span aria-hidden="true">0{index + 1}</span>
            <h3>{stage.title}</h3>
            <p>{stage.text}</p>
          </li>
        ))}
      </ol>

      <div className={styles.logisticsBoard} data-reveal="scale">
        <div className={previews.locationView} role="img" aria-label="Warehouse racks with location B-04-2 selected, holding 12 hinge kits reserved for work order WO-3108">
          <WarehouseDrawing />
          <div className={previews.locationPanel}>
            <p className={previews.cardKicker}>Location B-04-2</p>
            <b>Hinge kit HK-20</b>
            <dl className={previews.options}>
              <div><dt>Quantity</dt><dd>12 kits</dd></div>
              <div><dt>Reserved for</dt><dd>WO-3108, assembly</dd></div>
              <div><dt>Last movement</dt><dd>Moved from goods in</dd></div>
            </dl>
          </div>
        </div>

        <div className={previews.card} role="img" aria-label="Shipment SH-5517: picked and packed, awaiting collection by the carrier">
          <div className={previews.cardHead}>
            <p className={previews.cardKicker}>Shipment SH-5517</p>
            <em data-state="active">Awaiting collection</em>
          </div>
          <dl className={previews.options}>
            <div><dt>Contents</dt><dd>6 base frames BF-900, WO-3102</dd></div>
            <div><dt>Packages</dt><dd>2 pallets, bay D2</dd></div>
            <div><dt>Carrier</dt><dd>Regional haulier, assigned</dd></div>
            <div><dt>Documents</dt><dd>Delivery note DN-5517</dd></div>
          </dl>
          <ol className={previews.shipSteps}>
            <li data-state="done">Picked</li>
            <li data-state="done">Packed</li>
            <li data-state="active">Awaiting collection</li>
            <li>In transit</li>
            <li>Delivered</li>
          </ol>
        </div>
      </div>

      <p className={styles.note} data-reveal>
        3D can help staff find a bin, staging area, or shipment. Barcode scanning, carrier integrations, driver apps,
        GPS tracking, and route planning are modules agreed for each project, connected to the right warehouse and
        transport data. We build the software; we don’t handle freight. Previews show sample data.
      </p>
    </section>
  );
}
