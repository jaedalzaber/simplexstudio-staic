"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./interface-tabs.module.css";

export interface InterfaceTab {
  id: string;
  title: string;
  text: string;
  preview: ReactNode;
}

const ease = [0.16, 1, 0.3, 1] as const;

/** One large interface view at a time; the captions double as tabs. */
export function InterfaceTabs({ tabs, label }: { tabs: readonly InterfaceTab[]; label: string }) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = index;
    if (event.key in keys) next = (index + keys[event.key] + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className={styles.views}>
      <div className={styles.tabs} role="tablist" aria-label={label} aria-orientation="vertical">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={`${id}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`${id}-panel-${tab.id}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className={styles.index} aria-hidden="true">0{index + 1}</span>
            <strong>{tab.title}</strong>
            <span className={styles.text}>{tab.text}</span>
          </button>
        ))}
      </div>
      <div className={styles.stage}>
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            id={`${id}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${tab.id}`}
            hidden={active !== index}
            className={styles.panel}
          >
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease }}
                >
                  {tab.preview}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
