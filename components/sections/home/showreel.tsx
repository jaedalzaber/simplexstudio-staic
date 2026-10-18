"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import { gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./showreel.module.css";

/**
 * Product showreel. Drop the clip at /public/videos/showreel.mp4 (and optionally
 * showreel.webm); until then the poster frame from the design is shown.
 */
export function Showreel() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Respect reduced motion: keep the poster still unless the visitor presses play.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    // Only spend bandwidth while the frame is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: 0.15 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionQuery, () => {
      gsap.fromTo(`.${styles.frame}`,
        { scale: 0.88, borderRadius: 64, y: 40 },
        { scale: 1, borderRadius: 30, y: 0, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "top 25%", scrub: 0.8 } });
      gsap.fromTo(`.${styles.media}`,
        { scale: 1.12 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  }

  return (
    <section ref={sectionRef} className={styles.showreel} aria-label="Product showreel">
      <div className={styles.frame}>
        <video
          ref={videoRef}
          className={styles.media}
          poster="/images/home/dashboard-poster.webp"
          width={1390}
          height={810}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Dashboard interface designed by Simplex Studio, showing wallet balances, token data, and liquidity pairs"
          onCanPlay={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/videos/showreel.webm" type="video/webm" />
          <source src="/videos/showreel.mp4" type="video/mp4" />
        </video>
        {ready && (
          <button type="button" className={styles.control} onClick={toggle} aria-label={playing ? "Pause showreel" : "Play showreel"}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </section>
  );
}
