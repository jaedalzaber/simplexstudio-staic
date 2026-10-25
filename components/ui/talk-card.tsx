import { pages } from "@/content/pages";
import { classes } from "@/lib/classes";
import { PillLink } from "./pill-link";
import styles from "./talk-card.module.css";

/** Small dark call-to-action card with a drifting glow, for sidebars. */
export function TalkCard({ children = "Craft your idea into awesome digital experience", className }: { children?: string; className?: string }) {
  return (
    <div className={classes(styles.card, className)} data-surface="dark">
      <span className={styles.glow} aria-hidden="true" />
      <p>{children}</p>
      <PillLink href={pages.contact.path} tone="light" size="sm">Let’s talk</PillLink>
    </div>
  );
}
