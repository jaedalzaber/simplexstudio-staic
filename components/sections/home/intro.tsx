import { RevealScope } from "@/components/motion/reveal-scope";
import { stats } from "@/content/home";
import { CountUp } from "./count-up";
import { Statement } from "./statement";
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
        <dl className={styles.stats} data-reveal="stagger">
          {stats.map((stat) => (
            <div className={styles.stat} key={stat.label}>
              <dt>{stat.label}</dt>
              <dd><CountUp value={stat.value} suffix={stat.suffix} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </RevealScope>
  );
}
