import Link from "next/link";
import { ExploreCursor } from "@/components/ui/explore-cursor";
import { Media } from "@/components/ui/media";
import type { PostTile } from "@/content/blog";
import { PostMeta } from "./post-meta";
import styles from "./blog.module.css";

/** Grid card: cover, date and read time, title. Links to the article when it has one. */
export function PostCard({ post, headingLevel: Heading = "h3" }: { post: PostTile; headingLevel?: "h2" | "h3" }) {
  const media = <Media image={post.cover} sizes="(max-width: 760px) 100vw, 522px" className={styles.cardImage} />;
  return (
    <article className={styles.card}>
      {post.href ? (
        // The title link carries the name; this duplicate stays out of the tab order.
        <Link href={post.href} className={styles.cardMedia} tabIndex={-1} aria-hidden="true">
          {media}
          <ExploreCursor label="Read article" />
        </Link>
      ) : (
        <div className={styles.cardMedia}>{media}</div>
      )}
      <PostMeta date={post.date} readMinutes={post.readMinutes} />
      <Heading className={styles.cardTitle}>
        {post.href ? <Link href={post.href}>{post.title}</Link> : post.title}
      </Heading>
    </article>
  );
}

/** Wide lead story with its date and title laid over the cover. */
export function FeaturedPost({ post }: { post: PostTile }) {
  return (
    <article className={styles.featured}>
      <Media image={post.cover} fill sizes="(max-width: 1180px) 100vw, 1100px" className={styles.cardImage} />
      <span className={styles.featuredShade} aria-hidden="true" />
      <div className={styles.featuredText}>
        <PostMeta date={post.date} readMinutes={post.readMinutes} className={styles.featuredMeta} />
        <h2 className={styles.featuredTitle}>
          {/* Stretched over the whole card so the cover is clickable too. */}
          {post.href ? <Link href={post.href} className={styles.stretch}>{post.title}</Link> : post.title}
        </h2>
      </div>
      {post.href && <ExploreCursor label="Read article" />}
    </article>
  );
}
