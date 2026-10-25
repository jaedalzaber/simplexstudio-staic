"use client";

import { useRef, type CSSProperties } from "react";
import { Media } from "@/components/ui/media";
import type { ImageSlot } from "@/content/types";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./about.module.css";

/** Two rows of studio photos that slide in opposite directions as the page scrolls. */
export function Gallery({ rows }: { rows: readonly (readonly ImageSlot[])[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      gsap.utils.toArray<HTMLElement>(`.${styles.galleryTrack}`, ref.current).forEach((track, index) => {
        const [from, to] = index % 2 === 0 ? [-6, -30] : [-30, -6];
        gsap.fromTo(track, { xPercent: from }, {
          xPercent: to,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} className={styles.gallery} aria-label="Life at the studio">
      {rows.map((row, rowIndex) => (
        <div className={styles.galleryRow} key={rowIndex}>
          {/* The set repeats so the row never runs out while it slides. */}
          <div className={styles.galleryTrack}>
            {[...row, ...row, ...row].map((image, index) => (
              <figure className={styles.shot} key={index} style={{ "--ratio": image.width / image.height } as CSSProperties}>
                <Media image={index < row.length ? image : { ...image, alt: "" }} fill sizes="360px" />
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
