"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SkyBackdrop } from "@/components/ui/sky-backdrop";
import type { Discipline } from "@/content/about";
import styles from "./about-hero.module.css";

const title = "We scale and transform businesses by";

/**
 * Hovering (or focusing) Design, Develop, or Growth raises a photo card
 * behind that word, and the card glides between words. A white copy of the
 * heading, clipped to the card, keeps any overlapping heading text readable.
 * On touch screens the cards take turns on their own.
 */
export function AboutHero({ disciplines, children }: { disciplines: readonly Discipline[]; children?: ReactNode }) {
  const [active, setActive] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(0);
  const columnsRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);

  const show = useCallback((index: number | null) => {
    setActive(index);
    if (index !== null) setLastActive(index);
  }, []);

  // Clip the white heading copy to the card's rectangle, collapsed to its bottom edge when hidden.
  const syncOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    // The card is the first child; the word columns follow it.
    const column = columnsRef.current?.children[(active ?? lastActive) + 1];
    if (!overlay || !column) return;
    const box = overlay.getBoundingClientRect();
    const card = column.getBoundingClientRect();
    const top = (active === null ? card.bottom : card.top) - box.top;
    const right = box.right - card.right;
    const bottom = box.bottom - card.bottom;
    const left = card.left - box.left;
    overlay.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round var(--card-radius))`;
  }, [active, lastActive]);

  useLayoutEffect(syncOverlay, [syncOverlay]);

  useEffect(() => {
    const observer = new ResizeObserver(syncOverlay);
    if (columnsRef.current) observer.observe(columnsRef.current);
    return () => observer.disconnect();
  }, [syncOverlay]);

  // Without hover, take turns so touch visitors still see each photo.
  useEffect(() => {
    const touch = window.matchMedia("(hover: none)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!touch.matches || calm.matches) return;
    let step = 0;
    const timer = window.setInterval(() => {
      show(step % disciplines.length);
      step++;
    }, 2600);
    return () => window.clearInterval(timer);
  }, [disciplines.length, show]);

  const current = active ?? lastActive;

  return (
    <section className={styles.hero} aria-labelledby="about-title">
      <div className={styles.panel}>
        <SkyBackdrop />
        <div className={`site-container ${styles.inner}`} style={{ "--active": current } as CSSProperties}>
          <div className={styles.titleWrap}>
            <h1 id="about-title" className={styles.title}>{title}</h1>
            <span ref={overlayRef} className={styles.titleOverlay} aria-hidden="true">{title}</span>
          </div>

          <div className={styles.columns} ref={columnsRef} onPointerLeave={() => show(null)}>
            <div className={styles.card} data-visible={active !== null} aria-hidden="true">
              {disciplines.map((discipline, index) => discipline.image.src && (
                <Image
                  key={discipline.label}
                  src={discipline.image.src}
                  alt=""
                  fill
                  sizes="(max-width: 799px) 33vw, 293px"
                  loading="eager"
                  className={styles.cardImage}
                  data-current={index === current}
                />
              ))}
            </div>
            {disciplines.map((discipline, index) => (
              <Link
                key={discipline.label}
                href={discipline.href}
                className={styles.column}
                data-active={active === index}
                onPointerEnter={(event) => event.pointerType === "mouse" && show(index)}
                onFocus={() => show(index)}
                onBlur={() => show(null)}
              >
                <span className={styles.word}>{discipline.label}</span>
              </Link>
            ))}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
