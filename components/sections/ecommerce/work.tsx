import { Eyebrow } from "@/components/ui/eyebrow";
import { ExploreCursor } from "@/components/ui/explore-cursor";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { PillLink } from "@/components/ui/pill-link";
import { projects } from "@/content/ecommerce";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

export function Work() {
  return (
    <section id="work" className={`site-container ${styles.work}`} aria-labelledby="work-title">
      <div className={styles.workHead}>
        <div className={styles.sectionHead}>
          <Eyebrow>Selected work</Eyebrow>
          <h2 id="work-title" data-reveal="lines">Ecommerce and <br />product websites</h2>
        </div>
        <PillLink href={pages.work.path} size="md">See all work</PillLink>
      </div>
      <ul className={styles.projectGrid}>
        {projects.map((project, index) => (
          <li className={styles.project} data-wide={index === 0 || undefined} key={project.name} data-reveal="scale">
            {/* The name link below carries the label; this duplicate stays out of the tab order. */}
            <a href={project.url} className={styles.projectMedia} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
              <Media image={project.image} fill sizes={index === 0 ? "(max-width: 1400px) 100vw, 1330px" : "(max-width: 899px) 100vw, 660px"} />
              <ExploreCursor label="Visit site" />
            </a>
            <div className={styles.projectInfo}>
              <h3>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.name}
                  <ArrowUpRightIcon />
                  <span className={styles.visuallyHidden}> (opens in a new tab)</span>
                </a>
              </h3>
              <span className={styles.projectIndustry}>{project.industry}</span>
              <p>{project.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
