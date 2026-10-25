import { StatRow } from "@/components/ui/stat-row";
import { clientNames, facts } from "@/content/ecommerce";
import styles from "@/components/sections/solution/solution.module.css";

export function Proof() {
  return (
    <section className={`site-container ${styles.proof}`} aria-labelledby="proof-title">
      <h2 id="proof-title" className={styles.proofLabel}>Product brands we’ve worked with</h2>
      {/* Text wordmarks until the client logo files arrive. */}
      <ul className={styles.names} data-reveal="stagger">
        {clientNames.map((name) => <li key={name}>{name}</li>)}
      </ul>
      <StatRow stats={facts} className={styles.facts} />
    </section>
  );
}
