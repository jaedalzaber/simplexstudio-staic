import Link from "next/link";
import { RevealScope } from "@/components/motion/reveal-scope";
import { Logo } from "@/components/brand/logo";
import { BehanceIcon, FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/pill-link";
import { contactNavigation, footerNavigation } from "@/config/navigation";
import { FooterWordmark } from "./footer-wordmark";
import styles from "./footer.module.css";

const [experience, technology, resources] = footerNavigation;
const socials = [FacebookIcon, YoutubeIcon, InstagramIcon, LinkedinIcon, BehanceIcon];

function LinkColumn({ title, links, muted = false }: { title: string; links: typeof experience.links; muted?: boolean }) {
  return (
    <div className={styles.column}>
      <h3 data-case={muted ? "sentence" : "upper"}>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <RevealScope as="footer" className={styles.footer} data-surface="dark">
      <div className={styles.beams} aria-hidden="true" />
      <div className={`site-container ${styles.content}`}>
        <div className={styles.cta}>
          <h2 data-reveal="lines">Unlock your next<br />growth stage</h2>
          <p data-reveal data-reveal-delay="0.15">We’ve helped our clients secure $100M+ in funding and expand their presence worldwide.</p>
          <div data-reveal data-reveal-delay="0.25">
            <PillLink href={contactNavigation.href} tone="light">Book a call</PillLink>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="Simplex Studio home">
              <Logo width={182} alt="" className={styles.logo} />
            </Link>
            <p>We’ve helped our clients secure $100M+ in funding and expand their presence worldwide.</p>
            <PillLink href={contactNavigation.href} tone="light" size="sm">Book a call</PillLink>
          </div>
          <nav className={styles.columns} aria-label="Footer">
            <LinkColumn title={experience.title} links={experience.links} />
            <div className={styles.stacked}>
              <LinkColumn title={technology.title} links={technology.links} muted />
              <LinkColumn title={resources.title} links={resources.links} muted />
            </div>
          </nav>
        </div>

        <div className={styles.legal}>
          <div className={styles.legalStart}>
            <span className={styles.copyright}>© 2026 Simplex Studio</span>
            <span className={styles.policy}>Privacy policy</span>
            <span className={styles.policy}>Terms of Use</span>
          </div>
          <div className={styles.legalEnd}>
            <a className={styles.email} href="mailto:info@linkupst.com">info@linkupst.com</a>
            <div className={styles.socials} aria-hidden="true">
              {socials.map((Icon, index) => <Icon key={index} />)}
            </div>
          </div>
        </div>
      </div>
      <FooterWordmark />
    </RevealScope>
  );
}
