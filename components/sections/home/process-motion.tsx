"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionQuery, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import styles from "./process.module.css";

/**
 * PROCESS letters stand up one by one, the photo unmasks with a gentle
 * parallax, and the step nearest the middle of the screen is highlighted.
 */
export function ProcessMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(motionQuery, () => {
      const word = root.querySelector(`.${styles.word}`);
      const split = SplitText.create(word, { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        rotate: 6,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: word, start: "top 85%", once: true },
      });

      const media = root.querySelector(`.${styles.media}`);
      const image = root.querySelector(`.${styles.media} img`);
      gsap.fromTo(media, { clipPath: "inset(18% 12% 18% 12% round 26px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 26px)",
        ease: "none",
        scrollTrigger: { trigger: media, start: "top 95%", end: "top 35%", scrub: 0.8 },
      });
      gsap.fromTo(image, { yPercent: -6, scale: 1.16 }, {
        yPercent: 6,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Highlight the step crossing the centre of the viewport.
      root.setAttribute("data-enhanced", "");
      const steps = gsap.utils.toArray<HTMLElement>(`.${styles.step}`, root);
      const triggers = steps.map((step) => ScrollTrigger.create({
        trigger: step,
        start: "top 62%",
        end: "bottom 62%",
        onToggle: ({ isActive }) => step.toggleAttribute("data-active", isActive),
      }));
      gsap.from(steps, {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: steps[0], start: "top 90%", once: true },
      });

      return () => {
        split.revert();
        triggers.forEach((trigger) => trigger.kill());
        root.removeAttribute("data-enhanced");
        steps.forEach((step) => step.removeAttribute("data-active"));
      };
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} className={className} aria-label="Our process">
      {children}
    </section>
  );
}
