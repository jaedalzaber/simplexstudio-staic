import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Import GSAP through this module so plugins are registered exactly once.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

export const motionQuery = "(prefers-reduced-motion: no-preference)";
export const finePointerQuery = "(hover: hover) and (pointer: fine)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
