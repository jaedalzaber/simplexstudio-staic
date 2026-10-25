import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { configurationFeatures, configurationProject } from "@/content/real-estate";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./real-estate.module.css";

export function Configuration() {
  return (
    <section className={`site-container ${styles.configuration}`} aria-labelledby="configuration-title">
      <div className={styles.configurationCopy}>
        <div className={shared.sectionHead}>
          <Eyebrow>Layouts and finishes</Eyebrow>
          <h2 id="configuration-title" data-reveal="lines">3D interior <br />configurators</h2>
        </div>
        <p data-reveal>
          Let buyers compare layouts, materials, and fittings in a 3D space. They can review interior options
          before making an enquiry or requesting changes.
        </p>
        <ul className={styles.configurationFeatures} data-reveal="stagger">
          {configurationFeatures.map((feature) => (
            <li key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></li>
          ))}
        </ul>
      </div>
      <figure className={styles.configurationExample} data-reveal="scale">
        <div className={styles.configurationMedia}>
          <Media image={configurationProject.image} fill sizes="(max-width: 899px) 100vw, 740px" />
        </div>
        <figcaption>
          <strong>{configurationProject.name}</strong>
          <p>{configurationProject.text}</p>
          <a className={styles.enquire} href={configurationProject.url} target="_blank" rel="noopener noreferrer">
            View kitchen configurator<ArrowUpRightIcon />
            <span className={shared.visuallyHidden}> (opens in a new tab)</span>
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
