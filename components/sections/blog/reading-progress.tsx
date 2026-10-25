"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import styles from "./article.module.css";

/** Wraps the article body; a thin bar along the top of the window fills as it is read. */
export function ReadingProgress({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 140px", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className={className}>
      <motion.div className={styles.progress} style={{ scaleX }} aria-hidden="true" />
      {children}
    </div>
  );
}
