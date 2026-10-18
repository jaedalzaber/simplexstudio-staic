"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { ArrowUpRightIcon, GlobeIcon, MonitorIcon, TrendUpIcon } from "@/components/ui/icons";
import { caseStudies } from "@/content/home";
import { pages } from "@/content/pages";
import { finePointerQuery, gsap, motionQuery, useGSAP } from "@/lib/gsap";
import styles from "./case-studies.module.css";

/**
 * Case studies pinned with `position: sticky`; each new card slides over the
 * previous one, which recedes as it is covered.
 */
export function CaseStack() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(`(min-width: 900px) and ${motionQuery}`, () => {
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.card}`);
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        if (!next) return;
        gsap.to(card.querySelector(`.${styles.cardInner}`), {
          scale: 0.9,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true },
        });
      });
      // Each card's content settles in as it arrives.
      cards.forEach((card) => {
        gsap.from(card.querySelectorAll(`.${styles.meta}, .${styles.body} h3, .${styles.stats} > div`), {
          y: 36,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        });
        gsap.fromTo(card.querySelector(`.${styles.media} img`), { scale: 1.18 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: card, start: "top bottom", end: "top 12%", scrub: true },
        });
      });
    });

    // "Explore case" capsule trails the pointer across each image.
    mm.add(`${finePointerQuery} and ${motionQuery}`, () => {
      ref.current?.setAttribute("data-follow", "");
      const cleanups = gsap.utils.toArray<HTMLElement>(`.${styles.media}`).map((media) => {
        const cursor = media.querySelector<HTMLElement>(`.${styles.cursor}`);
        if (!cursor) return () => undefined;
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.55, ease: "power3.out" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.55, ease: "power3.out" });
        function home() {
          return {
            x: cursor!.offsetLeft + cursor!.offsetWidth / 2,
            y: cursor!.offsetTop + cursor!.offsetHeight / 2,
          };
        }
        function onMove(event: PointerEvent) {
          const rect = media.getBoundingClientRect();
          const origin = home();
          xTo(event.clientX - rect.left - origin.x);
          yTo(event.clientY - rect.top - origin.y);
        }
        function onLeave() {
          xTo(0);
          yTo(0);
        }
        media.addEventListener("pointermove", onMove);
        media.addEventListener("pointerleave", onLeave);
        return () => {
          media.removeEventListener("pointermove", onMove);
          media.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => {
        ref.current?.removeAttribute("data-follow");
        cleanups.forEach((cleanup) => cleanup());
      };
    });

    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref} className={styles.stack}>
      {caseStudies.map((study, index) => (
        <article className={styles.card} key={study.slug} style={{ "--i": index } as CSSProperties} aria-labelledby={`case-${study.slug}`}>
          <div className={styles.cardInner}>
            <Link href={pages.work.path} className={styles.media} aria-label={`Explore case: ${study.title}`}>
              <Image
                src={study.image.src}
                alt={study.image.alt}
                width={study.image.width}
                height={study.image.height}
                sizes="(max-width: 899px) 100vw, 640px"
              />
              <span className={styles.cursor} aria-hidden="true">
                <i />Explore case<ArrowUpRightIcon />
              </span>
            </Link>
            <div className={styles.body}>
              <ul className={styles.meta}>
                <li><MonitorIcon />{study.industry}</li>
                <li><GlobeIcon />{study.location}</li>
              </ul>
              <h3 id={`case-${study.slug}`}>{study.title}</h3>
              <dl className={styles.stats}>
                {study.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd>{stat.value}<TrendUpIcon /></dd>
                    <dt>{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
