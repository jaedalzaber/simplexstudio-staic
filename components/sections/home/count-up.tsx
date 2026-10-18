"use client";

import { useRef } from "react";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";

/** Renders the final figure on the server, then counts up to it once it scrolls into view. */
export function CountUp({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      const counter = { value: 0 };
      element.textContent = `0${suffix}`;
      gsap.to(counter, {
        value,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: { trigger: element, start: "top 92%", once: true },
        onUpdate: () => { element.textContent = `${Math.round(counter.value)}${suffix}`; },
      });
      return () => { element.textContent = `${value}${suffix}`; };
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [value, suffix] });

  return <span ref={ref} className={className}>{value}{suffix}</span>;
}
