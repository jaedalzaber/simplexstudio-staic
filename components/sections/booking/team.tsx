import Link from "next/link";
import { ProcessSteps } from "@/components/sections/solution/process-steps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { steps } from "@/content/booking";
import { pages } from "@/content/pages";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./booking.module.css";

export function Team() {
  return (
    <section className={`site-container ${shared.process}`} aria-labelledby="team-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>In-house delivery and support</Eyebrow>
          <h2 id="team-title" data-reveal="lines">One team for design, <br />3D, and software</h2>
        </div>
        <p data-reveal>
          Our designers, 3D artists, and developers work together on your website, booking experience, and management
          tools. You have one point of contact from planning through launch and ongoing support.
        </p>
      </div>
      <ProcessSteps steps={steps} />
      <Link href={pages.expertise.path} className={styles.capabilityLink}>
        Explore our design, 3D, and development capabilities
        <ArrowUpRightIcon />
      </Link>
    </section>
  );
}
