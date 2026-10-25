import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { managementGroups, managementRoles, managementScreenshot } from "@/content/real-estate";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./real-estate.module.css";

/** Staff-facing tools, set in a dark band to keep them distinct from the buyer-facing selector. */
export function Management() {
  return (
    <section className={styles.management} data-surface="dark" aria-labelledby="management-title">
      <span className={styles.managementGlow} aria-hidden="true" />
      <div className="site-container">
        <div className={styles.splitHead}>
          <div className={shared.sectionHead}>
            <Eyebrow tone="light">For your team</Eyebrow>
            <h2 id="management-title" data-reveal="lines">Listings, sales, and <br />property management</h2>
          </div>
          <p data-reveal>
            Manage property records, listings, enquiries, and daily tasks in connected tools. Give staff, tenants, and
            owners the access they need, with web and mobile interfaces suited to their roles.
          </p>
        </div>

        <div className={styles.groups} data-reveal="stagger">
          {managementGroups.map((group, index) => (
            <article className={styles.group} key={group.title}>
              <span className={shared.index} aria-hidden="true">/0{index + 1}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => <li key={item}><CheckIcon />{item}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.roles} data-reveal>
          <span>Access for</span>
          {managementRoles.map((role) => <span className={styles.role} key={role}>{role}</span>)}
          <span>on web and mobile</span>
        </div>

        {managementScreenshot && (
          <div className={styles.screenshot} data-reveal="scale">
            <Media image={managementScreenshot} sizes="(max-width: 1400px) 100vw, 1330px" />
          </div>
        )}

        <p className={styles.scopeNote} data-reveal>Your project scope includes only the modules your team needs.</p>
      </div>
    </section>
  );
}
