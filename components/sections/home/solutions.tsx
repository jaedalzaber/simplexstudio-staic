import { RevealScope } from "@/components/motion/reveal-scope";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons";
import { ScrollSpyNav } from "@/components/ui/scroll-spy-nav";
import { ServicePill } from "@/components/ui/service-pill";
import { TalkCard } from "@/components/ui/talk-card";
import { solutionHref, solutions } from "@/content/solutions";
import { SolutionVisual } from "./solution-visual";
import styles from "./solutions.module.css";

const anchor = (slug: string) => `solution-${slug}`;

/** What we build: one showcase per solution, with a sticky index that follows the reader. */
export function Solutions() {
  return (
    <RevealScope as="section" className={`site-container ${styles.section}`} aria-labelledby="solutions-title">
      <div className={styles.head}>
        <Eyebrow>Solutions</Eyebrow>
        <h2 id="solutions-title" data-reveal="lines">What we build for<br />growing businesses</h2>
        <p data-reveal data-reveal-delay="0.15">
          Proven product foundations we tailor to your market, so you start from what works and spend your budget on
          what makes you different.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.list}>
          {solutions.map((solution, index) => (
            <article className={styles.item} id={anchor(solution.slug)} key={solution.slug} aria-labelledby={`${anchor(solution.slug)}-title`}>
              <SolutionVisual solution={solution} index={index} />
              <div className={styles.copy}>
                <h3 id={`${anchor(solution.slug)}-title`} data-reveal>{solution.title}</h3>
                <p data-reveal>{solution.summary}</p>
                <ul className={styles.highlights} data-reveal="stagger">
                  {solution.highlights.map((highlight) => <li key={highlight}><CheckIcon />{highlight}</li>)}
                </ul>
                <div className={styles.pillWrap} data-reveal>
                  <ServicePill href={solutionHref(solution)} image={solution.image.src} label={`View ${solution.title} solution`} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className={styles.sidebar} aria-label="Solutions">
          <div className={styles.sticky}>
            <ScrollSpyNav
              title="Our solutions"
              items={solutions.map((solution) => ({ id: anchor(solution.slug), text: solution.title }))}
              className={styles.spy}
            />
            <TalkCard />
          </div>
        </aside>
      </div>
    </RevealScope>
  );
}
