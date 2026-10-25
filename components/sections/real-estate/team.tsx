import { ProcessSteps } from "@/components/sections/solution/process-steps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { steps } from "@/content/real-estate";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./real-estate.module.css";

export function Team() {
  return (
    <section className={`site-container ${shared.process}`} aria-labelledby="team-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>In-house team</Eyebrow>
          <h2 id="team-title" data-reveal="lines">One team for visuals, <br />websites, and software</h2>
        </div>
        <p data-reveal>
          Our 3D artists, animators, designers, and developers work together. You have one point of contact for
          modelling, rendering, configurators, the website, and management tools, with support after launch.
        </p>
      </div>
      <ProcessSteps steps={steps} />
    </section>
  );
}
