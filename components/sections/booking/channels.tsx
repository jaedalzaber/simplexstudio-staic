import { Eyebrow } from "@/components/ui/eyebrow";
import { channels } from "@/content/booking";
import { demoVenue } from "@/content/booking-demo";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./booking.module.css";
import previews from "./previews.module.css";

function CustomerApp() {
  return (
    <div className={previews.phone} role="img" aria-label="Customer app showing an upcoming reservation">
      <span className={previews.phoneNotch} />
      <p className={previews.formVenue}>Your reservations</p>
      <div className={previews.appCard}>
        <b>{demoVenue.name}</b>
        <span>Friday · 20:30</span>
        <span>Table 7 · 4 guests</span>
        <span className={previews.appActions}><em>Change</em><em>Cancel</em></span>
      </div>
      <p className={previews.formVenue}>Book again</p>
      <span className={previews.appRow}><b>Dinner</b><small>Next available: Thursday 19:00</small></span>
      <span className={previews.appRow}><b>Private dining</b><small>Request a date</small></span>
    </div>
  );
}

function StaffTool() {
  return (
    <div className={previews.tablet} role="img" aria-label="Staff tool listing tonight’s bookings with their status">
      <div className={previews.tabletHead}><b>Tonight</b><span>Friday · 15 bookings</span></div>
      <ul className={previews.staffList}>
        {[["19:30", "Silva", "6", "Table 5", "Seated"], ["20:00", "Novak", "3", "Table 8", "Arrived"], ["20:00", "Reyes", "2", "Table 1", "Confirmed"], ["20:30", "Collins", "4", "Table 7", "Confirmed"]].map(([time, name, guests, table, state]) => (
          <li key={name}>
            <span>{time}</span>
            <b>{name} · {guests}</b>
            <span>{table}</span>
            <em data-state={state}>{state}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OnSite() {
  return (
    <div className={previews.onSite}>
      <div className={previews.kiosk} role="img" aria-label="Interactive kiosk for self-service check-in">
        <div className={previews.kioskScreen}>
          <b>Welcome</b>
          <span>Check in for your booking</span>
          <em>Find my booking</em>
          <em data-ghost>Walk-in table</em>
        </div>
        <span className={previews.kioskStand} />
        <small>Interactive kiosk</small>
      </div>
      <div className={previews.display} role="img" aria-label="Information display showing room availability">
        <div className={previews.displayScreen}>
          <b>Private room</b>
          <span data-state="busy">In use until 21:00</span>
          <b>Chef’s counter</b>
          <span data-state="free">Free from 20:30</span>
        </div>
        <small>Information display</small>
      </div>
    </div>
  );
}

const devices = [<CustomerApp key="app" />, <StaffTool key="staff" />, <OnSite key="site" />];

export function Channels() {
  return (
    <section className={`site-container ${styles.channels}`} aria-labelledby="channels-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Apps and on-site booking</Eyebrow>
          <h2 id="channels-title" data-reveal="lines">Booking across web, <br />mobile, and on-site screens</h2>
        </div>
        <p data-reveal>
          Extend the same booking process to the places your customers and staff use it. Add customer apps, staff
          tools, or on-site booking screens where they support your operation.
        </p>
      </div>

      <ul className={styles.channelGrid} data-reveal="stagger">
        {channels.map((channel, index) => (
          <li className={styles.channel} key={channel.title}>
            <div className={styles.channelStage}>{devices[index]}</div>
            <h3>{channel.title}</h3>
            <p>{channel.text}</p>
          </li>
        ))}
      </ul>

      <p className={styles.note} data-reveal>
        We confirm hardware, connectivity, and data connections for each project. Native apps are an option, not a
        default bundle.
      </p>
    </section>
  );
}
