import { Eyebrow } from "@/components/ui/eyebrow";
import { orderParts, sampleOrder, sampleQuote } from "@/content/factory-demo";
import { configurationOutcomes, workflow } from "@/content/manufacturing";
import shared from "@/components/sections/solution/solution.module.css";
import { IsoBoxes, IsoLine, IsoText, enclosureBoxes, viewBoxFor, type Vec3 } from "./iso";
import styles from "./manufacturing.module.css";
import previews from "./previews.module.css";

const money = (value: number) => value.toLocaleString("en-US");
const quoteTotal = sampleQuote.lines.reduce((sum, line) => sum + line.quantity * line.unit, 0);
const { height, width, depth } = sampleOrder.size;

/** The configured enclosure with its dimensions, as an isometric drawing. */
function ProductDrawing() {
  const dimension = { stroke: "#2f6fd6", strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" as const };
  const label = { className: previews.dimension, textAnchor: "middle" as const };
  const corners: Vec3[] = [[-200, 0, depth], [0, height, 0], [width, height, 0], [width + 160, 0, 0], [0, -40, depth + 200], [width, -40, depth + 200]];
  return (
    <svg viewBox={viewBoxFor(corners, 60)} className={previews.drawing} aria-hidden="true">
      <IsoBoxes boxes={enclosureBoxes()} />
      <IsoLine from={[0, -40, depth + 90]} to={[width, -40, depth + 90]} {...dimension} />
      <IsoText at={[width / 2, -40, depth + 90]} dy="80" {...label}>{width}</IsoText>
      <IsoLine from={[-90, 0, depth]} to={[-90, height, depth]} {...dimension} />
      <IsoText at={[-90, height / 2, depth]} dx="-50" {...label}>{height}</IsoText>
      <IsoLine from={[width + 90, -40, 0]} to={[width + 90, -40, depth]} {...dimension} />
      <IsoText at={[width + 90, -40, depth / 2]} dx="70" dy="40" {...label}>{depth}</IsoText>
    </svg>
  );
}

export function Configuration() {
  return (
    <section className={`site-container ${styles.configuration}`} aria-labelledby="configuration-title">
      <div className={styles.splitHead}>
        <div className={shared.sectionHead}>
          <Eyebrow>Configuration and quoting</Eyebrow>
          <h2 id="configuration-title" data-reveal="lines">Connect product configuration <br />to production planning</h2>
        </div>
        <p data-reveal>
          Let customers or sales teams configure a product in 3D and request a quote. Use the approved specification to
          prepare materials and production work, based on your engineering and manufacturing rules.
        </p>
      </div>

      <ol className={styles.workflow} data-reveal="stagger">
        {workflow.map((step, index) => (
          <li key={step.label} data-approval={"approval" in step || undefined}>
            <span aria-hidden="true">0{index + 1}</span>
            {step.label}
            {"approval" in step && <em>Approval</em>}
          </li>
        ))}
      </ol>

      <div className={styles.configBoard} data-reveal="scale">
        <div className={previews.configurator} role="img" aria-label={`Configured ${sampleOrder.product.toLowerCase()} ${sampleOrder.code}, ${height} by ${width} by ${depth} millimetres, quantity ${sampleOrder.quantity}`}>
          <p className={previews.cardKicker}>Configure · {sampleOrder.code}</p>
          <ProductDrawing />
          <dl className={previews.options}>
            <div><dt>Size</dt><dd>{height} × {width} × {depth} mm</dd></div>
            <div><dt>Material</dt><dd>{sampleOrder.material}</dd></div>
            <div><dt>Door</dt><dd>{sampleOrder.door}</dd></div>
            <div><dt>Finish</dt><dd>{sampleOrder.finish}</dd></div>
            <div><dt>Extras</dt><dd>{sampleOrder.extras.join(", ")}</dd></div>
            <div><dt>Quantity</dt><dd>{sampleOrder.quantity}</dd></div>
          </dl>
        </div>

        <div className={previews.card} role="img" aria-label={`Quote ${sampleOrder.quote} with sample prices, accepted and converted to sales order ${sampleOrder.salesOrder}`}>
          <div className={previews.cardHead}>
            <p className={previews.cardKicker}>Quote {sampleOrder.quote}</p>
            <em data-state="done">Accepted</em>
          </div>
          <ul className={previews.quoteLines}>
            {sampleQuote.lines.map((line) => (
              <li key={line.item}>
                <span><b>{line.item}</b><small>{line.detail}</small></span>
                <span>{line.quantity} × {money(line.unit)}</span>
                <strong>{money(line.quantity * line.unit)}</strong>
              </li>
            ))}
          </ul>
          <p className={previews.quoteTotal}><span>Total, {sampleQuote.currency}</span><strong>{money(quoteTotal)}</strong></p>
          <p className={previews.cardNote}>Sample prices. Converted to sales order {sampleOrder.salesOrder}.</p>
        </div>

        <div className={previews.card} role="img" aria-label={`Material list for ${sampleOrder.quantity} enclosures from approved specification ${sampleOrder.specification}, released to work order ${sampleOrder.workOrder}`}>
          <div className={previews.cardHead}>
            <p className={previews.cardKicker}>Material list · {sampleOrder.specification}</p>
            <em data-state="approved">Approved</em>
          </div>
          <ul className={previews.partList}>
            {orderParts.map((part) => (
              <li key={part.code}>
                <code>{part.code}</code>
                <span>{part.name}</span>
                <strong>{part.quantity} {part.unit}</strong>
              </li>
            ))}
          </ul>
          <p className={previews.cardNote}>Released to work order {sampleOrder.workOrder} after engineering approval.</p>
        </div>
      </div>

      <ul className={styles.outcomes} data-reveal="stagger">
        {configurationOutcomes.map((outcome) => (
          <li key={outcome.title}>
            <h3>{outcome.title}</h3>
            <p>{outcome.text}</p>
          </li>
        ))}
      </ul>

      <p className={styles.note} data-reveal>
        A bill of materials is the list of parts and quantities needed to make the product. Generating it automatically
        is a scoped feature that needs validated product rules and engineering data, and an approval step stays in place
        before work enters production.
      </p>
    </section>
  );
}
