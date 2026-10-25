import { AboutHero } from "@/components/sections/about/about-hero";
import { Gallery } from "@/components/sections/about/gallery";
import { Impact } from "@/components/sections/about/impact";
import { Story } from "@/components/sections/about/story";
import { Team } from "@/components/sections/about/team";
import { Values } from "@/components/sections/about/values";
import { Clients } from "@/components/sections/home/clients";
import { disciplines, galleryRows, team, values } from "@/content/about";
import { pageMetadata } from "@/lib/metadata";
import heroStyles from "@/components/sections/about/about-hero.module.css";

export const metadata = pageMetadata("about");

export default function AboutPage() {
  return (
    <>
      <AboutHero disciplines={disciplines}>
        <Clients className={heroStyles.clients} eager />
      </AboutHero>
      <Story />
      <Impact />
      <Gallery rows={galleryRows} />
      <Values values={values} />
      <Team members={team} />
    </>
  );
}
