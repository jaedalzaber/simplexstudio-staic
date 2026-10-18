import { RevealScope } from "@/components/motion/reveal-scope";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PillLink } from "@/components/ui/pill-link";
import { questions } from "@/content/home";
import { pages } from "@/content/pages";
import { FaqList } from "./faq-list";
import styles from "./faq.module.css";

export function Faq() {
  return (
    <RevealScope as="section" className={`site-container ${styles.faq}`} aria-labelledby="faq-title">
      <div className={styles.intro}>
        <Eyebrow>For whom</Eyebrow>
        <h2 id="faq-title" data-reveal="lines">Common questions<br />&amp; answers</h2>
        <div data-reveal data-reveal-delay="0.2">
          <PillLink href={pages.contact.path}>Ask a question</PillLink>
        </div>
      </div>
      <FaqList items={questions} />
    </RevealScope>
  );
}
