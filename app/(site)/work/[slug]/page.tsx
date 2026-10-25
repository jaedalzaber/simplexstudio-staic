import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RevealScope } from "@/components/motion/reveal-scope";
import { ScrollZoom } from "@/components/motion/scroll-zoom";
import { WorkCard } from "@/components/sections/work/work-card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowLeftIcon, GlobeIcon, MonitorIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { PillLink } from "@/components/ui/pill-link";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { StatRow } from "@/components/ui/stat-row";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";
import { caseStudies, workTiles } from "@/content/work";
import styles from "@/components/sections/work/case-study.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies().map(({ slug }) => ({ slug }));
}

function findStudy(slug: string) {
  return caseStudies().find((entry) => entry.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = findStudy(slug);
  if (!entry) return {};
  const index = siteConfig.indexable && pages.work.status === "published";
  const path = `/work/${entry.slug}`;
  return {
    title: entry.seo?.title ?? entry.client ?? entry.title,
    description: entry.seo?.description ?? entry.summary,
    alternates: { canonical: path },
    robots: { index, follow: index },
    openGraph: { title: entry.title, description: entry.summary, url: path, siteName: siteConfig.name, type: "article" },
  };
}

// The shell (sky, back link) renders without the URL, so navigating here is
// instant; the slug-dependent study streams in behind a skeleton.
export default function CaseStudyPage({ params }: Props) {
  return (
    <article className={styles.page} data-sky-scope>
      <SkyFade height="clamp(760px, 66vw, 950px)" />
      <div className={`site-container ${styles.backWrap}`}>
        <Link href={pages.work.path} className={styles.back}>
          <ArrowLeftIcon />
          All case studies
        </Link>
      </div>
      <Suspense fallback={<CaseStudySkeleton />}>
        <CaseStudy params={params} />
      </Suspense>
    </article>
  );
}

function CaseStudySkeleton() {
  return (
    <div className={`site-container ${styles.skeleton}`} role="status" aria-label="Loading case study">
      <span /><span /><span />
      <div />
    </div>
  );
}

async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const entry = findStudy(slug);
  if (!entry?.study) notFound();
  const { study } = entry;
  const more = workTiles().filter((tile) => tile.slug !== entry.slug).slice(0, 2);

  return (
    <RevealScope>
      <header className={`site-container ${styles.hero}`}>
        <ul className={styles.meta}>
          <li><MonitorIcon />{entry.industry}</li>
          <li><GlobeIcon />{entry.location}</li>
        </ul>
        <h1 id="case-title" className={styles.title}>{entry.title}</h1>
        <p className={styles.lead}>{entry.summary}</p>
      </header>

      <div className={`site-container ${styles.coverWrap}`}>
        <ScrollZoom className={styles.cover}>
          <div className={styles.coverMedia}>
            <Media image={entry.cover} fill sizes="(max-width: 1400px) 100vw, 1330px" preload />
          </div>
        </ScrollZoom>
      </div>

      <section className={`site-container ${styles.overview}`} aria-label="Project overview">
        <dl className={styles.facts} data-reveal="stagger">
          {entry.client && <div><dt>Client</dt><dd>{entry.client}</dd></div>}
          <div><dt>Industry</dt><dd>{entry.industry}</dd></div>
          <div><dt>Location</dt><dd>{entry.location}</dd></div>
          <div><dt>Platforms</dt><dd>{study.platforms}</dd></div>
          <div>
            <dt>Services</dt>
            <dd><ul className={styles.tags}>{study.services.map((service) => <li key={service}>{service}</li>)}</ul></dd>
          </div>
        </dl>
        <StatRow stats={study.stats} columns={3} className={styles.stats} />
      </section>

      {study.chapters.map((chapter, index) => (
        <section className={`site-container ${styles.chapter}`} key={chapter.label} aria-labelledby={`chapter-${index}`}>
          <div className={styles.chapterLabel}>
            <span className={styles.chapterIndex} aria-hidden="true">0{index + 1}</span>
            <Eyebrow>{chapter.label}</Eyebrow>
          </div>
          <div className={styles.chapterBody}>
            <h2 id={`chapter-${index}`} data-reveal="lines">{chapter.title}</h2>
            {chapter.body.map((paragraph) => <p key={paragraph.slice(0, 24)} data-reveal>{paragraph}</p>)}
          </div>
          {chapter.image && (
            <div className={styles.chapterMedia} data-reveal="scale">
              <Media image={chapter.image} sizes="(max-width: 1400px) 100vw, 1330px" />
            </div>
          )}
        </section>
      ))}

      <section className={`site-container ${styles.gallery}`} aria-label="Project gallery">
        {study.gallery.map((image, index) => (
          <div className={styles.galleryItem} data-wide={index === 0 || undefined} data-reveal="scale" key={image.alt}>
            <Media image={image} fill sizes={index === 0 ? "(max-width: 1400px) 100vw, 1330px" : "(max-width: 899px) 100vw, 660px"} />
          </div>
        ))}
      </section>

      <section className={`site-container ${styles.more}`} aria-labelledby="more-title">
        <div className={styles.moreHead}>
          <div>
            <Eyebrow>Keep exploring</Eyebrow>
            <h2 id="more-title" data-reveal="lines">More case studies</h2>
          </div>
          <PillLink href={pages.work.path} size="md">See all work</PillLink>
        </div>
        <div className={styles.moreGrid}>
          {more.map((tile) => <WorkCard key={tile.slug} entry={tile} headingLevel="h3" />)}
        </div>
      </section>
    </RevealScope>
  );
}
