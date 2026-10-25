import type { Metadata } from "next";
import { RevealScope } from "@/components/motion/reveal-scope";
import { Capabilities } from "@/components/sections/manufacturing/capabilities";
import { Configuration } from "@/components/sections/manufacturing/configuration";
import { Demo } from "@/components/sections/manufacturing/demo";
import { Erp } from "@/components/sections/manufacturing/erp";
import { ManufacturingHero } from "@/components/sections/manufacturing/hero";
import { Logistics } from "@/components/sections/manufacturing/logistics";
import { Questions } from "@/components/sections/manufacturing/questions";
import { Skywings } from "@/components/sections/manufacturing/skywings";
import { Training } from "@/components/sections/manufacturing/training";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

const description = "Custom manufacturing ERP and logistics software, 3D product configurators, factory digital twins, and VR/AR training from one in-house team.";
// Follows the Services section's publication status.
const index = siteConfig.indexable && pages.services.status === "published";

export const metadata: Metadata = {
  title: "Manufacturing ERP, Logistics Software & Digital Twins",
  description,
  alternates: { canonical: "/services/industrial-erp" },
  robots: { index, follow: index },
  openGraph: { title: "Custom software for manufacturing and logistics", description, url: "/services/industrial-erp", siteName: siteConfig.name, type: "website" },
};

export default function ManufacturingPage() {
  return (
    <RevealScope className={styles.page} data-sky-scope>
      <SkyFade height="clamp(820px, 72vw, 1040px)" />
      <ManufacturingHero />
      <Skywings />
      <Configuration />
      <Erp />
      <Logistics />
      <Demo />
      <Training />
      <Capabilities />
      <Questions />
    </RevealScope>
  );
}
