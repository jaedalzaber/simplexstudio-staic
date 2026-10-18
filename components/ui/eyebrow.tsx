import type { ReactNode } from "react";
import { classes } from "@/lib/classes";
import styles from "./eyebrow.module.css";

export function Eyebrow({ children, tone = "dark", className }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={classes(styles.eyebrow, className)} data-tone={tone}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}
