import Link from "next/link";
import { ExploreCursor } from "@/components/ui/explore-cursor";
import { GlobeIcon, MonitorIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import type { WorkTile } from "@/content/work";
import { classes } from "@/lib/classes";
import styles from "./work-card.module.css";

type WorkCardProps = {
  entry: WorkTile;
  wide?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Project tile: cover, industry and location, and title. Links to the case study when one exists. */
export function WorkCard({ entry, wide = false, headingLevel: Heading = "h2", className }: WorkCardProps) {
  const href = entry.href;
  const sizes = wide ? "(max-width: 899px) 100vw, 825px" : "(max-width: 899px) 100vw, 620px";

  return (
    <article className={classes(styles.card, className)} data-wide={wide || undefined} data-reveal>
      {href ? (
        // The title link carries the name; this duplicate stays out of the tab order.
        <Link href={href} className={styles.media} tabIndex={-1} aria-hidden="true">
          <Media image={entry.cover} sizes={sizes} className={styles.image} />
          <ExploreCursor />
        </Link>
      ) : (
        <div className={styles.media}>
          <Media image={entry.cover} sizes={sizes} className={styles.image} />
        </div>
      )}
      <ul className={styles.meta}>
        <li><MonitorIcon />{entry.industry}</li>
        <li><GlobeIcon />{entry.location}</li>
      </ul>
      <Heading className={styles.title}>
        {href ? <Link href={href}>{entry.title}</Link> : entry.title}
      </Heading>
    </article>
  );
}
