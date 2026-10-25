import { Eyebrow } from "@/components/ui/eyebrow";
import { PillLink } from "@/components/ui/pill-link";
import { terms } from "@/content/ecommerce";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

/** A free design concept, with project price and typical timeline up front. */
export function Offer() {
  return (
    <section className="site-container" aria-labelledby="offer-title">
      <div className={styles.offer} data-surface="dark" data-reveal="scale">
        <span className={styles.offerGlow} aria-hidden="true" />
        <div className={styles.offerCopy}>
          <Eyebrow tone="light">Before you start</Eyebrow>
          <h2 id="offer-title">Free homepage or product page concept</h2>
          <p>
            Share your store or product link. We’ll create a concept for one page to show how the design and
            product information could improve.
          </p>
          <PillLink href={pages.contact.path} tone="light">Request a concept</PillLink>
        </div>
        <dl className={styles.terms}>
          {terms.map((term) => (
            <div key={term.label}>
              <dt>{term.label}</dt>
              <dd>{term.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
