"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { OverlayScrollbar } from "./overlay-scrollbar";

const options: LenisOptions = {
  // GSAP's ticker drives Lenis so ScrollTrigger and smooth scrolling share one frame.
  autoRaf: false,
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
  respectReducedMotion: true,
  stopInertiaOnNavigate: true,
  anchors: { offset: -110 },
};

function GsapLenisBridge() {
  const lenis = useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    if (!lenis) return;
    function update(time: number) {
      lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [lenis]);

  return null;
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={options}>
      <GsapLenisBridge />
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <OverlayScrollbar />
    </ReactLenis>
  );
}
