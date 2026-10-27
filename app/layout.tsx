import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import "./globals.css";

// Helvetica Neue LT Std in its regular width only. Roman, Medium and Bold cover the
// weights every page sets (430–480 resolve to Medium, 600 to Bold) and are preloaded.
const helveticaNeue = localFont({
  src: [
    { path: "./fonts/HelveticaNeueLTStd-Roman.woff2", weight: "400", style: "normal" },
    { path: "./fonts/HelveticaNeueLTStd-Md.woff2", weight: "500", style: "normal" },
    { path: "./fonts/HelveticaNeueLTStd-Bd.woff2", weight: "700", style: "normal" },
  ],
  declarations: [{ prop: "font-family", value: "helveticaNeue" }],
  variable: "--font-helvetica-neue",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

// Heavy (the home page's process word) and Italic (article captions) join the same
// family through the font-family declaration and download only on pages that use
// them. The class on <html> only keeps these faces in the bundle.
const helveticaNeueExtras = localFont({
  src: [
    { path: "./fonts/HelveticaNeueLTStd-Hv.woff2", weight: "800", style: "normal" },
    { path: "./fonts/HelveticaNeueLTStd-It.woff2", weight: "400", style: "italic" },
  ],
  declarations: [{ prop: "font-family", value: "helveticaNeue" }],
  variable: "--font-helvetica-neue-extras",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.locale} className={`${helveticaNeue.variable} ${helveticaNeueExtras.variable}`}>
      <body>{children}</body>
    </html>
  );
}
