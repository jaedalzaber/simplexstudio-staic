import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";

// Next.js 16.4 validates that marketing routes remain fully prerendered.
export const ensureStatic = "navigation";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
