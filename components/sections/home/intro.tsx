import { RevealScope } from "@/components/motion/reveal-scope";
import { Statement } from "@/components/motion/statement";
import { StatRow } from "@/components/ui/stat-row";
import { stats } from "@/content/home";
import styles from "./intro.module.css";

export function Intro() {
  return (
    <RevealScope as="section" className={styles.intro} aria-labelledby="intro-title">
      <div className="site-container">
        <h2 id="intro-title" className={styles.visuallyHidden}>About Simplex Studio</h2>
        <Statement className={styles.statement}>
          At Simplex Studio, we’re a digital transformation company reshaping how businesses generate demand, make
          decisions, and scale through technology.
        </Statement>
        <StatRow stats={stats} className={styles.stats} />
      </div>
    </RevealScope>
  );
}
