"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { capabilityGroups, solutionLinks } from "@/config/navigation";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import styles from "./header.module.css";

export const menuItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function CapabilitiesMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className={styles.capabilities}>
      {capabilityGroups.map((group) => (
        <div className={styles.capabilityGroup} key={group.title}>
          <motion.p className={styles.groupTitle} variants={menuItemVariants}>{group.title}</motion.p>
          <ul>
            {group.links.map((link) => (
              <motion.li key={link.label} variants={menuItemVariants}>
                <Link href={link.href} className={styles.capabilityLink} onClick={onNavigate}>
                  <span className={styles.capabilityIcon}>
                    <Image src={link.icon} alt="" width={16} height={16} />
                  </span>
                  <span>{link.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SolutionsMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ul className={styles.solutions}>
      {solutionLinks.map((link) => (
        <motion.li key={link.label} variants={menuItemVariants}>
          <Link href={link.href} className={styles.solutionLink} onClick={onNavigate}>
            <Image src={link.image} alt="" fill sizes="(max-width: 799px) 50vw, 320px" />
            <span className={styles.solutionLabel}>
              {link.label}
              <ArrowUpRightIcon />
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
