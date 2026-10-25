import { FaqList } from "@/components/sections/home/faq-list";
import { Eyebrow } from "@/components/ui/eyebrow";
import { WhatsappIcon } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/pill-link";
import { contactChannels } from "@/content/contact";
import { pages } from "@/content/pages";
import { questions } from "@/content/real-estate";
import styles from "@/components/sections/solution/solution.module.css";

/** Closing enquiry beside the FAQ (the site footer follows with its own call to action). */
export function Questions() {
  return (
    <section className={`site-container ${styles.questions}`} aria-labelledby="questions-title">
      <div className={styles.questionsIntro}>
        <Eyebrow>Contact us</Eyebrow>
        <h2 id="questions-title" data-reveal="lines">Discuss your real estate project</h2>
        <p data-reveal>
          Share your development, current website, or management requirements. We’ll review what you need and discuss
          the scope, budget, and launch plan.
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
