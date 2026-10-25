import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { managementViews, type ManagementView } from "@/content/booking";
import { InterfaceTabs } from "@/components/sections/solution/interface-tabs";
import shared from "@/components/sections/solution/solution.module.css";
import { AvailabilityPreview, CalendarPreview, CustomerPreview } from "./interface-previews";
import styles from "./booking.module.css";

const previews: Record<ManagementView, ReactNode> = {
  calendar: <CalendarPreview />,
  customers: <CustomerPreview />,
  availability: <AvailabilityPreview />,
};

/** Staff-facing tools, set in a dark band to keep them distinct from the customer demo. */
export function Management() {
  return (
    <section className={styles.management} data-surface="dark" aria-labelledby="management-title">
      <span className={styles.managementGlow} aria-hidden="true" />
      <div className="site-container">
        <div className={styles.splitHead}>
          <div className={shared.sectionHead}>
            <Eyebrow tone="light">For your team</Eyebrow>
            <h2 id="management-title" data-reveal="lines">Manage bookings and <br />customers in one place</h2>
          </div>
          <p data-reveal>
            Give your team a clear view of bookings, availability, and customer details. Adapt the dashboard to the
            people, spaces, and services you manage.
          </p>
        </div>

        <div data-reveal="scale">
          <InterfaceTabs label="Management views" tabs={managementViews.map((view) => ({ ...view, preview: previews[view.id] }))} />
        </div>

        <p className={styles.scopeNote} data-reveal>
          Payments, deposits, reminders, calendar connections, reporting, and other integrations are agreed as part of
          your project scope. Previews show sample data.
        </p>
      </div>
    </section>
  );
}
