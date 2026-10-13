"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./overlay-scrollbar.module.css";

export function OverlayScrollbar() {
  const lenis = useLenis();
  const pathname = usePathname();
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const geometry = useRef({ limit: 0, travel: 0, thumbHeight: 0, thumbTop: 0 });
  const drag = useRef<{ pointerId: number; offset: number } | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;
    let frame = 0;

    function update() {
      frame = 0;
      if (!rail || !thumb) return;
      const viewport = window.innerHeight;
      const contentHeight = document.documentElement.scrollHeight;
      const limit = Math.max(0, contentHeight - viewport);
      rail.hidden = limit <= 1;
      if (rail.hidden) {
        geometry.current = { limit: 0, travel: 0, thumbHeight: 0, thumbTop: 0 };
        rail.setAttribute("aria-valuenow", "0");
        return;
      }

      const trackHeight = rail.clientHeight;
      const thumbHeight = Math.min(trackHeight, Math.max(32, trackHeight * viewport / contentHeight));
      const travel = trackHeight - thumbHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / limit));
      const thumbTop = progress * travel;
      geometry.current = { limit, travel, thumbHeight, thumbTop };
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`;
      rail.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    // Only replace native chrome after the interactive replacement is mounted.
    // Without JavaScript the native scrollbar remains available.
    document.documentElement.classList.add("has-overlay-scrollbar");
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.documentElement);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      document.documentElement.classList.remove("has-overlay-scrollbar");
      rail.hidden = true;
      delete rail.dataset.dragging;
      drag.current = null;
    };
  }, [lenis, pathname]);

  function scrollTo(target: number, immediate = false) {
    const value = Math.max(0, Math.min(geometry.current.limit, target));
    if (lenis) lenis.scrollTo(value, { immediate });
    else window.scrollTo({ top: value, behavior: "instant" });
  }

  function moveThumb(clientY: number) {
    if (!drag.current || !railRef.current || geometry.current.travel <= 0) return;
    const position = clientY - railRef.current.getBoundingClientRect().top - drag.current.offset;
    scrollTo(position / geometry.current.travel * geometry.current.limit, true);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    const rect = event.currentTarget.getBoundingClientRect();
    const { thumbTop, thumbHeight } = geometry.current;
    drag.current = {
      pointerId: event.pointerId,
      offset: event.target === thumbRef.current ? event.clientY - rect.top - thumbTop : thumbHeight / 2,
    };
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.setPointerCapture(event.pointerId);
    moveThumb(event.clientY);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = lenis?.targetScroll ?? window.scrollY;
    const page = window.innerHeight * 0.85;
    const targets: Record<string, number> = {
      ArrowUp: current - 40,
      ArrowDown: current + 40,
      PageUp: current - page,
      PageDown: current + page,
      Home: 0,
      End: geometry.current.limit,
      " ": current + (event.shiftKey ? -page : page),
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    scrollTo(target);
  }

  return (
    <div
      ref={railRef}
      className={styles.scrollbar}
      role="scrollbar"
      aria-label="Page scroll"
      aria-controls="main-content"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={0}
      hidden
      onPointerDown={onPointerDown}
      onPointerMove={(event) => { if (drag.current?.pointerId === event.pointerId) moveThumb(event.clientY); }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={(event) => { if (drag.current?.pointerId === event.pointerId) { drag.current = null; delete event.currentTarget.dataset.dragging; } }}
      onKeyDown={onKeyDown}
    >
      <div ref={thumbRef} className={styles.thumb} />
    </div>
  );
}
