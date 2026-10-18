import Link from "next/link";
import { RevealScope } from "@/components/motion/reveal-scope";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { pages } from "@/content/pages";
import { CaseStack } from "./case-stack";
import styles from "./case-studies.module.css";

export function CaseStudies() {
  return (
    <RevealScope as="section" className={`site-container ${styles.section}`} aria-labelledby="cases-title">
      <div className={styles.heading}>
        <Eyebrow>For whom</Eyebrow>
        <h2 id="cases-title" data-reveal="lines">Challenges we solve</h2>
      </div>
      <CaseStack />
      <div className={styles.more} data-reveal>
        <Link href={pages.work.path} className={styles.moreLink}>
          <i aria-hidden="true" />
          See all work
          <ArrowUpRightIcon />
        </Link>
      </div>
    </RevealScope>
  );
}
