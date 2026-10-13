import type { ComponentProps } from "react";
import { classes } from "@/lib/classes";

type Props = ComponentProps<"div"> & { width?: "default" | "reading" };

export function Container({ width = "default", className, ...props }: Props) {
  return <div {...props} className={classes("site-container", className)} data-width={width} />;
}
