"use client";

import { motion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { classes } from "@/lib/classes";
import { ArrowRightIcon } from "./icons";
import styles from "./scroll-spy-nav.module.css";

type Item = { id: string; text: string };

/** In-page section list that highlights the section being read; links jump to it. */
export function ScrollSpyNav({ title, items, className }: { title: string; items: readonly Item[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const id = useId();

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    // A section becomes current once its top passes the upper third of the viewport.
    const observer = new IntersectionObserver((entries) => {
      const passed = elements.filter((element) => element.getBoundingClientRect().top < window.innerHeight * 0.35);
      const current = passed.at(-1) ?? elements[0];
      if (current && entries.length) setActive(current.id);
    }, { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={classes(styles.nav, className)} aria-labelledby={`${id}-title`}>
      <p id={`${id}-title`} className={styles.title}>{title}</p>
      <ol className={styles.list} data-lenis-prevent>
        {items.map((item) => {
          const current = item.id === active;
          return (
            <li key={item.id}>
              <a href={`#${item.id}`} aria-current={current ? "location" : undefined} data-current={current}>
                {current && (
                  <motion.span layoutId={`${id}-marker`} className={styles.marker} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <ArrowRightIcon />
                  </motion.span>
                )}
                <span>{item.text}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
