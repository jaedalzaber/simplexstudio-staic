import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { PillLink } from "@/components/ui/pill-link";
import { heroLinks, roomPreview } from "@/content/booking";
import { demoVenue } from "@/content/booking-demo";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";
import local from "./booking.module.css";

// The same Friday evening as the demo's sample availability.
const schedule = [
  { time: "19:30", table: 5, guests: 6, status: "Seated" },
  { time: "19:30", table: 3, guests: 4, status: "Seated" },
  { time: "20:00", table: 8, guests: 3, status: "Arrived" },
  { time: "20:00", table: 4, guests: 2, status: "Confirmed" },
  { time: "20:30", table: 7, guests: 4, status: "New" },
] as const;

/** A static restaurant booking: the room, its reservation panel, and the staff schedule behind it. */
function BookingPreview() {
  return (
    <div className={local.preview} aria-hidden="true">
      <div className={local.previewSchedule}>
        <p className={local.cardKicker}>Friday · Staff schedule</p>
        <ul>
          {schedule.map((row) => (
            <li key={`${row.time}-${row.table}`} data-status={row.status}>
              <span>{row.time}</span>
              <strong>Table {row.table}</strong>
              <span>{row.guests} guests</span>
              <em>{row.status}</em>
            </li>
          ))}
        </ul>
      </div>
      <div className={local.previewRoom}>
        <Media image={roomPreview} fill sizes="(max-width: 899px) 100vw, 900px" preload />
      </div>
      <div className={local.previewPanel}>
        <p className={local.cardKicker}>{demoVenue.name}</p>
        <p className={local.cardTitle}>Reserve a table</p>
        <div className={local.previewFields}>
          <span><small>Guests</small>4</span>
          <span><small>Day</small>Friday</span>
          <span><small>Time</small>20:30</span>
        </div>
        <div className={local.previewTable}>
          <b>7</b>
          <span><strong>Table 7</strong><small>Main room · 4 seats</small></span>
          <em>Available</em>
        </div>
        <span className={local.previewButton}>Reserve</span>
      </div>
    </div>
  );
}

export function BookingHero() {
  return (
    <>
      <section className={`site-container ${styles.hero}`} aria-labelledby="booking-title">
        <Eyebrow>Booking Systems</Eyebrow>
        <h1 id="booking-title" className={styles.title}>
          <span className={styles.line}><span>Custom booking systems</span></span>
          <span className={styles.line}><span>for services and spaces.</span></span>
        </h1>
        <p className={styles.lead}>
          We customise booking software and create the websites, apps, and visual booking experiences around it.
          Help customers choose a service, time, or space, and give your team clear tools to manage each booking.
        </p>
        <div className={styles.heroActions}>
          <PillLink href={pages.contact.path}>Discuss your project</PillLink>
          <a href="#demo" className={styles.textLink}>
            Try the booking demo
            <ArrowRightIcon />
          </a>
        </div>
        <nav className={local.heroLinks} aria-label="Explore booking systems">
          {heroLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
      </section>

      <div className={`site-container ${local.heroVisual}`}>
        <BookingPreview />
        <p className={local.heroCaption}>Sample restaurant: interactive venue layout, reservation panel, and staff schedule.</p>
      </div>
    </>
  );
}
