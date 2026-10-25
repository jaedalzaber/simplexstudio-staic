import Image from "next/image";
import type { CSSProperties } from "react";
import { RevealScope } from "@/components/motion/reveal-scope";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { Clients } from "@/components/sections/home/clients";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowUpRightIcon, PhoneIcon, WhatsappIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { contactChannels, contactPerson, messageLimit, offices } from "@/content/contact";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/sections/contact/contact.module.css";

export const metadata = pageMetadata("contact");

// Bounds of the equirectangular dot map in /images/contact/world-dots.webp.
const map = { west: -180, east: 180, north: 84, south: -56 };

function markerPosition([lon, lat]: readonly [number, number]) {
  return {
    left: `${((lon - map.west) / (map.east - map.west)) * 100}%`,
    top: `${((map.north - lat) / (map.north - map.south)) * 100}%`,
  };
}

export default function ContactPage() {
  return (
    <RevealScope className={styles.page} data-sky-scope>
      <SkyFade height="clamp(760px, 64vw, 920px)" />

      <section className={`site-container ${styles.intro}`} aria-labelledby="contact-title">
        <aside className={styles.schedule} data-surface="dark" aria-labelledby="schedule-title">
          <span className={styles.scheduleGlow} aria-hidden="true" />
          <h2 id="schedule-title">Ready to schedule a call?</h2>
          <p className={styles.scheduleNote}>It takes less than a minute</p>
          <div className={styles.person}>
            <span className={styles.avatar}>
              <Media image={contactPerson.photo} fill sizes="88px" />
            </span>
            <div>
              <p className={styles.personName}>{contactPerson.name}</p>
              <p className={styles.personRole}>{contactPerson.role}</p>
            </div>
          </div>
          <div className={styles.scheduleActions}>
            <a className={styles.scheduleButton} href={contactChannels.schedule}>
              Schedule a call
              <PhoneIcon />
            </a>
            {contactChannels.whatsapp && (
              <a className={styles.whatsappButton} href={`https://wa.me/${contactChannels.whatsapp}`} target="_blank" rel="noopener noreferrer">
                Contact via
                <span><WhatsappIcon />WhatsApp</span>
              </a>
            )}
          </div>
        </aside>

        <div className={styles.formColumn}>
          <h1 id="contact-title" className={styles.title}>Contact Us</h1>
          <ContactForm messageLimit={messageLimit} />
        </div>
      </section>

      <Clients className={styles.clients} />

      <section className={`site-container ${styles.locations}`} aria-labelledby="locations-title">
        <div className={styles.map} aria-hidden="true">
          <Image src="/images/contact/world-dots.webp" alt="" width={2400} height={933} sizes="(max-width: 1400px) 100vw, 1330px" />
          {offices.map((office, index) => (
            <span key={office.city} className={styles.marker} data-index={index} style={markerPosition(office.coordinates) as CSSProperties} />
          ))}
        </div>

        <div className={styles.locationsHead}>
          <Eyebrow>Locations</Eyebrow>
          <h2 id="locations-title" data-reveal="lines">Let’s connect</h2>
        </div>

        <ul className={styles.offices} data-reveal="stagger">
          {offices.map((office) => (
            <li className={styles.office} key={office.city}>
              <h3>{office.city}</h3>
              <p>{office.address}</p>
            </li>
          ))}
        </ul>

        <div className={styles.emails} data-reveal="stagger">
          <a className={styles.emailCard} href={`mailto:${contactChannels.email}`}>
            <span>Got questions to ask?</span>
            <strong>{contactChannels.email}<ArrowUpRightIcon /></strong>
          </a>
          <a className={styles.emailCard} href={`mailto:${contactChannels.careers}`}>
            <span>We are hiring!</span>
            <strong>{contactChannels.careers}<ArrowUpRightIcon /></strong>
          </a>
        </div>
      </section>
    </RevealScope>
  );
}
