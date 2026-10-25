import type { CSSProperties } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons";
import { benefits, team } from "@/content/ecommerce";
import styles from "@/components/sections/solution/solution.module.css";

export function OneTeam() {
  return (
    <section className={`site-container ${styles.oneTeam}`} aria-labelledby="team-title">
      <div className={styles.oneTeamCopy}>
        <Eyebrow>In-house team</Eyebrow>
        <h2 id="team-title" data-reveal="lines">One team for design <br />and development</h2>
        <p data-reveal>
          Our designers, 3D artists, developers, and marketers manage your project together. You work with one
          in-house team for branding, product content, and store development.
        </p>
        <ul className={styles.benefits} data-reveal="stagger">
          {benefits.map((benefit) => (
            <li key={benefit.title}>
              <span className={styles.benefitIcon} aria-hidden="true"><CheckIcon /></span>
              <div><strong>{benefit.title}</strong> {benefit.text}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative team diagram; the adjacent copy summarises the disciplines. */}
      <div className={styles.orbit} aria-hidden="true" data-reveal="scale">
        <span className={styles.orbitPath} />
        <div className={styles.orbitRing}>
          {team.map((role, index) => (
            <span className={styles.orbitItem} style={{ "--angle": `${(360 / team.length) * index}deg` } as CSSProperties} key={role}>
              <span>{role}</span>
            </span>
          ))}
        </div>
        <div className={styles.orbitCore}>
          <strong>25+</strong>
          <span>specialists<br />one studio</span>
        </div>
      </div>
    </section>
  );
}
