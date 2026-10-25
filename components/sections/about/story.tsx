import { RevealScope } from "@/components/motion/reveal-scope";
import { ScrollZoom } from "@/components/motion/scroll-zoom";
import { Statement } from "@/components/motion/statement";
import { Media } from "@/components/ui/media";
import { StatRow } from "@/components/ui/stat-row";
import { teamPhoto } from "@/content/about";
import { stats } from "@/content/home";
import styles from "./about.module.css";

export function Story() {
  return (
    <RevealScope as="section" className={`site-container ${styles.story}`} aria-labelledby="story-title">
      <h2 id="story-title" className={styles.visuallyHidden}>Who we are</h2>
      <ScrollZoom className={styles.teamPhoto}>
        <div className={styles.teamPhotoMedia}>
          <Media image={teamPhoto} fill sizes="(max-width: 1400px) 100vw, 1306px" />
        </div>
      </ScrollZoom>
      <Statement className={styles.statement}>
        At Simplex Studio, we’re a digital transformation company reshaping how businesses generate demand, make
        decisions, and scale through technology.
      </Statement>
      <StatRow stats={stats} className={styles.stats} />
    </RevealScope>
  );
}
