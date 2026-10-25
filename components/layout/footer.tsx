import Link from "next/link";
import { RevealScope } from "@/components/motion/reveal-scope";
import { Logo } from "@/components/brand/logo";
import { BehanceIcon, FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/pill-link";
import { contactNavigation, footerNavigation } from "@/config/navigation";
import { contactChannels } from "@/content/contact";
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
          <h2 data-reveal="lines">Discuss your <br />next project</h2>
          <p data-reveal data-reveal-delay="0.15">Tell us what you need to launch, improve, or build. Our team can help with design, development, and marketing.</p>
          <div data-reveal data-reveal-delay="0.25">
            <PillLink href={contactNavigation.href} tone="light">Contact us</PillLink>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="Simplex Studio home">
              <Logo width={182} alt="" className={styles.logo} />
            </Link>
            <p>We help companies develop their brands, websites, and digital products.</p>
            <PillLink href={contactNavigation.href} tone="light" size="sm">Contact us</PillLink>
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
            <a className={styles.email} href={`mailto:${contactChannels.email}`}>{contactChannels.email}</a>
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
