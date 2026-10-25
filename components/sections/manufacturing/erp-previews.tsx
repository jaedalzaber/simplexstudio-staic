import type { ComponentProps } from "react";
import { AppWindow } from "@/components/sections/solution/app-window";
import { sampleOrder } from "@/content/factory-demo";
import styles from "./previews.module.css";

// The sample manufacturer's ERP, recreated in HTML. Records match content/factory-demo.ts:
// WO-3108 is in fabrication and its assembly parts are allocated.

const sections = ["Orders", "Materials", "Planning", "Quality"] as const;

function Window({ nav, ...props }: Omit<ComponentProps<typeof AppWindow>, "title" | "nav"> & { nav: (typeof sections)[number] }) {
  return <AppWindow {...props} title="Operations" nav={{ items: sections, active: nav }} />;
}

const stock = [
  { code: "SH-1525", part: "Steel sheet 1.5 mm", required: 14, inStock: 18, allocated: 14, state: "Available" },
  { code: "HK-20", part: "Hinge kit", required: 36, inStock: 52, allocated: 36, state: "Available" },
  { code: "GS-1200", part: "Door gasket kit", required: 12, inStock: 12, allocated: 12, state: "Allocated" },
  { code: "L-3", part: "Quarter-turn lock", required: 44, inStock: 30, allocated: 30, state: "Short 14" },
  { code: "MP-1200", part: "Mounting plate", required: 20, inStock: 26, allocated: 20, state: "Available" },
  { code: "CG-20", part: "Cable gland M20", required: 64, inStock: 80, allocated: 64, state: "Available" },
] as const;

export function MaterialsPreview() {
  return (
    <Window label="Materials and purchasing: stock and allocations for open work orders, one shortage, and supplier orders" nav="Materials" action="+ Supplier order">
      <div className={styles.split}>
        <div className={styles.pane}>
          <div className={styles.toolbar}><b>Demand for open work orders</b><span className={styles.chip}>All work centres</span></div>
          <div className={styles.table} data-columns="materials">
            <span className={styles.th}>Part</span><span className={styles.th}>Required</span><span className={styles.th}>In stock</span><span className={styles.th}>Allocated</span><span className={styles.th}>Status</span>
            {stock.map((row) => (
              <div className={styles.tr} key={row.code} data-state={row.state.startsWith("Short") ? "short" : undefined}>
                <span><b>{row.code}</b><small>{row.part}</small></span>
                <span>{row.required}</span>
                <span>{row.inStock}</span>
                <span>{row.allocated}</span>
                <span><em data-state={row.state.startsWith("Short") ? "short" : "ok"}>{row.state}</em></span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.side}>
          <p className={styles.kicker}>Shortages</p>
          <div className={styles.alert}><b>L-3 Quarter-turn lock</b><span>14 short for WO-3111 and WO-3099</span></div>
          <p className={styles.kicker}>Supplier orders</p>
          <ul className={styles.list}>
            <li><b>PO-7780</b><span>50 × L-3 locks</span><em data-state="active">Confirmed</em></li>
            <li><b>PO-7779</b><span>20 × steel sheet 1.5 mm</span><em data-state="done">Received</em></li>
            <li><b>PO-7776</b><span>60 × HK-20 hinge kits</span><em data-state="done">Received</em></li>
          </ul>
        </div>
      </div>
    </Window>
  );
}

const centres = [
  { name: "Laser cutter", jobs: [["WO-3111", 1, 2], ["WO-3114", 3, 2]] },
  { name: "Press brake", jobs: [["WO-3108", 1, 2], ["WO-3111", 3, 2]] },
  { name: "Welding cell 1", jobs: [["WO-3108", 2, 2], ["WO-3114", 4, 2]] },
  { name: "Assembly", jobs: [["WO-3099", 1, 1], ["WO-3108", 3, 2], ["WO-3111", 5, 1]] },
  { name: "Inspection", jobs: [["WO-3105", 1, 1], ["WO-3108", 5, 1]] },
] as const;

export function PlanningPreview() {
  return (
    <div className={styles.withTablet}>
      <Window label={`Production schedule by work centre, with ${sampleOrder.workOrder} highlighted, and a shop-floor tablet reporting its progress`} nav="Planning" action="Release work">
        <div className={styles.pane}>
          <div className={styles.toolbar}><b>Week 43 · Work centres</b><span className={styles.chip}>{sampleOrder.workOrder} highlighted</span></div>
          <div className={styles.gantt}>
            <span />
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => <span key={day} className={styles.th}>{day}</span>)}
            {centres.map((centre) => (
              <div className={styles.ganttRow} key={centre.name}>
                <span className={styles.ganttLabel}>{centre.name}</span>
                {centre.jobs.map(([job, start, span]) => (
                  <span key={job} className={styles.ganttBlock} data-focus={job === sampleOrder.workOrder || undefined} style={{ gridColumn: `${start + 1} / span ${span}` }}>{job}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Window>
      <div className={styles.tablet} role="img" aria-label={`Shop-floor tablet at the press brake: ${sampleOrder.workOrder}, 8 of 12 complete`}>
        <p className={styles.kicker}>Press brake · Shop floor</p>
        <b>{sampleOrder.workOrder}</b>
        <span>Bend body shells</span>
        <span className={styles.progress}><i style={{ width: "66.7%" }} /></span>
        <small>8 of 12 complete</small>
        <span className={styles.tabletActions}><em>Report 1 done</em><em data-ghost>Report issue</em></span>
      </div>
    </div>
  );
}

export function QualityPreview() {
  return (
    <Window label="Quality and traceability: an inspection record for an earlier enclosure and the history of its batch" nav="Quality" action="New inspection">
      <div className={styles.split}>
        <div className={styles.pane}>
          <div className={styles.toolbar}><b>Final inspection · EN-1200 serial 0412</b><em data-state="done">Passed</em></div>
          <p className={styles.kicker}>Work order WO-3097 · SPEC-2390 rev A</p>
          <ul className={styles.checks}>
            <li data-state="ok"><b>Dimensions</b><span>Within ±1 mm</span></li>
            <li data-state="ok"><b>Door alignment</b><span>Gap even on all sides</span></li>
            <li data-state="ok"><b>Gasket seal</b><span>Continuous, no gaps</span></li>
            <li data-state="issue"><b>Finish</b><span>Paint run on door, reworked under NCR-118</span></li>
            <li data-state="ok"><b>Labels and documents</b><span>Rating plate and manual</span></li>
          </ul>
        </div>
        <div className={styles.side}>
          <p className={styles.kicker}>Traceability</p>
          <ol className={styles.timeline}>
            <li><b>Sheet lot H-55821</b><span>Received on PO-7761</span></li>
            <li><b>Cut</b><span>Laser cutter, program EN-1200-A</span></li>
            <li><b>Bent and welded</b><span>Press brake, welding cell 1</span></li>
            <li><b>Powder coated</b><span>RAL 7035, batch 3-221</span></li>
            <li><b>Inspected</b><span>NCR-118 closed after rework</span></li>
            <li><b>Shipped</b><span>SH-5508</span></li>
          </ol>
        </div>
      </div>
    </Window>
  );
}
