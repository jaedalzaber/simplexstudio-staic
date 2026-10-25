import { Eyebrow } from "@/components/ui/eyebrow";
import shared from "@/components/sections/solution/solution.module.css";
import { FactoryDemo } from "./factory-demo";
import styles from "./manufacturing.module.css";

/** The illustrative factory, separate from client work, with its simulated-data label. */
export function Demo() {
  return (
    <section id="factory-demo" className={styles.demoBand} aria-labelledby="factory-title">
      <div className="site-container">
        <div className={styles.splitHead}>
          <div className={shared.sectionHead}>
            <Eyebrow>Factory digital twin</Eyebrow>
            <h2 id="factory-title" data-reveal="lines">Explore production in <br />a factory digital twin</h2>
          </div>
          <p data-reveal>
            Select a work area to review its jobs, material requirements, and production status. Follow a sample order
            from raw materials to dispatch.
          </p>
        </div>
        <div data-reveal="scale">
          <FactoryDemo />
        </div>
        <p className={styles.note} data-reveal>
          For a real twin, we identify the assets, the ERP, warehouse or equipment data it links to, how often it
          updates, and the decisions it supports. Without a data connection, a 3D factory is a visual model; this demo
          shows the connection with simulated records.
        </p>
      </div>
    </section>
  );
}
