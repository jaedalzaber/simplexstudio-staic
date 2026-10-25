import { Eyebrow } from "@/components/ui/eyebrow";
import { situations } from "@/content/ecommerce";
import styles from "@/components/sections/solution/solution.module.css";

export function Situations() {
  return (
    <section className={`site-container ${styles.situations}`} aria-labelledby="situations-title">
      <div className={styles.sectionHead}>
        <Eyebrow>Who we help</Eyebrow>
        <h2 id="situations-title" data-reveal="lines">For new launches <br />and existing stores</h2>
      </div>
      <ul className={styles.situationGrid} data-reveal="stagger">
        {situations.map((situation, index) => (
          <li className={styles.situation} key={situation.title}>
            <span className={styles.index} aria-hidden="true">/0{index + 1}</span>
            <h3>{situation.title}</h3>
            <p>{situation.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
