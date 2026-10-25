import { Eyebrow } from "@/components/ui/eyebrow";
import { CheckIcon } from "@/components/ui/icons";
import { websiteBenefits } from "@/content/real-estate";
import shared from "@/components/sections/solution/solution.module.css";
import styles from "./real-estate.module.css";

/** Schematic property page on desktop and phone: details and the enquiry route side by side. */
function PropertyPageMock() {
  return (
    <div className={styles.devices} aria-hidden="true" data-reveal="scale">
      <div className={styles.desktop}>
        <div className={styles.browserBar}><i /><i /><i /><span>yourdevelopment.com/villas/v3</span></div>
        <div className={styles.mockPage}>
          <div className={styles.pageMain}>
            <div className={styles.pageHero} />
            <p className={styles.pageTitle}>Villa V3</p>
            <p className={styles.pageMeta}>4 bedrooms · 480 m² plot · Available</p>
            <div className={styles.pageTabs}><span data-active>Floor plans</span><span>Gallery</span><span>360° tour</span></div>
            <div className={styles.pagePlan}><span /><span /><span /><span /></div>
          </div>
          <div className={styles.pageForm}>
            <p>Request information</p>
            <span className={styles.field}>Name</span>
            <span className={styles.field}>Email</span>
            <span className={styles.fieldFilled}>Interested in: Villa V3</span>
            <span className={styles.formButton}>Arrange a viewing</span>
          </div>
        </div>
      </div>
      <div className={styles.phone}>
        <div className={styles.phoneHero} />
        <p className={styles.pageTitle}>Villa V3</p>
        <p className={styles.pageMeta}>4 bed · 480 m²</p>
        <div className={styles.pagePlan}><span /><span /></div>
        <span className={styles.formButton}>Enquire</span>
      </div>
    </div>
  );
}

export function Websites() {
  return (
    <section className={`site-container ${styles.websites}`} aria-labelledby="websites-title">
      <div className={styles.websitesCopy}>
        <div className={shared.sectionHead}>
          <Eyebrow>Property websites</Eyebrow>
          <h2 id="websites-title" data-reveal="lines">Websites for <br />property enquiries</h2>
        </div>
        <p data-reveal>
          Bring 3D renders, tours, floor plans, and property selectors together on a mobile-friendly website.
          Help buyers compare properties, request information, or arrange a viewing.
        </p>
        <ul className={shared.benefits} data-reveal="stagger">
          {websiteBenefits.map((benefit) => (
            <li key={benefit}>
              <span className={shared.benefitIcon} aria-hidden="true"><CheckIcon /></span>
              <div>{benefit}</div>
            </li>
          ))}
        </ul>
      </div>
      <PropertyPageMock />
    </section>
  );
}
