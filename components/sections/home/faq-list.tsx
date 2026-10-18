"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";
import type { Question } from "@/content/home";
import styles from "./faq.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

export function FaqList({ items }: { items: readonly Question[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <ul className={styles.list} data-reveal="stagger">
      {items.map((item, index) => {
        const expanded = open === index;
        const buttonId = `${id}-q-${index}`;
        const panelId = `${id}-a-${index}`;
        return (
          <li className={styles.item} key={item.question} data-open={expanded}>
            <h3>
              <button
                id={buttonId}
                type="button"
                className={styles.question}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>{item.question}</span>
                <motion.span className={styles.chevron} animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.5, ease }}>
                  <ChevronDownIcon />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={styles.answer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.6, ease }, opacity: { duration: 0.35 } }}
                >
                  <motion.p initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: 8 }} transition={{ duration: 0.6, ease }}>
                    {item.answer}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
