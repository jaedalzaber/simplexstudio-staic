import { CaseStudies } from "@/components/sections/home/case-studies";
import { Challenges } from "@/components/sections/home/challenges";
import { Clients } from "@/components/sections/home/clients";
import { Faq } from "@/components/sections/home/faq";
import { Hero } from "@/components/sections/home/hero";
import { Intro } from "@/components/sections/home/intro";
import { Process } from "@/components/sections/home/process";
import { Services } from "@/components/sections/home/services";
import { Showreel } from "@/components/sections/home/showreel";
import { Solutions } from "@/components/sections/home/solutions";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("home");

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Showreel />
      <CaseStudies />
      <Challenges />
      <Clients />
      <Process />
      <Solutions />
      <Services />
      <Faq />
    </>
  );
}
