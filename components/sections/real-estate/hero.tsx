import { ScrollZoom } from "@/components/motion/scroll-zoom";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { PillLink } from "@/components/ui/pill-link";
import { pages } from "@/content/pages";
import { experience, heroCapabilities, heroVisual } from "@/content/real-estate";
import styles from "@/components/sections/solution/solution.module.css";
import local from "./real-estate.module.css";

export function RealEstateHero() {
  return (
    <>
      <section className={`site-container ${styles.hero}`} aria-labelledby="real-estate-title">
        <Eyebrow>Real Estate</Eyebrow>
        <h1 id="real-estate-title" className={styles.title}>
          <span className={styles.line}><span>3D rendering and configurators</span></span>
          <span className={styles.line}><span>for real estate.</span></span>
        </h1>
        <p className={styles.lead}>
          We create interior and exterior renders, architectural films, web and VR tours, and 3D configurators.
          Our in-house team also builds property websites and management tools.
        </p>
        <div className={styles.heroActions}>
          <PillLink href={pages.contact.path}>Discuss your project</PillLink>
          <a href="#work" className={styles.textLink}>
            View selected work
            <ArrowRightIcon />
          </a>
        </div>
        <nav className={local.heroCapabilities} aria-label="Explore our real estate services">
          {heroCapabilities.map((capability) => <a key={capability.href} href={capability.href}>{capability.label}</a>)}
        </nav>
        <p className={local.heroExperience}>{experience}</p>
      </section>

      <div className={`site-container ${styles.filmWrap}`}>
        <ScrollZoom className={styles.film}>
          <div className={styles.filmMedia}>
            <Media image={heroVisual} fill sizes="(max-width: 1400px) 100vw, 1330px" preload />
          </div>
        </ScrollZoom>
        <p className={local.heroCaption}>Hay Al Wafa · Rendered master plan and property selector</p>
      </div>
    </>
  );
}
