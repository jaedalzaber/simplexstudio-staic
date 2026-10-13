import Link from "next/link";
import type { ComponentProps } from "react";
import { classes } from "@/lib/classes";

type Variants = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "large";
};

export function Button({ variant = "primary", size = "default", type = "button", className, ...props }: ComponentProps<"button"> & Variants) {
  return <button {...props} type={type} className={classes("button", className)} data-variant={variant} data-size={size} />;
}

export function ButtonLink({ variant = "primary", size = "default", className, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link {...props} className={classes("button", className)} data-variant={variant} data-size={size} />;
}
