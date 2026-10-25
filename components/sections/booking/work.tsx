import { Eyebrow } from "@/components/ui/eyebrow";
import { ExploreCursor } from "@/components/ui/explore-cursor";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { projects } from "@/content/booking";
import shared from "@/components/sections/solution/solution.module.css";

/** Approved client projects. Renders nothing until `projects` in content/booking.ts has entries. */
export function Work() {
  if (projects.length === 0) return null;

  return (
    <section id="work" className={`site-container ${shared.work}`} aria-labelledby="work-title">
      <div className={shared.sectionHead}>
        <Eyebrow>Selected work</Eyebrow>
        <h2 id="work-title" data-reveal="lines">Booking and service business projects</h2>
      </div>

      <ul className={shared.projectGrid}>
        {projects.map((project, index) => (
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
                  <span className={shared.visuallyHidden}> (opens in a new tab)</span>
                </a>
              </h3>
              <span className={shared.projectIndustry}>{project.kind}</span>
              <p>{project.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
