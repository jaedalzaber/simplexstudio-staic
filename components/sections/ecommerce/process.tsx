import { ProcessSteps } from "@/components/sections/solution/process-steps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { steps } from "@/content/ecommerce";
import styles from "@/components/sections/solution/solution.module.css";

export function Process() {
  return (
    <section className={`site-container ${styles.process}`} aria-labelledby="process-title">
      <div className={styles.sectionHead}>
        <Eyebrow>Our process</Eyebrow>
        <h2 id="process-title" data-reveal="lines">How we deliver your project</h2>
      </div>
      <ProcessSteps steps={steps} />
      <p className={styles.processNote} data-reveal>
        We review progress with you each week. Typical projects take <strong>1–3 months</strong>. Larger product ranges
        and complex integrations may take longer.
      </p>
    </section>
  );
}
