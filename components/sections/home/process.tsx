import Image from "next/image";
import { processSteps } from "@/content/home";
import { ProcessMotion } from "./process-motion";
import styles from "./process.module.css";

export function Process() {
  return (
    <ProcessMotion className={`site-container ${styles.process}`}>
      <div className={styles.copy}>
        <h2 className={styles.word}>PROCESS</h2>
        <ol className={styles.steps}>
          {processSteps.map((step, index) => (
            <li className={styles.step} key={step.title}>
              <span className={styles.index} aria-hidden="true">0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.media}>
        <Image
          src="/images/home/process-foundation.webp"
          alt="Sunlit glass doors opening onto a terrace, overlaid with a card reading “Apply Now Foundation: Unlocking smart capital for data-driven investors”"
          width={653}
          height={979}
          sizes="(max-width: 899px) 100vw, 46vw"
        />
      </div>
    </ProcessMotion>
  );
}
