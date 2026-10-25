import type { ReactNode } from "react";
import { InterfaceTabs } from "@/components/sections/solution/interface-tabs";
import { Eyebrow } from "@/components/ui/eyebrow";
import { erpViews, type ErpView } from "@/content/manufacturing";
import shared from "@/components/sections/solution/solution.module.css";
import { MaterialsPreview, PlanningPreview, QualityPreview } from "./erp-previews";
import styles from "./manufacturing.module.css";

const previews: Record<ErpView, ReactNode> = {
  materials: <MaterialsPreview />,
  planning: <PlanningPreview />,
  quality: <QualityPreview />,
};

/** The planning and production software, in a dark band like the other solution pages' staff tools. */
export function Erp() {
  return (
    <section className={styles.band} data-surface="dark" aria-labelledby="erp-title">
      <span className={styles.bandGlow} aria-hidden="true" />
      <div className="site-container">
        <div className={styles.splitHead}>
          <div className={shared.sectionHead}>
            <Eyebrow tone="light">Custom manufacturing ERP</Eyebrow>
            <h2 id="erp-title" data-reveal="lines">Plan and manage <br />production in one system</h2>
          </div>
          <p data-reveal>
            Give planning, purchasing, and production teams a shared view of what needs to be made, which materials are
            available, and how each job is progressing. Build the software around your manufacturing process.
          </p>
        </div>

        <div data-reveal="scale">
          <InterfaceTabs label="ERP views" tabs={erpViews.map((view) => ({ ...view, preview: previews[view.id] }))} />
        </div>

        <p className={styles.bandNote} data-reveal>
          Connect accounting, customer records, an existing ERP, or other business tools where needed. We define the
          modules for each project, so it does not have to replace all your business software. Machinery, metal
          fabrication, industrial equipment, and assembled products are typical examples; each system is built after
          reviewing your process. Previews show sample data.
        </p>
      </div>
    </section>
  );
}
