"use client";

import { useRef } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BriefcaseIcon, CompassIcon, PuzzleIcon, TargetIcon } from "@/components/ui/icons";
import type { Value } from "@/content/about";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./about.module.css";

const icons = { briefcase: BriefcaseIcon, compass: CompassIcon, target: TargetIcon, puzzle: PuzzleIcon };
// Each card drifts at its own pace so the cluster feels layered.
const speeds = [-26, 18, -14, 30];

/** Value cards scattered around the heading, floating at different depths while scrolling. */
export function Values({ values }: { values: readonly Value[] }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`(min-width: 1100px) and ${motionQuery}`, () => {
      gsap.utils.toArray<HTMLElement>(`.${styles.value}`, ref.current).forEach((card, index) => {
        gsap.fromTo(card, { yPercent: speeds[index % speeds.length] }, {
          yPercent: -speeds[index % speeds.length],
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });
    });
    mm.add(motionQuery, () => {
      gsap.from(gsap.utils.toArray(`.${styles.valueCard}`, ref.current), {
        autoAlpha: 0,
        y: 70,
        scale: 0.94,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      gsap.from(`.${styles.valuesHead}`, {
        autoAlpha: 0,
        scale: 0.9,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: `.${styles.valuesHead}`, start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} className={`site-container ${styles.values}`} aria-labelledby="values-title">
      <div className={styles.valuesHead}>
        <Eyebrow>Why us</Eyebrow>
        <h2 id="values-title">Our Values</h2>
      </div>
      <ul className={styles.valueList}>
        {values.map((value, index) => {
          const Icon = icons[value.icon];
          return (
            <li className={styles.value} data-index={index} key={value.title}>
              <article className={styles.valueCard}>
                <div className={styles.valueTop}>
                  <span className={styles.valueIcon}><Icon /></span>
                  <span className={styles.valueNumber} aria-hidden="true">/0{index + 1}</span>
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
