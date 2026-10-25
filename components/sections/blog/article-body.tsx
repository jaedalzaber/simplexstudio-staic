import { Media } from "@/components/ui/media";
import { PlayIcon } from "@/components/ui/icons";
import type { ArticleBlock } from "@/content/types";
import styles from "./article.module.css";

/** Renders an article's content blocks as semantic HTML. */
export function ArticleBody({ blocks }: { blocks: readonly ArticleBlock[] }) {
  return (
    <div className={styles.body}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "heading":
            return <h2 key={index} id={block.id} data-reveal>{block.text}</h2>;
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={index}>
                {block.items.map((item) => (
                  <li key={item.text}>{item.lead && <strong>{item.lead} </strong>}{item.text}</li>
                ))}
              </List>
            );
          }
          case "figure":
            return (
              <figure key={index} className={styles.figure} data-reveal="scale">
                <div className={styles.figureMedia}><Media image={block.image} sizes="(max-width: 899px) 100vw, 720px" /></div>
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          case "video":
            return (
              <figure key={index} className={styles.figure} data-reveal="scale">
                <div className={styles.figureMedia}>
                  <Media image={block.poster} sizes="(max-width: 899px) 100vw, 720px" />
                  {block.href && (
                    <a className={styles.play} href={block.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch: ${block.caption}`}>
                      <PlayIcon />
                    </a>
                  )}
                </div>
                <figcaption>{block.caption}</figcaption>
              </figure>
            );
          case "callout":
            return <aside key={index} className={styles.callout}><p>{block.text}</p></aside>;
        }
      })}
    </div>
  );
}
