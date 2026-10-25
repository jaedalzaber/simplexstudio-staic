import Link from "next/link";
import { ProcessSteps } from "@/components/sections/solution/process-steps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { capabilities, steps } from "@/content/manufacturing";
import { pages } from "@/content/pages";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./manufacturing.module.css";

export function Capabilities() {
  return (
    <section className={`site-container ${shared.process}`} aria-labelledby="team-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Capabilities and delivery</Eyebrow>
          <h2 id="team-title" data-reveal="lines">One team for software, <br />3D, and implementation</h2>
        </div>
        <p data-reveal>
          Our designers, 3D artists, and developers work together on the interfaces, visual assets, and software behind
          your operation. We plan the connections, build the agreed system, and support your team after launch.
        </p>
      </div>

      <ul className={styles.capabilities} data-reveal="stagger">
        {capabilities.map((capability) => (
          <li key={capability.title}>
            <h3>{capability.title}</h3>
            <p>{capability.text}</p>
          </li>
        ))}
      </ul>

      <ProcessSteps steps={steps} />

      <p className={styles.note} data-reveal>
        Data preparation, user testing, training, and a phased rollout are part of delivery. Shared 3D assets save
        repeated work, but each channel needs its own geometry, detail, materials, interactions, identifiers, and versions.
      </p>
      <Link href={pages.expertise.path} className={styles.capabilityLink}>
        Explore our capabilities
        <ArrowUpRightIcon />
      </Link>
    </section>
  );
}
