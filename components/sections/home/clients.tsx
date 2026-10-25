import Image from "next/image";
import { classes } from "@/lib/classes";
import styles from "./clients.module.css";

const clientNames = "Tata, Reverso, Bosch, Porsche, Impactive, Boba, Freestone Property Group, and the Ministry of Digital Transformation of Ukraine";

/** Endless, hover-pausable strip of client marks. */
export function Clients({ className, eager = false }: { className?: string; eager?: boolean }) {
  return (
    <section className={classes(styles.clients, className)} aria-label="Selected clients">
      <p className={styles.visuallyHidden}>Trusted by {clientNames}.</p>
      <div className={styles.viewport} aria-hidden="true">
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <Image key={copy} className={styles.strip} src="/images/home/clients-strip.webp" alt="" width={1385} height={64} sizes="1385px" loading={eager ? "eager" : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
