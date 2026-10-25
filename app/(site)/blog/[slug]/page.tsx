import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RevealScope } from "@/components/motion/reveal-scope";
import { ScrollZoom } from "@/components/motion/scroll-zoom";
import { ArticleBody } from "@/components/sections/blog/article-body";
import { PostCard } from "@/components/sections/blog/post-card";
import { ReadingProgress } from "@/components/sections/blog/reading-progress";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, FacebookIcon, LinkedinIcon, XLogoIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { PillLink } from "@/components/ui/pill-link";
import { ScrollSpyNav } from "@/components/ui/scroll-spy-nav";
import { TalkCard } from "@/components/ui/talk-card";
import { siteConfig } from "@/config/site";
import { articles, postTiles } from "@/content/blog";
import { pages } from "@/content/pages";
import { formatDate } from "@/lib/format";
import styles from "@/components/sections/blog/article.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles().map(({ slug }) => ({ slug }));
}

function findArticle(slug: string) {
  return articles().find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = findArticle(slug);
  if (!post) return {};
  const index = siteConfig.indexable && pages.blog.status === "published";
  const path = `/blog/${post.slug}`;
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.summary,
    alternates: { canonical: path },
    robots: { index, follow: index },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: path,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author.name] : undefined,
    },
  };
}

// The shell (back link) renders without the URL, so navigating here is
// instant; the slug-dependent article streams in behind a skeleton.
export default function ArticlePage({ params }: Props) {
  return (
    <article className={styles.page}>
      <div className={`site-container ${styles.backWrap}`}>
        <Link href={pages.blog.path} className={styles.back}>
          <ArrowLeftIcon />
          Back to blog
        </Link>
      </div>
      <Suspense fallback={<ArticleSkeleton />}>
        <Article params={params} />
      </Suspense>
    </article>
  );
}

function ArticleSkeleton() {
  return (
    <div className={`site-container ${styles.skeleton}`} role="status" aria-label="Loading article">
      <span /><span /><span />
      <div />
    </div>
  );
}

async function Article({ params }: Props) {
  const { slug } = await params;
  const post = findArticle(slug);
  if (!post?.body) notFound();
  const headings = post.body.flatMap((block) => (block.type === "heading" ? [{ id: block.id, text: block.text }] : []));
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const share = [
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, Icon: FacebookIcon },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`, Icon: XLogoIcon },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, Icon: LinkedinIcon },
  ];
  const more = postTiles().filter((tile) => tile.slug !== post.slug).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: url,
  };

  return (
    <RevealScope>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className={`site-container ${styles.head}`}>
        <div className={styles.headMain}>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.summary}>{post.summary}</p>
          {post.author && (
            <div className={styles.author}>
              <span className={styles.avatar}><Media image={post.author.photo} fill sizes="64px" /></span>
              <div>
                <p className={styles.authorName}>{post.author.name}</p>
                <p className={styles.authorRole}>{post.author.role}</p>
              </div>
            </div>
          )}
        </div>
        <dl className={styles.headMeta}>
          <div>
            <dt><CalendarIcon />Published</dt>
            <dd><time dateTime={post.date}>{formatDate(post.date)}</time></dd>
          </div>
          <div>
            <dt><ClockIcon />Read time</dt>
            <dd>{post.readMinutes} min read</dd>
          </div>
        </dl>
      </header>

      <div className={styles.coverWrap}>
        <ScrollZoom className={styles.cover}>
          <div className={styles.coverMedia}>
            <Media image={{ ...post.cover, width: 1424, height: 800 }} fill sizes="(max-width: 1500px) 100vw, 1424px" preload />
          </div>
        </ScrollZoom>
      </div>

      <div className={`site-container ${styles.layout}`}>
        <ReadingProgress className={styles.main}>
          <ArticleBody blocks={post.body} />
        </ReadingProgress>

        <aside className={styles.sidebar} aria-label="Article tools">
          <div className={styles.sticky}>
            <ScrollSpyNav title="In this article" items={headings} />
            <TalkCard />
            <div className={styles.share}>
              <span>Share link:</span>
              <ul>
                {share.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon /></a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {more.length > 0 && (
        <section className={`site-container ${styles.more}`} aria-labelledby="more-title">
          <div className={styles.moreHead}>
            <div>
              <Eyebrow>Keep reading</Eyebrow>
              <h2 id="more-title" data-reveal="lines">More insights</h2>
            </div>
            <PillLink href={pages.blog.path} size="md">All articles</PillLink>
          </div>
          <div className={styles.moreGrid} data-reveal="stagger">
            {more.map((tile) => <PostCard key={tile.slug} post={tile} />)}
          </div>
        </section>
      )}
    </RevealScope>
  );
}
