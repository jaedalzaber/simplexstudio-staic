import { Spotlight } from "@/components/sections/home/spotlight";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Media } from "@/components/ui/media";
import { outcomes } from "@/content/ecommerce";
import styles from "@/components/sections/solution/solution.module.css";

/** What our capabilities achieve for the client; each capability appears only as a tag. */
export function Outcomes() {
  return (
    <section className={styles.outcomes} data-surface="dark" aria-labelledby="outcomes-title">
      <span className={styles.outcomesGlow} aria-hidden="true" />
      <div className="site-container">
        <div className={styles.sectionHead}>
          <Eyebrow tone="light">What we deliver</Eyebrow>
          <h2 id="outcomes-title" data-reveal="lines">Branding, product content, <br />and custom ecommerce</h2>
        </div>
        <Spotlight className={styles.outcomeGrid}>
          {outcomes.map((outcome, index) => (
            <article className={styles.outcome} key={outcome.title} data-spotlight>
              <div className={styles.outcomeMedia}>
                <Media image={outcome.image} fill sizes="(max-width: 899px) 100vw, 640px" />
              </div>
              <div className={styles.outcomeBody}>
                <span className={styles.index} aria-hidden="true">/0{index + 1}</span>
                <h3>{outcome.title}</h3>
                <p>{outcome.text}</p>
                <p className={styles.madeWith}>
                  <span>Services</span>
                  {outcome.madeWith.map((item) => <span className={styles.tag} key={item}>{item}</span>)}
                </p>
              </div>
            </article>
          ))}
        </Spotlight>
      </div>
    </section>
  );
}
