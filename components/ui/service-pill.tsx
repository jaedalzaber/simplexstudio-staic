import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { classes } from "@/lib/classes";
import { ArrowRightIcon } from "./icons";
import styles from "./service-pill.module.css";

type ServicePillProps = {
  href: Route;
  image: string;
  /** Names the destination for assistive technology, e.g. "View Design service". */
  label: string;
  tone?: "light" | "dark";
  className?: string;
};

/** "View Service" capsule; on hover the artwork fades in and the arrow knob travels across. */
export function ServicePill({ href, image, label, tone = "light", className }: ServicePillProps) {
  return (
    <Link href={href} className={classes(styles.pill, className)} data-tone={tone} aria-label={label}>
      <span className={styles.media} aria-hidden="true">
        <Image src={image} alt="" fill sizes="360px" />
      </span>
      <span className={styles.text} aria-hidden="true">
        <i />View Service<i />
      </span>
      <span className={styles.knob} aria-hidden="true">
        <svg className={styles.ring} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" />
        </svg>
        <ArrowRightIcon />
      </span>
    </Link>
  );
}
