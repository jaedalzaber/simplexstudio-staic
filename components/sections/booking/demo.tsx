import { Eyebrow } from "@/components/ui/eyebrow";
import shared from "@/components/sections/solution/solution.module.css";
import { TableDemo } from "./table-demo";
import styles from "./booking.module.css";

/** The interactive restaurant: kept separate from client work, with its own disclosure. */
export function Demo() {
  return (
    <section id="demo" className={styles.demoBand} aria-labelledby="demo-title">
      <div className="site-container">
        <div className={styles.splitHead}>
          <div className={shared.sectionHead}>
            <Eyebrow>Interactive venue layout</Eyebrow>
            <h2 id="demo-title" data-reveal="lines">Choose a table <br />in 2D or 3D</h2>
          </div>
          <p data-reveal>
            Explore the restaurant layout, check sample availability, and select a table for your group. Switch
            between a floor plan and a 3D view as you choose.
          </p>
        </div>
        <div data-reveal="scale">
          <TableDemo />
        </div>
        <p className={styles.note} data-reveal>
          The same selection approach can be adapted to desks, meeting rooms, and transport seats. In a project, the
          layout can connect to your booking system’s availability; this demo does not use live venue data.
        </p>
      </div>
    </section>
  );
}
