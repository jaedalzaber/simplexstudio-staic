"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import type { WorkCategory } from "@/content/types";
import type { WorkTile } from "@/content/work";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { gsap } from "@/lib/gsap";
import { WorkCard } from "./work-card";
import styles from "./work.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Category filter and the staggered project layout: a pair (the right tile
 * dropped lower), then one wide centred tile, repeating. Tiles glide to their
 * new places when the filter changes.
 */
export function WorkGrid({ tiles, categories }: { tiles: readonly WorkTile[]; categories: readonly WorkCategory[] }) {
  const [active, setActive] = useState<WorkCategory>(categories[0]);
  const gridRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const visible = tiles.filter((tile) => tile.categories.includes(active));

  function choose(category: WorkCategory) {
    // Finish any scroll reveals still waiting below the fold: cards are about
    // to move, so Motion animates the new layout from here on.
    gridRef.current?.querySelectorAll("[data-reveal]").forEach((card) => {
      gsap.getTweensOf(card).forEach((tween) => {
        // Render the end state first: killing the trigger also kills its tween where it stands.
        tween.progress(1);
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });
    setActive(category);
  }

  return (
    <LayoutGroup>
      <FilterTabs
        options={categories}
        value={active}
        onChange={choose}
        label="Filter case studies"
        controls={`${id}-grid`}
        className={styles.filters}
      />

      <p className={styles.visuallyHidden} aria-live="polite">{visible.length} {active.toLowerCase()} case studies</p>

      <ul ref={gridRef} id={`${id}-grid`} className={`site-container ${styles.grid}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((tile, index) => {
            const slot = index % 3 === 0 ? "left" : index % 3 === 1 ? "right" : "wide";
            return (
              <motion.li
                key={tile.slug}
                layout
                className={styles.item}
                data-slot={slot}
                data-offset={Math.floor(index / 3) % 2 === 0 ? "large" : "small"}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
                transition={{ duration: 0.9, ease, layout: { duration: 0.8, ease } }}
              >
                <WorkCard entry={tile} wide={slot === "wide"} />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </LayoutGroup>
  );
}
