import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";
import { solutions } from "@/content/solutions";
import styles from "./solution.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return solutions.filter((solution) => !solution.ownPage).map(({ slug }) => ({ slug }));
}

function findSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug && !solution.ownPage);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = findSolution(slug);
  if (!solution) return {};
  // Placeholder pages stay out of search results until they have content.
  const index = siteConfig.indexable && pages.services.status === "published";
  return {
    title: solution.title,
    description: solution.summary,
    alternates: { canonical: `/services/${solution.slug}` },
    robots: { index, follow: index },
  };
}

// Blank for now: a sky hero with the solution's name. The shell renders
// without the URL so navigating here stays instant.
export default function SolutionPage({ params }: Props) {
  return (
    <div className={styles.page} data-sky-scope>
      <SkyFade height="clamp(560px, 46vw, 680px)" />
      <section className={`site-container ${styles.hero}`}>
        <Eyebrow>Solutions</Eyebrow>
        <Suspense fallback={<span className={styles.titleSkeleton} />}>
          <SolutionTitle params={params} />
        </Suspense>
      </section>
    </div>
  );
}

async function SolutionTitle({ params }: Props) {
  const { slug } = await params;
  const solution = findSolution(slug);
  if (!solution) notFound();
  return <h1 className={styles.title}>{solution.title}</h1>;
}
