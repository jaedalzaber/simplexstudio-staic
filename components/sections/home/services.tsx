import { RevealScope } from "@/components/motion/reveal-scope";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillLink } from "@/components/ui/pill-link";
import { ServicePill } from "@/components/ui/service-pill";
import { serviceTracks } from "@/content/home";
import { pages } from "@/content/pages";
import { Spotlight } from "./spotlight";
import styles from "./services.module.css";

export function Services() {
  return (
    <RevealScope as="section" className={styles.band} data-surface="dark" aria-labelledby="services-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={`site-container ${styles.content}`}>
        <div className={styles.head}>
          <div>
            <Eyebrow tone="light">Our services</Eyebrow>
            <h2 id="services-title" data-reveal="lines">How we drive scaling &amp;<br />digital transformation</h2>
          </div>
          <p data-reveal data-reveal-delay="0.15">
            As a strategic digital transformation company, we help businesses rethink how they generate demand, enable
            decisions, and scale revenue through technology. Some clients need one track. Many need all three. Either
            way, we’ve got you.
          </p>
        </div>

        <Spotlight className={styles.grid}>
          {serviceTracks.map((track, index) => (
            <article className={styles.card} key={track.title} data-spotlight>
              <div className={styles.cardTop}>
                <span className={styles.tag}>{track.tag}</span>
                <span className={styles.number} aria-hidden="true">/0{index + 1}</span>
              </div>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <ServicePill href={track.href} image={track.image} label={`View service: ${track.title}`} tone="dark" className={styles.pill} />
            </article>
          ))}
        </Spotlight>
      </div>

      <div className={styles.cta}>
        <div className={styles.wave} aria-hidden="true" />
        <h2 data-reveal="lines">Accelerate your<br />digital expansion</h2>
        <div data-reveal data-reveal-delay="0.2">
          <PillLink href={pages.contact.path}>Book a call</PillLink>
        </div>
      </div>
    </RevealScope>
  );
}
