"use client";

import { useRef } from "react";
import { finePointerQuery, gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./hero.module.css";

/**
 * Soft light-blue clouds that drift continuously and lean toward the pointer.
 * The static gradients render without JavaScript; GSAP only adds movement.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      const blobs = gsap.utils.toArray<HTMLElement>(`.${styles.blob}`);
      blobs.forEach((blob, index) => {
        gsap.to(blob, {
          xPercent: gsap.utils.random(-14, 14),
          yPercent: gsap.utils.random(-18, 18),
          scale: gsap.utils.random(0.88, 1.18),
          rotation: gsap.utils.random(-25, 25),
          duration: gsap.utils.random(7, 12),
          delay: index * -1.7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        });
      });
    });

    mm.add(`${motionQuery} and ${finePointerQuery}`, () => {
      const field = ref.current;
      const panel = field?.parentElement;
      if (!field || !panel) return;
      const xTo = gsap.quickTo(field, "x", { duration: 2.2, ease: "power3.out" });
      const yTo = gsap.quickTo(field, "y", { duration: 2.2, ease: "power3.out" });
      const lightX = gsap.quickTo(field, "--light-x", { duration: 1.2, ease: "power3.out" });
      const lightY = gsap.quickTo(field, "--light-y", { duration: 1.2, ease: "power3.out" });
      function onMove(event: PointerEvent) {
        const rect = panel!.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        xTo((px - 0.5) * 40);
        yTo((py - 0.5) * 28);
        lightX(px * 100);
        lightY(py * 100);
      }
      panel.addEventListener("pointermove", onMove);
      return () => panel.removeEventListener("pointermove", onMove);
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className={styles.backdrop} aria-hidden="true">
      <span className={styles.blob} data-blob="left" />
      <span className={styles.blob} data-blob="right" />
      <span className={styles.blob} data-blob="low" />
      <span className={styles.blob} data-blob="top" />
      <span className={styles.light} />
    </div>
  );
}
