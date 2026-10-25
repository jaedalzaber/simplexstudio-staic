import type { Metadata } from "next";
import { RevealScope } from "@/components/motion/reveal-scope";
import { Builders } from "@/components/sections/booking/builders";
import { Channels } from "@/components/sections/booking/channels";
import { Demo } from "@/components/sections/booking/demo";
import { Flows } from "@/components/sections/booking/flows";
import { BookingHero } from "@/components/sections/booking/hero";
import { Management } from "@/components/sections/booking/management";
import { Questions } from "@/components/sections/booking/questions";
import { Team } from "@/components/sections/booking/team";
import { Work } from "@/components/sections/booking/work";
import { SkyFade } from "@/components/ui/sky-backdrop";
import { siteConfig } from "@/config/site";
import { pages } from "@/content/pages";
import styles from "@/components/sections/solution/solution.module.css";

const description = "Custom booking systems for appointments, spaces, and seats, with 2D and 3D selection, customer management, websites, and apps from one team.";
// Follows the Services section's publication status.
const index = siteConfig.indexable && pages.services.status === "published";

export const metadata: Metadata = {
  title: "Custom Booking Systems, Websites & Apps",
  description,
  alternates: { canonical: "/services/booking-system" },
  robots: { index, follow: index },
  openGraph: { title: "Custom booking systems for services and spaces", description, url: "/services/booking-system", siteName: siteConfig.name, type: "website" },
};

export default function BookingSystemPage() {
  return (
    <RevealScope className={styles.page} data-sky-scope>
      <SkyFade height="clamp(820px, 72vw, 1040px)" />
      <BookingHero />
      <Work />
      <Flows />
      <Demo />
      <Management />
      <Builders />
      <Channels />
      <Team />
      <Questions />
    </RevealScope>
  );
}
