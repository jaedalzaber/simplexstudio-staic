import type { CSSProperties, ComponentProps } from "react";
import { AppWindow, windowStyles } from "@/components/sections/solution/app-window";
import { demoVenue } from "@/content/booking-demo";
import styles from "./previews.module.css";

// Interface previews recreated in HTML for the example restaurant. Every name,
// booking and setting is sample data for the same Friday as the table demo.

const sections = ["Bookings", "Customers", "Availability"] as const;

/** The restaurant's booking software, open at one section. */
function Window({ title, nav, ...props }: Omit<ComponentProps<typeof AppWindow>, "title" | "nav"> & { title?: string; nav?: (typeof sections)[number] }) {
  return <AppWindow {...props} title={title ?? demoVenue.name} nav={nav && { items: sections, active: nav }} />;
}

const times = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
type BookingState = "Finished" | "Seated" | "Arrived" | "Confirmed" | "New";
const calendarRows: readonly { table: string; area: string; bookings: readonly [start: string, slots: number, name: string, state: BookingState][] }[] = [
  { table: "Table 1", area: "Window · 2", bookings: [["18:00", 3, "Hart · 2", "Finished"], ["20:00", 2, "Reyes · 2", "Confirmed"]] },
  { table: "Table 2", area: "Window · 2", bookings: [["19:30", 3, "Lambert · 2", "Seated"]] },
  { table: "Table 3", area: "Window · 4", bookings: [["19:30", 3, "Okafor · 4", "Seated"]] },
  { table: "Table 5", area: "Booth · 6", bookings: [["18:00", 2, "Mehta · 5", "Finished"], ["19:30", 3, "Silva · 6", "Seated"]] },
  { table: "Table 7", area: "Main room · 4", bookings: [["19:00", 3, "Park · 4", "Seated"], ["20:30", 3, "Collins · 4", "New"]] },
  { table: "Table 8", area: "Main room · 4", bookings: [["20:00", 3, "Novak · 3", "Arrived"]] },
];

export function CalendarPreview() {
  return (
    <Window label="Booking calendar with Friday evening’s reservations by table" nav="Bookings" action="+ New booking">
      <div className={styles.toolbar}>
        <span className={styles.datePill}>‹ Friday ›</span>
        <span className={styles.segmented}><b>Day</b><span>Week</span></span>
        <span className={styles.toolbarMeta}>15 bookings · 46 guests</span>
      </div>
      <div className={styles.timeline}>
        <div className={styles.timeHead}>
          <span />
          <div className={styles.track}>{times.map((time) => <span key={time}>{time}</span>)}</div>
        </div>
        {calendarRows.map((row) => (
          <div className={styles.timeRow} key={row.table}>
            <span className={styles.rowLabel}>{row.table}<small>{row.area}</small></span>
            <div className={styles.track}>
              {row.bookings.map(([start, slots, name, state]) => (
                <span key={start} className={styles.block} data-state={state} style={{ gridColumn: `${times.indexOf(start) + 1} / span ${slots}` }}>
                  <b>{name}</b>
                  <small>{state}</small>
                </span>
              ))}
            </div>
          </div>
        ))}
        <span className={styles.now} style={{ "--now": 0.4375 } as CSSProperties}><i>19:45</i></span>
      </div>
    </Window>
  );
}

const customers = [
  { name: "Maya Collins", note: "Friday 20:30 · Table 7" },
  { name: "Daniel Novak", note: "Arrived · Table 8" },
  { name: "Priya Mehta", note: "3 visits" },
  { name: "Lucas Silva", note: "Regular" },
  { name: "Ana Reyes", note: "First visit" },
];

export function CustomerPreview() {
  return (
    <Window label="Customer record with contact details, booking history and notes submitted with the booking" nav="Customers">
      <div className={styles.split}>
        <div className={styles.customerList}>
          <span className={styles.search}>Search customers</span>
          {customers.map((customer, index) => (
            <span key={customer.name} className={styles.customerRow} data-active={index === 0 || undefined}>
              <i>{customer.name.split(" ").map((part) => part[0]).join("")}</i>
              <span><b>{customer.name}</b><small>{customer.note}</small></span>
            </span>
          ))}
        </div>
        <div className={styles.record}>
          <div className={styles.recordHead}>
            <i>MC</i>
            <span><b>Maya Collins</b><small>Customer since 2024</small></span>
            <span className={styles.tags}><em>Regular</em><em>Window seat</em></span>
          </div>
          <dl className={styles.recordFacts}>
            <div><dt>Email</dt><dd>m•••@example.com</dd></div>
            <div><dt>Phone</dt><dd>•••• ••• 214</dd></div>
            <div><dt>Visits</dt><dd>6</dd></div>
          </dl>
          <p className={styles.recordTitle}>Bookings</p>
          <ul className={styles.history}>
            <li data-state="New"><span>Friday 20:30</span><span>Table 7 · 4 guests</span><em>Upcoming</em></li>
            <li><span>Aug 23</span><span>Table 3 · 2 guests</span><em>Completed</em></li>
            <li><span>Jun 14</span><span>Table 5 · 6 guests</span><em>Completed</em></li>
          </ul>
          <p className={styles.recordTitle}>Submitted with this booking</p>
          <dl className={styles.recordFacts}>
            <div><dt>Occasion</dt><dd>Birthday</dd></div>
            <div><dt>Dietary notes</dt><dd>One vegetarian guest</dd></div>
          </dl>
        </div>
      </div>
    </Window>
  );
}

export function AvailabilityPreview() {
  return (
    <Window label="Availability settings: opening hours, reservation rules, seating areas and staff schedule" nav="Availability">
      <div className={styles.settings}>
        <div className={styles.settingsCard}>
          <p className={styles.recordTitle}>Opening hours</p>
          <dl className={styles.recordFacts}>
            <div><dt>Monday</dt><dd>Closed</dd></div>
            <div><dt>Tuesday–Thursday</dt><dd>17:30–22:00</dd></div>
            <div><dt>Friday–Saturday</dt><dd>17:00–23:00</dd></div>
            <div><dt>Sunday</dt><dd>12:00–21:00</dd></div>
          </dl>
        </div>
        <div className={styles.settingsCard}>
          <p className={styles.recordTitle}>Reservation rules</p>
          <dl className={styles.recordFacts}>
            <div><dt>Dining time</dt><dd>90 min</dd></div>
            <div><dt>Booking interval</dt><dd>30 min</dd></div>
            <div><dt>Online party size</dt><dd>1–8 guests</dd></div>
            <div><dt>Hold a late table</dt><dd>15 min</dd></div>
          </dl>
        </div>
        <div className={styles.settingsCard}>
          <p className={styles.recordTitle}>Seating areas</p>
          <ul className={styles.areas}>
            {[["Window", "3 tables · 8 seats", true], ["Booths", "3 tables · 16 seats", true], ["Main room", "3 tables · 16 seats", true], ["Bar side", "Walk-ins only", false]].map(([area, detail, on]) => (
              <li key={String(area)}>
                <span><b>{area}</b><small>{detail}</small></span>
                <i className={styles.switch} data-on={on || undefined} />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.settingsCard}>
          <p className={styles.recordTitle}>Staff on Friday</p>
          <ul className={styles.staff}>
            {[["Lina", "Host", "16:30–23:00"], ["Omar", "Server", "17:00–23:00"], ["Jae", "Server", "17:00–22:00"], ["Sam", "Server", "18:00–23:00"]].map(([name, role, hours]) => (
              <li key={name}><b>{name}</b><span>{role}</span><span>{hours}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </Window>
  );
}

function Field({ label, value, active, chips }: { label: string; value?: string; active?: boolean; chips?: readonly string[] }) {
  return (
    <span className={styles.field} data-active={active || undefined}>
      <small>{label}</small>
      {chips ? <span className={styles.chips}>{chips.map((chip, index) => <em key={chip} data-on={index === 0 || undefined}>{chip}</em>)}</span> : <span className={styles.input}>{value}</span>}
    </span>
  );
}

export function FormBuilderPreview() {
  return (
    <div className={styles.pair}>
      <Window label="Form builder editing the restaurant’s booking form" title="Form builder · Table reservation" action="Publish" className={styles.editorWindow}>
        <div className={styles.editor}>
          <div className={styles.palette}>
            <p className={styles.recordTitle}>Add a field</p>
            {["Reservation type", "Date and time", "Party size", "Dropdown", "Short answer", "Contact details", "Consent"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className={styles.canvas}>
            <Field label="Reservation type" chips={["Dinner", "Celebration", "Private dining"]} />
            <Field label="Date and time" value="Friday · 20:30" />
            <Field label="Guests" value="4" />
            <Field label="Occasion" value="Choose an occasion" active />
            <Field label="Dietary requirements" value="Optional" />
            <Field label="Your details" value="Name · Email · Phone" />
          </div>
          <div className={styles.properties}>
            <p className={styles.recordTitle}>Field settings</p>
            <span className={styles.property}><small>Label</small>Occasion</span>
            <span className={styles.property}><small>Type</small>Dropdown</span>
            <span className={styles.property}><small>Options</small>Birthday · Anniversary · Business · Other</span>
            <span className={styles.toggleRow}>Required<i className={styles.switch} data-on /></span>
            <span className={styles.toggleRow}>Show in staff notes<i className={styles.switch} data-on /></span>
          </div>
        </div>
      </Window>

      <div className={styles.results}>
        <div className={styles.formCard} role="img" aria-label="The finished booking form a customer completes">
          <p className={styles.formVenue}>{demoVenue.name}</p>
          <p className={styles.formTitle}>Reserve a table</p>
          <Field label="Reservation type" chips={["Dinner", "Celebration", "Private dining"]} />
          <span className={styles.fieldRow}>
            <Field label="Day" value="Friday" />
            <Field label="Time" value="20:30" />
            <Field label="Guests" value="4" />
          </span>
          <Field label="Occasion" value="Birthday" />
          <Field label="Dietary requirements" value="One vegetarian guest" />
          <Field label="Your details" value="Name, email and phone" />
          <span className={styles.formButton}>Reserve</span>
        </div>
        <div className={styles.messageCard} role="img" aria-label="Booking confirmation and reminder messages">
          <p className={styles.formVenue}>Confirmation</p>
          <b>Your table is booked</b>
          <span>Friday 20:30 · Table 7 · 4 guests</span>
          <span className={styles.messageNote}>Reminder the day before, with a link to change or cancel.</span>
        </div>
      </div>
    </div>
  );
}

export function PageBuilderPreview() {
  return (
    <div className={styles.pair}>
      <Window label="Page builder editing the restaurant’s home page" title="Pages · Home" action="Publish" className={styles.editorWindow}>
        <div className={styles.editor}>
          <div className={styles.palette}>
            <p className={styles.recordTitle}>Sections</p>
            {["Hero", "Menu highlights", "Private dining", "Reserve a table", "Location and hours"].map((item, index) => <span key={item} data-active={index === 3 || undefined}>{item}</span>)}
          </div>
          <div className={styles.canvas} data-page>
            <span className={styles.miniHero}><b>{demoVenue.name}</b><small>Seasonal cooking, open from 17:00</small></span>
            <span className={styles.miniCards}><i /><i /><i /></span>
            <span className={styles.miniReserve} data-active><b>Reserve a table</b><span>4 guests · Friday · 20:30</span></span>
            <span className={styles.miniFooter} />
          </div>
          <div className={styles.properties}>
            <p className={styles.recordTitle}>Style</p>
            <span className={styles.swatches}><i style={{ background: "#2f2a26" }} /><i style={{ background: "#c7764a" }} /><i style={{ background: "#efe6da" }} /><i style={{ background: "#5b7462" }} /></span>
            <span className={styles.property}><small>Headings</small>Serif display</span>
            <span className={styles.property}><small>Buttons</small>Rounded</span>
            <span className={styles.property}><small>Booking form</small>Inline</span>
          </div>
        </div>
      </Window>

      <div className={styles.results}>
        <div className={styles.site} role="img" aria-label="The finished restaurant website with a booking form on the home page">
          <div className={styles.siteBar}><span className={windowStyles.dots}><i /><i /><i /></span><span>yourrestaurant.com</span></div>
          <div className={styles.siteNav}><b>{demoVenue.name}</b><span>Menu</span><span>Private dining</span><em>Reserve</em></div>
          <div className={styles.siteHero}>
            <b>Seasonal cooking, open from 17:00</b>
            <span className={styles.siteWidget}><span>4 guests</span><span>Friday</span><span>20:30</span><em>Find a table</em></span>
          </div>
          <div className={styles.siteCards}><i /><i /><i /></div>
        </div>
      </div>
    </div>
  );
}
