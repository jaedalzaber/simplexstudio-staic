import { Eyebrow } from "@/components/ui/eyebrow";
import { Media } from "@/components/ui/media";
import { skywings } from "@/content/manufacturing";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./manufacturing.module.css";

/** Delivered work. The ERP view comes first and largest, so it reads as prominently as the storefront. */
export function Skywings() {
  return (
    <section id="work" className={`site-container ${styles.showcase}`} aria-labelledby="skywings-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Client project</Eyebrow>
          <h2 id="skywings-title" data-reveal="lines">{skywings.name}: ecommerce, 3D products, <br />and manufacturing ERP</h2>
        </div>
        <p data-reveal>{skywings.caption}</p>
      </div>

      <ul className={styles.showcaseGrid}>
        {skywings.views.map((view, index) => (
          <li key={view.title} className={styles.showcaseItem} data-wide={index === 0 || undefined} data-reveal="scale">
            <div className={styles.showcaseMedia}>
              <Media image={view.image} fill sizes={index === 0 ? "(max-width: 1400px) 100vw, 1330px" : "(max-width: 899px) 100vw, 660px"} />
            </div>
            <h3>{view.title}</h3>
            <p>{view.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
