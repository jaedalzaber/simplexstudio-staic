"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap, motionQuery, SplitText, useGSAP } from "@/lib/gsap";

type RevealScopeProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "footer";
  children: ReactNode;
};

/**
 * Scroll-triggered entrances for server-rendered markup inside this element.
 *
 * Mark descendants with `data-reveal` and an optional type:
 * - `up` (default): fade and rise
 * - `lines`: masked line-by-line heading reveal
 * - `stagger`: rise each direct child in turn
 * - `scale`: media settles from a slight zoom
 * - `fade`: opacity only
 *
 * `data-reveal-delay` (seconds) and `data-reveal-start` (ScrollTrigger start)
 * fine-tune the entrance. Animations start only after this subtree has
 * hydrated, content stays visible without JavaScript, and nothing moves when
 * the visitor prefers reduced motion.
 */
export function RevealScope({ as: Tag = "div", children, ...props }: RevealScopeProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      const splits: SplitText[] = [];
      for (const element of gsap.utils.toArray<HTMLElement>("[data-reveal]", root)) {
        const type = element.dataset.reveal || "up";
        const delay = Number(element.dataset.revealDelay ?? 0);
        const scrollTrigger = { trigger: element, start: element.dataset.revealStart ?? "top 88%", once: true };

        if (type === "lines") {
          splits.push(SplitText.create(element, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.08,
              delay,
              scrollTrigger,
            }),
          }));
        } else if (type === "stagger") {
          gsap.from(element.children, { autoAlpha: 0, y: 44, duration: 1.2, ease: "expo.out", stagger: 0.1, delay, scrollTrigger });
        } else if (type === "scale") {
          gsap.from(element, { autoAlpha: 0, scale: 0.94, y: 48, duration: 1.5, ease: "expo.out", delay, scrollTrigger });
        } else if (type === "fade") {
          gsap.from(element, { autoAlpha: 0, duration: 1.4, ease: "power2.out", delay, scrollTrigger });
        } else {
          gsap.from(element, { autoAlpha: 0, y: 40, duration: 1.2, ease: "expo.out", delay, scrollTrigger });
        }
      }
      return () => splits.forEach((split) => split.revert());
    });
    return () => mm.revert();
  }, { scope: ref });

  return <Tag {...props} ref={(element: HTMLElement | null) => { ref.current = element; }}>{children}</Tag>;
}
