"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { classes } from "@/lib/classes";
import styles from "./filter-tabs.module.css";

type FilterTabsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Names the group for assistive technology. */
  label: string;
  /** Id of the element the filter updates. */
  controls?: string;
  size?: "md" | "lg";
  className?: string;
};

/** Pill toggles; the dark fill glides to the chosen option. */
export function FilterTabs<T extends string>({ options, value, onChange, label, controls, size = "lg", className }: FilterTabsProps<T>) {
  const id = useId();
  return (
    <div className={classes(styles.filters, className)} role="group" aria-label={label} data-size={size}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            className={styles.filter}
            aria-pressed={selected}
            aria-controls={controls}
            onClick={() => onChange(option)}
          >
            {selected && <motion.span layoutId={`${id}-fill`} className={styles.fill} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />}
            <span className={styles.label}>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
