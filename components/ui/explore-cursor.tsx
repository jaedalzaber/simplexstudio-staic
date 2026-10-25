"use client";

import { useRef } from "react";
import { finePointerQuery, gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { ArrowUpRightIcon } from "./icons";
import styles from "./explore-cursor.module.css";

/**
 * Capsule that rests in its parent's corner and trails the pointer while it
 * moves over the parent. The parent must be positioned.
 */
export function ExploreCursor({ label = "Explore case" }: { label?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const cursor = ref.current;
    const host = cursor?.parentElement;
    if (!cursor || !host) return;
    const mm = gsap.matchMedia();
    mm.add(`${finePointerQuery} and ${motionQuery}`, () => {
      // The capsule stands in for the pointer while it follows.
      host.style.cursor = "none";
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.55, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.55, ease: "power3.out" });
      function onMove(event: PointerEvent) {
        const rect = host!.getBoundingClientRect();
        xTo(event.clientX - rect.left - cursor!.offsetLeft - cursor!.offsetWidth / 2);
        yTo(event.clientY - rect.top - cursor!.offsetTop - cursor!.offsetHeight / 2);
      }
      function onLeave() {
        xTo(0);
        yTo(0);
      }
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      return () => {
        host.style.cursor = "";
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <span ref={ref} className={styles.cursor} aria-hidden="true">
      <i />{label}<ArrowUpRightIcon />
    </span>
  );
}
