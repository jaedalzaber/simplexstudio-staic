import Image from "next/image";
import type { ImageSlot } from "@/content/types";
import { classes } from "@/lib/classes";
import styles from "./media.module.css";

type MediaProps = {
  image: ImageSlot;
  sizes: string;
  className?: string;
  /** Cover the nearest positioned parent instead of sizing from the image. */
  fill?: boolean;
  preload?: boolean;
};

/**
 * Renders the slot's image, or a neutral grey placeholder with the same
 * proportions until a `src` is supplied in the content file.
 */
export function Media({ image, sizes, className, fill = false, preload = false }: MediaProps) {
  if (image.src) {
    return fill
      ? <Image className={classes(styles.image, className)} src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} />
      : <Image className={classes(styles.image, className)} src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} preload={preload} />;
  }

  return (
    <div
      className={classes(styles.placeholder, className)}
      data-fill={fill || undefined}
      style={fill ? undefined : { aspectRatio: `${image.width} / ${image.height}` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width={44} height={44} fill="none">
        <rect x="6" y="9" width="36" height="30" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="19" r="3.5" stroke="currentColor" strokeWidth="2" />
        <path d="m6.5 33 10-9.5 7 6.5 6-5 12 9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
