"use client";

import { useRef, type ReactNode } from "react";
import { finePointerQuery, gsap, motionQuery, useGSAP } from "@/lib/gsap";

/**
 * Feeds the pointer position to every `[data-spotlight]` child as `--mx`/`--my`
 * so their borders and glows light up near the cursor, and tilts them slightly.
 */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-spotlight]", root);
    const mm = gsap.matchMedia();

    mm.add(motionQuery, () => {
      gsap.from(cards, {
        y: 80,
        autoAlpha: 0,
        rotateX: -12,
        transformPerspective: 900,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 82%", once: true },
      });
    });

    mm.add(`${finePointerQuery} and ${motionQuery}`, () => {
      function onMove(event: PointerEvent) {
        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          card.style.setProperty("--my", `${event.clientY - rect.top}px`);
        }
      }
      const tilts = cards.map((card) => {
        const rx = gsap.quickTo(card, "rotateX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotateY", { duration: 0.8, ease: "power3.out" });
        gsap.set(card, { transformPerspective: 1000 });
        function onCardMove(event: PointerEvent) {
          const rect = card.getBoundingClientRect();
          ry(((event.clientX - rect.left) / rect.width - 0.5) * 6);
          rx(((event.clientY - rect.top) / rect.height - 0.5) * -6);
        }
        function onCardLeave() {
          rx(0);
          ry(0);
        }
        card.addEventListener("pointermove", onCardMove);
        card.addEventListener("pointerleave", onCardLeave);
        return () => {
          card.removeEventListener("pointermove", onCardMove);
          card.removeEventListener("pointerleave", onCardLeave);
        };
      });
      root.addEventListener("pointermove", onMove);
      return () => {
        root.removeEventListener("pointermove", onMove);
        tilts.forEach((cleanup) => cleanup());
      };
    });

    return () => mm.revert();
  }, { scope: ref });

  return <div ref={ref} className={className}>{children}</div>;
}
