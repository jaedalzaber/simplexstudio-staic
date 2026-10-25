import { ScrollZoom } from "@/components/motion/scroll-zoom";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { PillLink } from "@/components/ui/pill-link";
import { disciplines, heroFilm } from "@/content/ecommerce";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

export function EcommerceHero() {
  return (
    <>
      <section className={`site-container ${styles.hero}`} aria-labelledby="ecommerce-title">
        <Eyebrow>For product brands</Eyebrow>
        <h1 id="ecommerce-title" className={styles.title}>
          <span className={styles.line}><span>Custom ecommerce</span></span>
          <span className={styles.line}><span>design and development.</span></span>
        </h1>
        <p className={styles.lead}>
          We help product brands launch or improve their online stores. Our in-house team handles branding,
          3D visuals, product configurators, and custom software.
        </p>
        <div className={styles.heroActions}>
          <PillLink href={pages.contact.path}>Discuss your project</PillLink>
          <a href="#work" className={styles.textLink}>
            See the work
            <ArrowRightIcon />
          </a>
        </div>
      </section>

      {/* Decorative: the surrounding page explains these disciplines. */}
      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[0, 1].map((copy) => (
            <span className={styles.tickerSet} key={copy}>
              {disciplines.map((discipline) => <span key={discipline}>{discipline}<i /></span>)}
            </span>
          ))}
        </div>
      </div>

      <div className={`site-container ${styles.filmWrap}`}>
        <ScrollZoom className={styles.film}>
          <div className={styles.filmMedia}>
            <Media image={heroFilm} fill sizes="(max-width: 1400px) 100vw, 1330px" preload />
          </div>
        </ScrollZoom>
      </div>
    </>
  );
}
