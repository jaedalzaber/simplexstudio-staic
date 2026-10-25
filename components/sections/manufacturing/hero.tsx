import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { PillLink } from "@/components/ui/pill-link";
import { areaById, orderSteps, sampleOrder, stepLabels } from "@/content/factory-demo";
import { factoryPreview, heroLinks } from "@/content/manufacturing";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";
import local from "./manufacturing.module.css";

/** A still of the factory demo beside the work order it is following. */
function WorkOrderPreview() {
  return (
    <div className={local.preview} aria-hidden="true">
      <div className={local.previewFactory}>
        <Media image={factoryPreview} fill sizes="(max-width: 899px) 100vw, 900px" preload />
      </div>
      <div className={local.previewPanel}>
        <p className={local.cardKicker}>Work order · Simulated data</p>
        <div className={local.previewHead}>
          <p className={local.cardTitle}>{sampleOrder.workOrder}</p>
          <em data-state="active">In progress</em>
        </div>
        <dl className={local.previewFacts}>
          <div><dt>Product</dt><dd>{sampleOrder.product} {sampleOrder.code}</dd></div>
          <div><dt>Quantity</dt><dd>{sampleOrder.quantity}</dd></div>
          <div><dt>Specification</dt><dd>{sampleOrder.specification} · Approved</dd></div>
        </dl>
        <ol className={local.previewRoute}>
          {orderSteps("normal").map((step) => (
            <li key={step.area} data-state={step.state}>
              <b>{areaById(step.area).code}</b>
              <span>{areaById(step.area).name}</span>
              <small>{step.state === "active" ? step.note : stepLabels[step.state]}</small>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ManufacturingHero() {
  return (
    <>
      <section className={`site-container ${styles.hero}`} aria-labelledby="manufacturing-title">
        <Eyebrow>Manufacturing &amp; Logistics</Eyebrow>
        <h1 id="manufacturing-title" className={styles.title}>
          <span className={styles.line}><span>Custom software for</span></span>
          <span className={styles.line}><span>manufacturing and logistics.</span></span>
        </h1>
        <p className={styles.lead}>
          We build ERP systems that connect orders, materials, production, and dispatch. Our in-house team creates 3D
          configurators, digital twins, and VR/AR training to help customers and staff understand products and operations.
        </p>
        <div className={styles.heroActions}>
          <PillLink href={pages.contact.path}>Discuss your project</PillLink>
          <a href="#factory-demo" className={styles.textLink}>
            Explore the factory demo
            <ArrowRightIcon />
          </a>
        </div>
        <nav className={local.heroLinks} aria-label="Explore manufacturing and logistics software">
          {heroLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
      </section>

      <div className={`site-container ${local.heroVisual}`}>
        <WorkOrderPreview />
        <p className={local.heroCaption}>Sample metalwork factory: a work order and its route through six production areas.</p>
      </div>
    </>
  );
}
