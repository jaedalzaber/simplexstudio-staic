"use client";

import Link from "next/link";
import { useRef, type ComponentProps } from "react";
import { classes } from "@/lib/classes";
import { finePointerQuery, gsap, motionQuery, useGSAP } from "@/lib/gsap";
import { ArrowUpRightIcon } from "./icons";
import styles from "./pill-link.module.css";

type PillLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: string;
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  /** Follows the pointer slightly on hover. */
  magnetic?: boolean;
};

/** The reference's "Book a call" capsule: blue dot, rolling label, and an arrow that flies out. */
export function PillLink({ children, tone = "dark", size = "lg", magnetic = true, className, ...props }: PillLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element || !magnetic) return;
    const mm = gsap.matchMedia();
    mm.add(`${finePointerQuery} and ${motionQuery}`, () => {
      const xTo = gsap.quickTo(element, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "y", { duration: 0.7, ease: "power3.out" });
      function onMove(event: PointerEvent) {
        const rect = element!.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.22);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.32);
      }
      function onLeave() {
        xTo(0);
        yTo(0);
      }
      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerleave", onLeave);
      return () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [magnetic] });

  return (
    <Link
      ref={ref}
      {...props}
      aria-label={props["aria-label"] ?? children}
      className={classes(styles.pill, className)}
      data-tone={tone}
      data-size={size}
    >
      <PillContent label={children} />
    </Link>
  );
}

function PillContent({ label }: { label: string }) {
  return (
    <>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label} aria-hidden="true">
        <span className={styles.labelTrack} data-text={label}>{label}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <ArrowUpRightIcon />
        <ArrowUpRightIcon />
      </span>
    </>
  );
}

type PillButtonProps = Omit<ComponentProps<"button">, "children"> & {
  children: string;
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
};

/** The same capsule as a `<button>`, for forms. */
export function PillButton({ children, tone = "dark", size = "md", type = "button", className, ...props }: PillButtonProps) {
  return (
    <button
      {...props}
      type={type}
      aria-label={props["aria-label"] ?? children}
      className={classes(styles.pill, className)}
      data-tone={tone}
      data-size={size}
    >
      <PillContent label={children} />
    </button>
  );
}
