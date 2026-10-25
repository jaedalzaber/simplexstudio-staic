import type { CSSProperties } from "react";
import { CountUp } from "@/components/motion/count-up";
import { classes } from "@/lib/classes";
import styles from "./stat-row.module.css";

type Stat = { value: number; suffix: string; label: string };

/** Counting figures in a row. Inside a `RevealScope`, the items also rise in turn. */
export function StatRow({ stats, columns = 4, className }: { stats: readonly Stat[]; columns?: 3 | 4; className?: string }) {
  return (
    <dl className={classes(styles.stats, className)} style={{ "--columns": columns } as CSSProperties} data-reveal="stagger">
      {stats.map((stat) => (
        <div className={styles.stat} key={stat.label}>
          <dt>{stat.label}</dt>
          <dd><CountUp value={stat.value} suffix={stat.suffix} /></dd>
        </div>
      ))}
    </dl>
  );
}
