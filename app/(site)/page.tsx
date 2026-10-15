import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import styles from "./home.module.css";

export const metadata = pageMetadata("home");

const stats = [
  ["12+", "Years on market"],
  ["30+", "Countries served"],
  ["98%", "Clients referral rate"],
  ["5+", "Years average collaboration"],
];

const challenges = [
  ["01", "Design looks generic", "Your brand deserves a digital experience that feels unmistakably yours."],
  ["02", "Business metrics have plateaued", "The right strategy can turn a flat growth curve into lasting momentum."],
  ["03", "Interface feels outdated", "Modern tools and thoughtful UX help your team move with confidence."],
];

const services = [
  ["Demand generation", "User interface & user experience design", "Make every interaction clear, useful, and built around your customers."],
  ["Demand generation", "Outbound lead generation", "Reach the right people with a considered, measurable growth system."],
  ["Technology scale", "Software development & business automation", "Connect your tools and give your people more room to do their best work."],
];

const process = [
  ["01", "Streamlined progress", "Our streamlined process puts thoughtful preparation, clear direction, and practical action first."],
  ["02", "Flexible financing, tailored to you", "We shape the way we work around your goals, your team, and the pace that suits you."],
  ["03", "Reliable and proven", "A trusted, experienced team keeps every detail moving in the right direction."],
  ["04", "Growth-focused, investor first", "Your long-term progress guides every decision we make together."],
];

const questions = [
  ["What’s a scaling & digital transformation agency?", "A scaling and digital transformation agency helps ambitious businesses build the strategy, customer experiences, and technology they need to grow with confidence."],
  ["What are your core services?", "We bring together customer experience, demand generation, and technology to help businesses move from ideas to measurable progress."],
  ["What are your core services as a UX agency?", "Our UX work spans research, product strategy, interface design, prototyping, and ongoing improvement grounded in real customer needs."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function CallLink({ light = false }: { light?: boolean }) {
  return <Link className={`${styles.pill} ${light ? styles.pillLight : ""}`} href="/contact">Book a call <Arrow /></Link>;
}

function Dashboard() {
  return (
    <div className={styles.dashboard} aria-label="Illustration of a business analytics dashboard">
      <div className={styles.dashTop}><span className={styles.dashBrand}><i /> AC Retail Balance</span><span className={styles.live}><i /> All data today</span><span className={styles.date}>Last 30 days⌄</span></div>
      <div className={styles.dashHero}>
        <div className={styles.chartCard}><span>Revenue overview</span><strong>$127,420</strong><small>↗ 12.8% this month</small><svg viewBox="0 0 500 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 78 C35 82 42 57 75 65 S120 77 151 52 190 74 222 47 255 64 292 35 324 55 354 30 385 49 420 24 454 36 500 5" /></svg></div>
        <div className={styles.metricStack}><div><small>Monthly recurring</small><strong>$38,240</strong></div><div><small>New customers</small><strong>+24.8%</strong></div></div>
        <div className={styles.barCard}><span>Growth</span><div>{[36, 58, 43, 75, 54, 88, 63, 94, 69, 100].map((v, i) => <i key={i} style={{ height: `${v}%` }} />)}</div></div>
      </div>
      <div className={styles.dashBottom}>
        <div><small>New customers</small><strong>2,418</strong><em>+18.4%</em></div><div><small>Conversion rate</small><strong>7.82%</strong><em>+2.6%</em></div><div className={styles.donut}><i /><span>74%<small>of target</small></span></div><div><small>Lifetime value</small><strong>$1,860</strong><em>+12.1%</em></div>
      </div>
      <div className={styles.table}><span>Recent activity</span><span>Customer <b>Order</b> <b>Amount</b> <b>Status</b></span><span><i>◉</i> Northstar Studio <b>#38291</b> <b>$2,480</b> <b className={styles.paid}>Paid</b></span></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <span className={styles.eyebrow}>Strategy · Design · Technology</span>
        <h1>Scaling &amp; digital<br />transformation partner</h1>
        <p>We’re operating across three interconnected layers<br className={styles.desktopBreak} /> to solve distinct growth constraints by building<br className={styles.desktopBreak} /> experience, demand, and technology in unified systems.</p>
        <CallLink />
        <div className={styles.heroServices}>
          {[["Customer Experience", "User first & user experience design"], ["Demand Generation", "Outbound lead generation"], ["Technology scale", "Software development & automation"]].map(([title, desc], i) => <Link href={i === 0 ? "/expertise" : "/services"} key={title} className={styles.heroService}><span className={styles.serviceNumber}>0{i + 1}</span><strong>{title}</strong><small>{desc}</small><span className={styles.roundArrow}>↗</span></Link>)}
        </div>
      </section>

      <div className={styles.heroCallout}>
        <div><span className={styles.eyebrow}><i /> Your next stage starts here</span><p>Have a growth challenge in mind?</p></div>
        <CallLink />
      </div>

      <section className={styles.intro}>
        <p className={styles.introLead}>At Simplex Studio, we’re a digital transformation company reshaping how businesses generate demand, make decisions, and scale through technology.</p>
        <div className={styles.stats}>{stats.map(([number, label]) => <div key={number}><strong>{number}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className={styles.dashboardSection} aria-label="Business dashboard overview"><Dashboard /></section>

      <section className={styles.challengeSection}>
        <span className={styles.eyebrow}><i /> For whom</span><h2>Challenges we solve</h2>
        <div className={styles.caseStudy}><div className={styles.caseArt}><div className={styles.phone}><span>Good morning, Alex</span><strong>Your business<br />at a glance.</strong><div className={styles.phoneChart}>↗　+24.8%</div><div className={styles.phoneRow}>Revenue <b>$24,860</b></div><div className={styles.phoneRow}>New leads <b>1,284</b></div></div><div className={styles.floatCard}>Growth this month <strong>↗ 18.4%</strong></div></div><div className={styles.caseCopy}><span>✦　Retail, Australia</span><h3>How a Business-Driven UX Strategy Accelerated the Growth of an Australian Auction Platform</h3><div className={styles.caseStats}><div><strong>12+<i>↑</i></strong><small>Years in business</small></div><div><strong>98%<i>↑</i></strong><small>Client satisfaction</small></div><div><strong>5+<i>↑</i></strong><small>Years of partnership</small></div></div></div></div>
        <Link className={styles.textLink} href="/work"><i /> See all work <Arrow /></Link>
      </section>

      <section className={styles.challengeBand}>
        <span className={styles.eyebrow}><i /> For whom</span><h2>Challenges we solve</h2>
        <div className={styles.challengeGrid}>{challenges.map(([n, title, copy]) => <article className={styles.challengeCard} key={n}><span>{n}</span><div className={styles.cardIcon}>✳</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <CallLink light />
      </section>

      <section className={styles.processSection}>
        <div className={styles.processCopy}><h2>PROCESS</h2><div className={styles.processSteps}>{process.map(([n, title, copy]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div>
        <div className={styles.processArt}><div className={styles.arch}><span>SIMPLICITY IN EVERY STEP</span></div><div className={styles.artCaption}><small>01 — THE SIMPLEX APPROACH</small><strong>Move forward<br />with clarity.</strong><Arrow /></div></div>
      </section>

      <section className={styles.servicesBand}>
        <div className={styles.servicesHead}><div><span className={styles.eyebrow}><i /> Our services</span><h2>How we drive scaling &amp;<br />digital transformation</h2></div><p>As a strategic digital transformation company, we help businesses turn their biggest growth constraints into clear, measurable progress—with a connected team by your side.</p></div>
        <div className={styles.serviceGrid}>{services.map(([tag, title, copy], i) => <article key={title} className={styles.serviceCard}><span className={styles.tag}>{tag}<i>0{i + 1}</i></span><h3>{title}</h3><p>{copy}</p><Link href={i === 0 ? "/expertise" : "/services"}>View service <span>↗</span></Link></article>)}</div>
        <div className={styles.servicesCta}><p>Accelerate your<br />digital expansion</p><CallLink /></div>
      </section>

      <section className={styles.faqSection}><div><span className={styles.eyebrow}><i /> For whom</span><h2>Common questions<br />&amp; answers</h2><CallLink /></div><div className={styles.faqList}>{questions.map(([question, answer]) => <details key={question}><summary>{question}<span>＋</span></summary><p>{answer}</p></details>)}</div></section>

      <footer className={styles.footer}>
        <div className={styles.footerGlow} />
        <div className={styles.footerCta}>
          <h2>Unlock your next<br />growth stage</h2>
          <p>We’ve helped our clients secure $100M+ in funding and expand their presence worldwide.</p>
          <CallLink light />
        </div>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <strong className={styles.footerLogo}><span aria-hidden="true">S</span> Simplex<br />Studio</strong>
            <p>We’ve helped our clients secure $100M+ in funding and expand their presence worldwide.</p>
            <CallLink light />
          </div>
          <nav className={styles.footerCol} aria-label="Customer experience links">
            <span>Customer experience</span>
            <Link href="/expertise">Digital product design</Link>
            <Link href="/expertise">AI product design</Link>
            <Link href="/expertise">UI/UX design</Link>
            <Link href="/expertise">UX consulting</Link>
            <Link href="/expertise">UX audit services</Link>
            <Link href="/expertise">Usability testing services</Link>
            <Link href="/expertise">B2B design</Link>
          </nav>
          <nav className={styles.footerCol} aria-label="Technology scale links">
            <span>Technology scale</span>
            <Link href="/services">Digital product design</Link>
            <Link href="/services">AI product design</Link>
            <span className={styles.footerSubhead}>Resources</span>
            <Link href="/services">UX consulting</Link>
            <Link href="/services">UX audit services</Link>
            <Link href="/services">Usability testing services</Link>
          </nav>
        </div>
        <div className={styles.footerLegal}>
          <span className={styles.copyright}>© 2026 Simplex Studio</span>
          <span>Privacy policy</span>
          <span>Terms of use</span>
          <Link className={styles.footerEmail} href="/contact">info@linkupst.com</Link>
          <div className={styles.socials} aria-hidden="true">
            <span aria-hidden="true">f</span><span aria-hidden="true">▶</span><span aria-hidden="true">◎</span><span aria-hidden="true">in</span><span aria-hidden="true">Bē</span>
          </div>
        </div>
        <div className={styles.footerEnd}>
          <Image className={styles.footerBottomGlow} src="/images/references/image%20524.svg" alt="" width={1391} height={318} />
          <Image className={styles.footerWordmark} src="/images/references/Simplex.svg" alt="" width={1318} height={329} />
        </div>
      </footer>
    </div>
  );
}
