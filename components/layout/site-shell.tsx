import type { ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { ScrollProvider } from "./scroll-provider";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ScrollProvider>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </ScrollProvider>
  );
}
