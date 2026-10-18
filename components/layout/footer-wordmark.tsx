"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./footer.module.css";

/** Oversized outline wordmark that rises out of the glow as the footer scrolls in. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 1 },
      });
      timeline
        .fromTo(`.${styles.wordmark}`, { yPercent: 55, opacity: 0.2 }, { yPercent: 12, opacity: 1, ease: "none" }, 0)
        .fromTo(`.${styles.glow}`, { opacity: 0.25, scaleY: 0.6 }, { opacity: 1, scaleY: 1, ease: "none" }, 0);
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className={styles.end} aria-hidden="true">
      <div className={styles.glow} />
      <Image className={styles.wordmark} src="/footer%20logo%20big.svg" alt="" width={1318} height={329} />
    </div>
  );
}
