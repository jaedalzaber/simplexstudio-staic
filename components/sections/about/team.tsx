"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import type { TeamMember } from "@/content/about";
import styles from "./about.module.css";

const ease = [0.16, 1, 0.3, 1] as const;
const offsets = [-2, -1, 0, 1, 2];
const wrap = (value: number, length: number) => ((value % length) + length) % length;

/** Endless team carousel: arrows, drag, or a click on a side card brings a person to the centre. */
export function Team({ members }: { members: readonly TeamMember[] }) {
  const [active, setActive] = useState(0);
  const current = members[wrap(active, members.length)];

  return (
    <section className={`site-container ${styles.team}`} aria-labelledby="team-title" aria-roledescription="carousel">
      <div className={styles.teamHead}>
        <div>
          <Eyebrow>Our team</Eyebrow>
          <h2 id="team-title">Our top level</h2>
        </div>
        <div className={styles.teamControls}>
          <button type="button" onClick={() => setActive((value) => value - 1)} aria-label="Previous team member"><ArrowLeftIcon /></button>
          <button type="button" onClick={() => setActive((value) => value + 1)} aria-label="Next team member"><ArrowRightIcon /></button>
        </div>
      </div>

      <p className={styles.visuallyHidden} aria-live="polite">
        {current.name}, {current.role}. {wrap(active, members.length) + 1} of {members.length}.
      </p>

      <motion.div
        className={styles.teamTrack}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) setActive((value) => value + 1);
          else if (info.offset.x > 60) setActive((value) => value - 1);
        }}
        aria-hidden="true"
      >
        <AnimatePresence initial={false}>
          {offsets.map((offset) => {
            const index = active + offset;
            const member = members[wrap(index, members.length)];
            const distance = Math.abs(offset);
            return (
              <motion.article
                key={index}
                className={styles.member}
                data-center={offset === 0 || undefined}
                initial={{ x: `${offset * 112 + Math.sign(offset) * 112}%`, opacity: 0, scale: 0.9 }}
                animate={{ x: `${offset * 112}%`, opacity: distance === 2 ? 0.45 : 1, scale: offset === 0 ? 1.11 : 1, zIndex: 10 - distance }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease }}
                onClick={() => offset !== 0 && setActive(index)}
              >
                <div className={styles.memberPhoto}>
                  <Media image={member.photo} fill sizes="360px" />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <ul className={styles.visuallyHidden}>
        {members.map((member, index) => <li key={index}>{member.name}, {member.role}</li>)}
      </ul>
    </section>
  );
}
