import { Eyebrow } from "@/components/ui/eyebrow";
import { selectorLabels } from "@/content/real-estate";
import shared from "@/components/sections/solution/solution.module.css";
import { PlotSelector } from "./plot-selector";
import styles from "./real-estate.module.css";

/** Helps buyers choose a property; kept visually distinct from the staff-facing management tools. */
export function Selection() {
  return (
    <section className={styles.selection} aria-labelledby="selection-title">
      <div className="site-container">
        <div className={styles.splitHead}>
          <div className={shared.sectionHead}>
            <Eyebrow>Choose a property</Eyebrow>
            <h2 id="selection-title" data-reveal="lines">Interactive plot <br />and unit selection</h2>
          </div>
          <p data-reveal>
            Make a rendered master plan or building view interactive. Buyers can select a plot, floor, or apartment,
            review its layout and availability, and enquire about that specific property.
          </p>
        </div>
        <div data-reveal="scale">
          <PlotSelector />
        </div>
        <p className={styles.labels}>
          {selectorLabels.map((label) => <span className={styles.label} key={label}>{label}</span>)}
        </p>
      </div>
    </section>
  );
}
