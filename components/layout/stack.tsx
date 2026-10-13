import type { ComponentProps, CSSProperties } from "react";
import { classes } from "@/lib/classes";

type Props = ComponentProps<"div"> & { gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 };

export function Stack({ gap = 4, className, style, ...props }: Props) {
  const styles = { "--stack-gap": `var(--space-${gap})`, ...style } as CSSProperties;
  return <div {...props} className={classes("stack", className)} style={styles} />;
}
