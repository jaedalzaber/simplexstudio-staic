import type { Route } from "next";
import { pages } from "./pages";

export interface HeroService {
  title: string;
  description: string;
  href: Route;
  image: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  industry: string;
  location: string;
  title: string;
  image: { src: string; width: number; height: number; alt: string };
  stats: readonly { value: string; label: string }[];
}

export interface Challenge {
  icon: "user" | "chart" | "frame";
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ServiceTrack {
  tag: string;
  title: string;
  description: string;
  href: Route;
  image: string;
}

export interface Question {
  question: string;
  answer: string;
}

export const heroServices: readonly HeroService[] = [
  { title: "Design", description: "User interface & user experience design", href: pages.expertise.path, image: "/images/solutions/saas-launch.webp" },
  { title: "Development", description: "Outbound lead generation", href: pages.services.path, image: "/images/solutions/industrial-erp.webp" },
  { title: "Growth", description: "Software development & business automation", href: pages.services.path, image: "/images/solutions/ecommerce.webp" },
];

export const stats: readonly Stat[] = [
  { value: 12, suffix: "+", label: "Years on market" },
  { value: 30, suffix: "+", label: "Countries served" },
  { value: 98, suffix: "%", label: "Clients’ referral rate" },
  { value: 5, suffix: "+", label: "Years average collaboration duration" },
];

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "slattery",
    industry: "Auctions, Heavy Machinery",
    location: "Australia",
    title: "How a Business-Driven UX Strategy Accelerated the Growth of an Australian Auction Platform",
    image: { src: "/images/home/case-slattery.webp", width: 629, height: 461, alt: "Slattery auction app on a phone, showing SUV search results and a featured Lamborghini Urus" },
    stats: [
      { value: "12+", label: "Years on market" },
      { value: "98%", label: "Clients’ referral rate" },
      { value: "5+", label: "Years average collaboration duration" },
    ],
  },
  {
    slug: "fuel-fintech",
    industry: "Fuel, Fintech",
    location: "Ukraine",
    title: "Transforming a Desktop B2B Service Into a Convenient Mobile Tool",
    image: { src: "/images/home/case-fuel.webp", width: 644, height: 384, alt: "Hand holding a phone with fuel card transaction details beside contract top-up notifications" },
    stats: [
      { value: "28%→9%", label: "Drop-offs (68% fewer)" },
      { value: "+19%", label: "Task success rate" },
      { value: "2.1x", label: "Faster time to complete payment" },
    ],
  },
  {
    slug: "toto",
    industry: "Government & Public Service",
    location: "Canada",
    title: "Building a Community App That Lets Residents Shape Their City",
    image: { src: "/images/home/case-toto.webp", width: 1400, height: 914, alt: "Toto community app on a phone against a bright blue backdrop" },
    stats: [{ value: "12+", label: "Years on market" }],
  },
];

export const challenges: readonly Challenge[] = [
  { icon: "user", title: "Design looks generic", description: "Your project doesn't evoke the right emotions or build trust at first glance. We craft premium interfaces that stand out." },
  { icon: "chart", title: "Business metrics have plateaued", description: "Your growth stalled, but the ceiling isn’t real. Our UX/UI design services unlock new revenue streams." },
  { icon: "frame", title: "Interface feels outdated", description: "Your design hasn't evolved with your product and holding you back. We modernize legacy interfaces without disrupting what already works." },
];

export const processSteps: readonly ProcessStep[] = [
  { title: "Streamlined Progress", description: "Our streamlined process puts thoughtful preparation, clear direction, and practical action first, so you move forward with confidence." },
  { title: "Flexible Financing, Tailored To You", description: "We shape the way we work around your goals, your team, and the pace that suits you, from a focused sprint to a long-term partnership." },
  { title: "Reliable And Proven", description: "A trusted, experienced team keeps every detail moving in the right direction, with clear checkpoints and measurable outcomes." },
  { title: "Growth-Focused, Investor First", description: "Your long-term progress guides every decision we make together, from the first workshop to every release that follows." },
];

export const serviceTracks: readonly ServiceTrack[] = [
  { tag: "Demand generation", title: "User interface & user experience design", description: "Make every interaction clear, useful, and built around your customers—an ongoing, data-driven service designed for scaling products.", href: pages.expertise.path, image: "/images/solutions/booking-system.webp" },
  { tag: "Demand generation", title: "Outbound lead generation", description: "Reach the right people with a considered, measurable growth system that keeps your pipeline full long after launch.", href: pages.services.path, image: "/images/solutions/property-management.webp" },
  { tag: "Technology scale", title: "Software development & business automation", description: "Connect your tools and give your people more room to do their best work, with software that scales alongside you.", href: pages.services.path, image: "/images/solutions/product-launch.webp" },
];

export const questions: readonly Question[] = [
  { question: "What’s A Scaling & Digital Transformation Agency?", answer: "In a saturated market of excellent UX design and branding agencies, it's challenging to stand out. At Simplex Studio, we believe our clients' success is intertwined with our own. We forge enduring partnerships based on trust and mutual growth, going beyond world-class services." },
  { question: "What Are Your Core Services", answer: "We bring together customer experience, demand generation, and technology to help businesses move from ideas to measurable progress." },
  { question: "What Are Your Core Services As A UX", answer: "Our UX work spans research, product strategy, interface design, prototyping, and ongoing improvement grounded in real customer needs." },
];
