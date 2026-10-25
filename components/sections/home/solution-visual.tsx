"use client";

import Image from "next/image";
import { useRef } from "react";
import { Logo } from "@/components/brand/logo";
import { CheckIcon } from "@/components/ui/icons";
import type { Solution } from "@/content/solutions";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./solutions.module.css";

/**
 * Dark showcase card in the style of the editorial covers: mono label, dotted
 * orbits, a glow pooling in the corner, and the product screen tilting upright
 * as it scrolls into view.
 */
export function SolutionVisual({ solution, index }: { solution: Solution; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      gsap.fromTo(`.${styles.shot}`, { rotateX: 22, y: 60, scale: 0.86, transformPerspective: 1200 }, {
        rotateX: 0,
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center 55%", scrub: 0.8 },
      });
      gsap.fromTo(`.${styles.glow}`, { opacity: 0.4, scale: 0.8 }, {
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "center center", scrub: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className={styles.visual}>
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.orbit} data-orbit="a" aria-hidden="true" />
      <span className={styles.orbit} data-orbit="b" aria-hidden="true" />
      <span className={styles.visualLabel} aria-hidden="true">Solution {String(index + 1).padStart(2, "0")}</span>
      <Logo width={74} alt="" className={styles.visualLogo} />
      <div className={styles.shot}>
        <div className={styles.shotInner}>
          <Image src={solution.image.src} alt={solution.image.alt} width={solution.image.width} height={solution.image.height} sizes="(max-width: 999px) 80vw, 560px" />
        </div>
      </div>
      <span className={styles.chip} aria-hidden="true"><CheckIcon />{solution.label}</span>
    </div>
  );
}
