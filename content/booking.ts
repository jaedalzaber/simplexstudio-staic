import type { Question } from "./home";
import type { ImageSlot } from "./types";

// Copy for /services/booking-system. The section strategy lives in
// docs/superpowers/specs/2026-10-25-booking-solution-content.md.

export const heroLinks = [
  { label: "Appointments and reservations", href: "#flows-title" },
  { label: "2D and 3D selection", href: "#demo-title" },
  { label: "Customer management", href: "#management-title" },
  { label: "Websites and apps", href: "#builders-title" },
] as const;

/** Still of the demo restaurant, captured from the 3D room. */
export const roomPreview: ImageSlot = { src: "/images/booking/room-preview.webp", alt: "", width: 1440, height: 960 };

export interface Project {
  name: string;
  kind: string;
  text: string;
  url: string;
  image: ImageSlot;
}

// Add two or three approved projects with contribution captions; the section stays hidden until then.
// Keep the restaurant demo separate from client work.
export const projects: readonly Project[] = [];

export const businessTypes = [
  { icon: "stay", business: "Hotels and stays", choice: "Dates, guests, and an available room or room type." },
  { icon: "desk", business: "Workspaces", choice: "A desk, meeting room, or workspace for a chosen time." },
  { icon: "restaurant", business: "Restaurants", choice: "Party size, time, and a suitable table or seating area." },
  { icon: "clinic", business: "Clinics and dental practices", choice: "A service, practitioner, and appointment time." },
  { icon: "consultation", business: "Professional services", choice: "A service, staff member, or consultation slot." },
  { icon: "transport", business: "Transport", choice: "A route, departure, and available seat." },
] as const;

export type BusinessIcon = (typeof businessTypes)[number]["icon"];

export const managementViews = [
  { id: "calendar", title: "Booking calendar", text: "Review appointments or reservations by date, staff member, or resource, according to the agreed setup." },
  { id: "customers", title: "Customer records", text: "Keep contact details, booking history, and submitted information together for follow-up." },
  { id: "availability", title: "Availability and resources", text: "Manage opening hours, service duration, staff schedules, and capacity as required by the business." },
] as const;

export type ManagementView = (typeof managementViews)[number]["id"];

export const builderViews = [
  { title: "Booking form builder", text: "Arrange service choices, custom questions, date and time, and customer details, so each booking arrives with the information your team needs." },
  { title: "Website and page builder", text: "We design a new website or improve your existing brand presence, then give your team editable pages for ongoing updates." },
] as const;

export const channels = [
  { title: "Customer apps", text: "Browse services or spaces, book, and review reservations." },
  { title: "Staff tools", text: "View the schedule and update booking status." },
  { title: "On-site screens", text: "A self-service booking or check-in screen, or a display showing room and slot availability." },
] as const;

export const steps = [
  { title: "Plan", text: "Map booking rules, customer steps, staff workflows, and integrations." },
  { title: "Design", text: "Develop the interfaces, brand assets, and venue visuals needed." },
  { title: "Build", text: "Customise the software and connect the agreed channels and tools." },
  { title: "Launch and support", text: "Test the booking flow, prepare the team, and support updates." },
] as const;

export const questions: readonly Question[] = [
  { question: "Do we need 3D booking?", answer: "Not always. A calendar or 2D plan may be enough. We recommend 3D when the layout, location, or setting helps customers choose." },
  { question: "Can you adapt the system to our process?", answer: "Yes. We review your services, resources, booking rules, forms, and staff roles, then agree the customisation required." },
  { question: "Can it work with our existing website and tools?", answer: "We review your website and the available integrations before agreeing how they will connect." },
  { question: "Can we add apps or on-site screens later?", answer: "Yes. We plan them as optional phases where the software, devices, and operating needs support them." },
  { question: "What will it cost and how long will it take?", answer: "The estimate depends on the booking rules, channels, visuals, customisation, and integrations required. We agree it after reviewing your requirements." },
];
