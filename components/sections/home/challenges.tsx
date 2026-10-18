import { RevealScope } from "@/components/motion/reveal-scope";
import { Eyebrow } from "@/components/ui/eyebrow";
import { challenges, type Challenge } from "@/content/home";
import { Spotlight } from "./spotlight";
import styles from "./challenges.module.css";

function ChallengeIcon({ icon }: { icon: Challenge["icon"] }) {
  const paths = {
    user: <><circle cx="11" cy="8" r="3.6" /><path d="M4.5 20c.6-3.6 3.2-5.6 6.5-5.6 1.2 0 2.3.25 3.2.75M18.5 21v-6.2M15.9 17.2l2.6-2.6 2.6 2.6" /></>,
    chart: <><path d="M10.5 3.5H6A2.5 2.5 0 0 0 3.5 6v12A2.5 2.5 0 0 0 6 20.5h12a2.5 2.5 0 0 0 2.5-2.5v-4.5" /><path d="M8.5 16.5v-4M12 16.5v-7M15.5 16.5V12M16.5 3.5h4v4M20.5 3.5 15 9" /></>,
    frame: <><rect x="3" y="3" width="4" height="4" rx="1" /><rect x="17" y="3" width="4" height="4" rx="1" /><rect x="3" y="17" width="4" height="4" rx="1" /><rect x="17" y="17" width="4" height="4" rx="1" /><path d="M7 5h10M7 19h10M5 7v10M19 7v10" /></>,
  } as const;
  return (
    <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

export function Challenges() {
  return (
    <RevealScope as="section" className={styles.band} data-surface="dark" aria-labelledby="challenges-title">
      <div className={styles.aurora} aria-hidden="true">
        <span data-glow="blue" />
        <span data-glow="violet" />
        <span data-glow="teal" />
      </div>
      <div className={`site-container ${styles.content}`}>
        <div className={styles.heading}>
          <Eyebrow tone="light">For whom</Eyebrow>
          <h2 id="challenges-title" data-reveal="lines">Challenges we solve</h2>
        </div>
        <Spotlight className={styles.grid}>
          {challenges.map((challenge, index) => (
            <article className={styles.card} key={challenge.title} data-spotlight>
              <div className={styles.cardTop}>
                <span className={styles.icon}><ChallengeIcon icon={challenge.icon} /></span>
                <span className={styles.number} aria-hidden="true">/0{index + 1}</span>
              </div>
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
            </article>
          ))}
        </Spotlight>
      </div>
    </RevealScope>
  );
}
