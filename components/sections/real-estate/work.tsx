import { Eyebrow } from "@/components/ui/eyebrow";
import { ExploreCursor } from "@/components/ui/explore-cursor";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { featuredProjects, relatedProjects } from "@/content/real-estate";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./real-estate.module.css";

const newTab = <span className={shared.visuallyHidden}> (opens in a new tab)</span>;

export function Work() {
  return (
    <section id="work" className={`site-container ${shared.work}`} aria-labelledby="work-title">
      <div className={shared.sectionHead}>
        <Eyebrow>Selected work</Eyebrow>
        <h2 id="work-title" data-reveal="lines">Selected real estate work</h2>
      </div>

      <ul className={shared.projectGrid}>
        {featuredProjects.map((project, index) => (
          <li className={shared.project} data-wide={index === 0 || undefined} key={project.name} data-reveal="scale">
            {/* Preview image only; the client site opens in a new tab. The name link carries the label. */}
            <a href={project.url} className={shared.projectMedia} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
              <Media image={project.image} fill sizes={index === 0 ? "(max-width: 1400px) 100vw, 1330px" : "(max-width: 899px) 100vw, 660px"} />
              <ExploreCursor label="Open site" />
            </a>
            <div className={shared.projectInfo}>
              <h3>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.name}
                  <ArrowUpRightIcon />
                  {newTab}
                </a>
              </h3>
              <span className={shared.projectIndustry}>{project.kind}</span>
              <p>{project.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.related}>
        <h3 className={styles.relatedTitle}>Related visualization work</h3>
        <ul data-reveal="stagger">
          {relatedProjects.map((project) => (
            <li key={project.name}>
              <a href={project.url} className={styles.relatedCard} target="_blank" rel="noopener noreferrer">
                <span className={styles.relatedMedia}>
                  <Media image={{ ...project.image, alt: "" }} fill sizes="160px" />
                </span>
                <span className={styles.relatedText}>
                  <strong>{project.name}<ArrowUpRightIcon /></strong>
                  <span>{project.text}</span>
                </span>
                {newTab}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
