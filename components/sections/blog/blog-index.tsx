"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { PostTile } from "@/content/blog";
import type { BlogCategory } from "@/content/types";
import { FeaturedPost, PostCard } from "./post-card";
import styles from "./blog.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

type BlogIndexProps = {
  posts: readonly PostTile[];
  categories: readonly BlogCategory[];
  pageSize: number;
};

/** Category filter, the featured post plus grid, and page numbers. */
export function BlogIndex({ posts, categories, pageSize }: BlogIndexProps) {
  const [category, setCategory] = useState<BlogCategory>(categories[0]);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const id = useId();

  const matching = posts.filter((post) => post.categories.includes(category));
  const pages = Math.max(1, Math.ceil(matching.length / pageSize));
  const [featured, ...rest] = matching.slice((page - 1) * pageSize, page * pageSize);

  function choose(next: BlogCategory) {
    setCategory(next);
    setPage(1);
  }

  function goTo(next: number) {
    setPage(next);
    const list = listRef.current;
    if (list) lenis?.scrollTo(list, { offset: -140 });
  }

  return (
    <>
      <FilterTabs options={categories} value={category} onChange={choose} label="Filter articles" controls={`${id}-list`} size="md" className={styles.filters} />
      <p className={styles.visuallyHidden} aria-live="polite">
        {matching.length} {category} articles{pages > 1 ? `, page ${page} of ${pages}` : ""}
      </p>

      <div ref={listRef} id={`${id}-list`} className={styles.list}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${category}-${page}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, ease }}
          >
            {featured && <div data-reveal="scale"><FeaturedPost post={featured} /></div>}
            {rest.length > 0 && (
              <div className={styles.grid} data-reveal="stagger">
                {rest.map((post) => <PostCard key={post.slug} post={post} />)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {pages > 1 && (
        <nav className={styles.pagination} aria-label="Article pages">
          <button type="button" className={styles.pageArrow} onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ArrowLeftIcon />
          </button>
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              className={styles.pageNumber}
              aria-current={number === page ? "page" : undefined}
              aria-label={`Page ${number}`}
              onClick={() => goTo(number)}
            >
              {number}
            </button>
          ))}
          <button type="button" className={styles.pageArrow} onClick={() => goTo(page + 1)} disabled={page === pages} aria-label="Next page">
            <ArrowRightIcon />
          </button>
        </nav>
      )}
    </>
  );
}
