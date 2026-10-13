"use client";

import { ReactLenis } from "lenis/react";
import type { LenisOptions } from "lenis";
import type { ReactNode } from "react";
import { OverlayScrollbar } from "./overlay-scrollbar";

const options: LenisOptions = {
  autoRaf: true,
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
  respectReducedMotion: true,
  stopInertiaOnNavigate: true,
  anchors: { offset: -110 },
};

export function ScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={options}>
      {children}
      <OverlayScrollbar />
    </ReactLenis>
  );
}
