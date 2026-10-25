import { CountUp } from "@/components/motion/count-up";
import { RevealScope } from "@/components/motion/reveal-scope";
import { Eyebrow } from "@/components/ui/eyebrow";
import { impactStats } from "@/content/about";
import styles from "./about.module.css";

export function Impact() {
  return (
    <RevealScope as="section" className={styles.impact} data-surface="dark" aria-labelledby="impact-title">
      <div className={styles.rays} aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>
      <div className={`site-container ${styles.impactInner}`}>
        <div className={styles.impactLabel}>
          <Eyebrow tone="light">Impact</Eyebrow>
          <span className={styles.impactRule} aria-hidden="true" />
        </div>
        <div>
          <h2 id="impact-title" data-reveal="lines">Impact we’re proud of</h2>
          <dl className={styles.impactGrid} data-reveal="stagger">
            {impactStats.map((stat, index) => (
              <div key={`${stat.label}-${index}`}>
                <dt>{stat.label}</dt>
                <dd><CountUp value={stat.value} suffix={stat.suffix} /></dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </RevealScope>
  );
}
