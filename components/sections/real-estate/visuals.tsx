import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { visualItems, visualSequence } from "@/content/real-estate";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./real-estate.module.css";

export function Visuals() {
  return (
    <section className={`site-container ${styles.visuals}`} aria-labelledby="visuals-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Architectural visualization</Eyebrow>
          <h2 id="visuals-title" data-reveal="lines">Interior and exterior <br />3D rendering</h2>
        </div>
        <p data-reveal>
          We turn architectural plans and models into interior, exterior, and aerial renders, animation, and tours
          for property marketing.
        </p>
      </div>

      <div className={styles.sequence}>
        {visualSequence.map((view) => (
          <figure className={styles.view} key={view.label} data-reveal="scale">
            <div className={styles.viewMedia}>
              <Media image={view.image} fill sizes="(max-width: 899px) 100vw, 660px" />
            </div>
            <figcaption>
              <a href={view.url} target="_blank" rel="noopener noreferrer">
                {view.label}<ArrowUpRightIcon /><span className={shared.visuallyHidden}> (opens in a new tab)</span>
              </a>
              <span>{view.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <ul className={styles.visualItems} data-reveal="stagger">
        {visualItems.map((item) => (
          <li key={item.title} id={item.id}>
            <h3>{item.title}</h3>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <p className={styles.visualNote}>
        Use the same 3D scenes for your website, launch film, property listings, and sales materials.
      </p>
    </section>
  );
}
