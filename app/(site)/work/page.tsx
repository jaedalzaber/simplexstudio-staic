import { RevealScope } from "@/components/motion/reveal-scope";
import { WorkGrid } from "@/components/sections/work/work-grid";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { workCategories, workTiles } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/sections/work/work.module.css";

export const metadata = pageMetadata("work");

export default function WorkPage() {
  return (
    <RevealScope className={styles.page} data-sky-scope>
      <SkyFade height="clamp(900px, 82vw, 1180px)" />
      <section className={`site-container ${styles.hero}`} aria-labelledby="work-title">
        <h1 id="work-title" className={styles.title}>Case studies</h1>
        <p className={styles.lead}>
          Real projects for real businesses. Explore how our design, software and lead generation teams help clients grow.
        </p>
      </section>
      <WorkGrid tiles={workTiles()} categories={workCategories} />
    </RevealScope>
  );
}
