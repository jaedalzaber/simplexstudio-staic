"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./solution.module.css";

type Step = { title: string; text: string };

/** Numbered steps on a line that fills as the reader scrolls; each step lights up as the line reaches it. */
export function ProcessSteps({ steps }: { steps: readonly Step[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(() => {
    const list = ref.current;
    if (!list) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      list.dataset.animated = "";
      const items = gsap.utils.toArray<HTMLElement>(`.${styles.step}`, list);
      const progress = { value: 0 };
      // Each step lights up once the line reaches its share of the way along.
      gsap.to(progress, {
        value: 1,
        ease: "none",
        scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 50%", scrub: 0.6 },
        onUpdate: () => {
          list.style.setProperty("--progress", String(progress.value));
          items.forEach((step, index) => step.toggleAttribute("data-reached", progress.value >= index / items.length + 0.02));
        },
      });
      list.style.setProperty("--progress", "0");
      return () => {
        delete list.dataset.animated;
        list.style.removeProperty("--progress");
        items.forEach((step) => step.removeAttribute("data-reached"));
      };
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <ol ref={ref} className={styles.steps} style={{ "--steps": steps.length } as CSSProperties}>
      {steps.map((step, index) => (
        <li className={styles.step} key={step.title}>
          <span className={styles.stepDot} aria-hidden="true">0{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
