import type { CSSProperties } from "react";
import { PillLink } from "@/components/ui/pill-link";
import { ServicePill } from "@/components/ui/service-pill";
import { heroServices } from "@/content/home";
import { pages } from "@/content/pages";
import { HeroBackdrop } from "./hero-backdrop";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.panel}>
        <HeroBackdrop />
        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.line}><span>Scaling &amp; digital</span></span>
            <span className={styles.line}><span>transformation partner</span></span>
          </h1>
          <p className={styles.lead}>
            We’re operating across three interconnected layers to solve distinct growth constraints by building
            experience, demand, and technology into a unified system.
          </p>
          <div className={styles.cta}>
            <PillLink href={pages.contact.path}>Book a call</PillLink>
          </div>
        </div>
      </div>

      <div className={styles.services}>
        {heroServices.map((service, index) => (
          <article className={styles.card} key={service.title} style={{ "--i": index } as CSSProperties}>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            <ServicePill href={service.href} image={service.image} label={`View ${service.title} service`} className={styles.pill} />
          </article>
        ))}
      </div>
    </section>
  );
}
