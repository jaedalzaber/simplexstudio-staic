"use client";

import { useRef, type ReactNode } from "react";
import { gsap, motionQuery, SplitText, useGSAP } from "@/lib/gsap";

/** Paragraph whose words fill from a pale tint to ink as it scrolls through the viewport. */
export function Statement({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      const split = SplitText.create(ref.current, {
        type: "words",
        autoSplit: true,
        onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.16 }, {
          opacity: 1,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
        }),
      });
      return () => split.revert();
    });
    return () => mm.revert();
  }, { scope: ref });

  return <p ref={ref} className={className}>{children}</p>;
}
