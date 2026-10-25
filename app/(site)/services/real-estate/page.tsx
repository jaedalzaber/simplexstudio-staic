import type { Metadata } from "next";
import { RevealScope } from "@/components/motion/reveal-scope";
import { RealEstateHero } from "@/components/sections/real-estate/hero";
import { Configuration } from "@/components/sections/real-estate/configuration";
import { Management } from "@/components/sections/real-estate/management";
import { Questions } from "@/components/sections/real-estate/questions";
import { Selection } from "@/components/sections/real-estate/selection";
import { Team } from "@/components/sections/real-estate/team";
import { Visuals } from "@/components/sections/real-estate/visuals";
import { Websites } from "@/components/sections/real-estate/websites";
import { Work } from "@/components/sections/real-estate/work";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

const description = "Real estate 3D rendering, architectural animation, web and VR tours, interior configurators, property websites, and management tools from one in-house team.";
// Follows the Services section's publication status.
const index = siteConfig.indexable && pages.services.status === "published";

export const metadata: Metadata = {
  title: "Real Estate 3D Rendering, Configurators & Websites",
  description,
  alternates: { canonical: "/services/real-estate" },
  robots: { index, follow: index },
  openGraph: { title: "3D rendering and configurators for real estate", description, url: "/services/real-estate", siteName: siteConfig.name, type: "website" },
};

export default function RealEstatePage() {
  return (
    <RevealScope className={styles.page} data-sky-scope>
      <SkyFade height="clamp(820px, 72vw, 1040px)" />
      <RealEstateHero />
      <Visuals />
      <Selection />
      <Configuration />
      <Work />
      <Websites />
      <Management />
      <Team />
      <Questions />
    </RevealScope>
  );
}
