import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { ProjectsCarousel } from "./projects-carousel";
import styles from "./services.module.css";

export const metadata = pageMetadata("services");

const capabilities = [
  ["Strategic Experience Optimization", "Align product strategy, research, and interface decisions around the needs of your customers and business."],
  ["Product Design & UX", "Shape digital experiences through discovery, user journeys, interface design, and prototyping."],
  ["Mobile App Design", "Design clear mobile product journeys around the way people use your service every day."],
  ["MVP Development", "Turn an early product idea into a focused first release your team can learn from."],
  ["Software Development & Automation", "Connect products and business workflows with practical software and automation."],
  ["Outbound Lead Generation", "Build a thoughtful outreach system that helps your team reach the right people."],
];

const approach = [
  { number: "01", title: "OKR-driven, measurable functional design", description: "We connect product decisions to the goals that matter, using research and clear measures to guide the work." },
  { number: "02", title: "Experience-driven emotional design", description: "We bring clarity and care to every interaction, so the product feels useful as well as easy to use." },
];

const process = ["01", "02", "03", "04"];

function BookCallLink({ light = false }: { light?: boolean }) {
  return (
    <Link className={`${styles.bookCall} ${light ? styles.bookCallLight : ""}`} href="/contact" aria-label="Book a call">
      {light ? <><i aria-hidden="true" /><span>Book a call</span><b aria-hidden="true">↗</b></> : <Image src="/images/services/book-call.svg" alt="" width={233} height={63} />}
    </Link>
  );
}

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <section className={styles.intro} aria-labelledby="services-title">
        <div className={styles.introVisual}>
          <span className={styles.eyebrow}><i /> Services</span>
          <Image
            className={styles.apartmentArt}
            src="/images/services/smart-apartment.svg"
            alt="Smart apartment interface with controls for lighting, climate, and home devices"
            width={629}
            height={647}
            priority
          />
          <BookCallLink />
        </div>
        <div className={styles.capabilities}>
          <h1 id="services-title">Our core capabilities</h1>
          <div className={styles.capabilityList}>
            {capabilities.map(([title, description], index) => (
              <details className={styles.capability} key={title} open={index === 0}>
                <summary>
                  <span>{title}</span>
                  <i aria-hidden="true" />
                </summary>
                <p>{description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.impact} aria-labelledby="impact-title" data-surface="dark">
        <div className={styles.impactGlow} aria-hidden="true" />
        <div className={styles.sectionIntro}>
          <span className={styles.darkEyebrow}><i /> For whom</span>
          <div className={styles.impactHeading}>
            <h2 id="impact-title">Real impact, real outcome</h2>
            <p>Each outcome is supported by our UX/UI interface design practice, grounded in research, human insight, and thoughtful experimentation.</p>
          </div>
        </div>
        <ProjectsCarousel />
        <div className={styles.outcomes}>
          <div className={styles.outcomeHeading}>
            <span className={styles.darkEyebrow}><i /> Our impact</span>
            <div>
              <h3>Design that delivers real business impact</h3>
              <p>We measure our success by your growth.</p>
            </div>
          </div>
          <div className={styles.outcomeGrid}>
            <div><strong>40+</strong><span>International design awards</span></div>
            <div><strong>200+</strong><span>Successfully delivered projects</span></div>
            <div><strong>10</strong><span>Years average collaboration duration</span></div>
          </div>
        </div>
      </section>

      <section className={styles.approachSection} aria-labelledby="approach-title" data-surface="dark">
        <div className={styles.approachGlow} aria-hidden="true" />
        <div className={styles.approachTop}>
          <div className={styles.approachCopy}>
            <span className={styles.darkEyebrow}><i /> User experience at Simplex Studio</span>
            <h2 id="approach-title">The core of our approach</h2>
            <div className={styles.principles}>
              {approach.map((item) => (
                <article className={styles.principle} key={item.number}>
                  <span>Part {item.number}</span>
                  <div><h3>{item.title}</h3><p>{item.description}</p></div>
                </article>
              ))}
            </div>
          </div>
          <Image
            className={styles.dashboardArt}
            src="/images/services/product-dashboard.png"
            alt="Mobile product dashboard with revenue and engagement indicators"
            width={1632}
            height={1632}
            sizes="(max-width: 760px) 100vw, 48vw"
          />
        </div>
        <div className={styles.processIntro}>
          <span className={styles.darkEyebrow}><i /> Our process</span>
          <div>
            <h2>From insight to impact</h2>
            <p>Our UX/UI design services ensure decisions are rigorously validated through measurable experience signals, leaving absolutely no room for guesswork.</p>
            <BookCallLink light />
          </div>
        </div>
        <ol className={styles.processSteps}>
          {process.map((number) => (
            <li key={number}>
              <div className={styles.processPills}><span>Strategy &amp; Discovery</span><span>UX Research</span></div>
              <span className={styles.stepDot} aria-hidden="true" />
              <span className={styles.stepNumber}>Step /{number}</span>
            </li>
          ))}
        </ol>
        <Image
          className={styles.sectionEndArt}
          src="/images/services/image 533.svg"
          alt=""
          aria-hidden="true"
          width={1600}
          height={299}
          sizes="100vw"
        />
      </section>
    </div>
  );
}
