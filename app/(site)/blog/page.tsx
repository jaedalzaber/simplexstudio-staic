import { RevealScope } from "@/components/motion/reveal-scope";
import { BlogIndex } from "@/components/sections/blog/blog-index";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { blogCategories, blogPageSize, postTiles } from "@/content/blog";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/sections/blog/blog.module.css";

export const metadata = pageMetadata("blog");

export default function BlogPage() {
  return (
    <RevealScope className={styles.page} data-sky-scope>
      <SkyFade height="clamp(760px, 62vw, 900px)" className={styles.sky} />
      <section className={`site-container ${styles.hero}`} aria-labelledby="blog-title">
        <h1 id="blog-title" className={styles.title}>Insights</h1>
        <p className={styles.lead}>Our thoughts, data, hot trends about user experience, digital solutions and business.</p>
      </section>
      <BlogIndex posts={postTiles()} categories={blogCategories} pageSize={blogPageSize} />
    </RevealScope>
  );
}
