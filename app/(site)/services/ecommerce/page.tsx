import type { Metadata } from "next";
import { RevealScope } from "@/components/motion/reveal-scope";
import { EcommerceHero } from "@/components/sections/ecommerce/hero";
import { Offer } from "@/components/sections/ecommerce/offer";
import { OneTeam } from "@/components/sections/ecommerce/one-team";
import { Outcomes } from "@/components/sections/ecommerce/outcomes";
import { Process } from "@/components/sections/ecommerce/process";
import { Proof } from "@/components/sections/ecommerce/proof";
import { Questions } from "@/components/sections/ecommerce/questions";
import { Situations } from "@/components/sections/ecommerce/situations";
import { Work } from "@/components/sections/ecommerce/work";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

const description = "Custom ecommerce design and development for product brands, including branding, 3D visuals, configurators, and ongoing support from one in-house team.";
// Follows the Services section's publication status.
const index = siteConfig.indexable && pages.services.status === "published";

export const metadata: Metadata = {
  title: "Ecommerce Design & Development for Product Brands",
  description,
  alternates: { canonical: "/services/ecommerce" },
  robots: { index, follow: index },
  openGraph: { title: "Custom ecommerce design and development", description, url: "/services/ecommerce", siteName: siteConfig.name, type: "website" },
};

export default function EcommercePage() {
  return (
    <RevealScope className={styles.page} data-sky-scope>
      <SkyFade height="clamp(820px, 72vw, 1040px)" />
      <EcommerceHero />
      <Proof />
      <Work />
      <Situations />
      <Outcomes />
      <OneTeam />
      <Process />
      <Offer />
      <Questions />
    </RevealScope>
  );
}
