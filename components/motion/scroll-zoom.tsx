"use client";

import { useRef, type ReactNode } from "react";
import { classes } from "@/lib/classes";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./scroll-zoom.module.css";

/**
 * Frame that grows to full size and squares its corners as it scrolls into
 * view, while the media inside drifts for depth.
 */
export function ScrollZoom({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const frame = ref.current;
    if (!frame) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      gsap.fromTo(frame, { scale: 0.88, y: 40 }, {
        scale: 1,
        y: 0,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "top 30%", scrub: 0.8 },
      });
      gsap.fromTo(frame.firstElementChild, { scale: 1.14, yPercent: -4 }, {
        scale: 1.02,
        yPercent: 4,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return <div ref={ref} className={classes(styles.frame, className)}>{children}</div>;
}
