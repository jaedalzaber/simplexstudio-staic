import { Eyebrow } from "@/components/ui/eyebrow";
import { builderViews } from "@/content/booking";
import shared from "@/components/sections/solution/solution.module.css";
import { FormBuilderPreview, PageBuilderPreview } from "./interface-previews";
import styles from "./booking.module.css";

const previews = [<FormBuilderPreview key="form" />, <PageBuilderPreview key="page" />];

/** Each editor beside what customers see, for the same example restaurant. */
export function Builders() {
  return (
    <section className={`site-container ${styles.builders}`} aria-labelledby="builders-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Forms and websites</Eyebrow>
          <h2 id="builders-title" data-reveal="lines">Custom booking forms <br />and business websites</h2>
        </div>
        <p data-reveal>
          Create booking forms and pages that fit your services and brand. Connect the information customers submit
          with the tools your team uses.
        </p>
      </div>

      <div className={styles.builderList}>
        {builderViews.map((view, index) => (
          <figure className={styles.builder} key={view.title}>
            <div className={styles.builderStage} data-reveal="scale">{previews[index]}</div>
            <figcaption data-reveal>
              <span className={shared.index} aria-hidden="true">/0{index + 1}</span>
              <h3>{view.title}</h3>
              <p>{view.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
