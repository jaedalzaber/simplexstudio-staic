import type { ComponentType, SVGProps } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BedIcon, BusIcon, ConsultationIcon, CutleryIcon, DeskIcon, ToothIcon } from "@/components/ui/icons";
import { businessTypes, type BusinessIcon } from "@/content/booking";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./booking.module.css";

const icons: Record<BusinessIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  stay: BedIcon,
  desk: DeskIcon,
  restaurant: CutleryIcon,
  clinic: ToothIcon,
  consultation: ConsultationIcon,
  transport: BusIcon,
};

export function Flows() {
  return (
    <section className={`site-container ${styles.flows}`} aria-labelledby="flows-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Appointments and reservations</Eyebrow>
          <h2 id="flows-title" data-reveal="lines">Booking flows built <br />around your business</h2>
        </div>
        <p data-reveal>
          The booking rules depend on what customers are reserving. We adapt the steps, availability, and
          management tools to your services and operations.
        </p>
      </div>

      <ul className={styles.flowGrid} data-reveal="stagger">
        {businessTypes.map((type) => {
          const Icon = icons[type.icon];
          return (
            <li className={styles.flow} key={type.business}>
              <span className={styles.flowIcon} aria-hidden="true"><Icon /></span>
              <h3>{type.business}</h3>
              <p><span>Customers choose</span>{type.choice}</p>
            </li>
          );
        })}
      </ul>

      <p className={styles.note} data-reveal>
        These examples illustrate possible project scopes. We confirm each industry’s rules and integrations during
        planning, using maps and 3D where location matters and a clear service and calendar flow where that is more helpful.
      </p>
    </section>
  );
}
