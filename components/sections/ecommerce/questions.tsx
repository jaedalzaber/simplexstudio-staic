import { FaqList } from "@/components/sections/home/faq-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { WhatsappIcon } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/pill-link";
import { contactChannels } from "@/content/contact";
import { questions } from "@/content/ecommerce";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

/** Closing call to action beside the FAQ (the site footer follows with its own). */
export function Questions() {
  return (
    <section className={`site-container ${styles.questions}`} aria-labelledby="questions-title">
      <div className={styles.questionsIntro}>
        <Eyebrow>Contact us</Eyebrow>
        <h2 id="questions-title" data-reveal="lines">Tell us about your project</h2>
        <p data-reveal>
          Send your product or store link, your goals, and your target launch date. We’ll review your requirements
          and discuss scope, timing, and budget.
        </p>
        <div className={styles.questionsActions} data-reveal>
          <PillLink href={pages.contact.path}>Discuss your project</PillLink>
          {contactChannels.whatsapp && (
            <a className={styles.whatsapp} href={`https://wa.me/${contactChannels.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon />
              <span>WhatsApp <strong>{contactChannels.phone}</strong></span>
              <span className={styles.visuallyHidden}> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
      <div className={styles.questionsList}>
        <h2 className={styles.visuallyHidden}>Common questions</h2>
        <FaqList items={questions} />
      </div>
    </section>
  );
}
