import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { fill: "none", "aria-hidden": true, focusable: false } as const;

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} {...base} {...props}>
      <path d="M5.5 14.5 14.5 5.5M7 5.5h7.5V13" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 14 30" width={14} height={30} {...base} {...props}>
      <path d="M7 29V2M1.5 7.5 7 2l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MonitorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <rect x="2.75" y="3.75" width="18.5" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 16.5V20M8 20.25h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.75 12h18.5M12 2.75c2.6 2.6 3.9 5.68 3.9 9.25S14.6 18.65 12 21.25C9.4 18.65 8.1 15.57 8.1 12S9.4 5.35 12 2.75Z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M8 5.5v13M16 5.5v13" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M13.4 21v-7.8h2.6l.4-3h-3V8.3c0-.87.25-1.47 1.5-1.47h1.6V4.13A21 21 0 0 0 14.17 4C11.85 4 10.3 5.42 10.3 8v2.2H7.7v3h2.6V21h3.1Z" fill="currentColor" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.27 5 12 5 12 5s-6.27 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.77 1.77C5.73 19 12 19 12 19s6.27 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" fill="currentColor" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M4.2 9.2h3.4V20H4.2V9.2ZM5.9 3.8a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM9.7 9.2h3.25v1.48h.05c.45-.85 1.56-1.75 3.2-1.75 3.43 0 4.06 2.25 4.06 5.18V20h-3.38v-5.25c0-1.25-.02-2.86-1.75-2.86-1.75 0-2.02 1.37-2.02 2.77V20H9.7V9.2Z" fill="currentColor" />
    </svg>
  );
}

export function BehanceIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M8.6 11.4c.9-.43 1.37-1.1 1.37-2.13C9.97 7.2 8.43 6.7 6.65 6.7H1.75V17.3h5.04c1.89 0 3.66-.9 3.66-3.01 0-1.3-.62-2.27-1.85-2.6ZM4.04 8.5h2.15c.83 0 1.57.23 1.57 1.19 0 .89-.58 1.25-1.4 1.25H4.04V8.5Zm2.45 6.99H4.04v-2.92h2.5c1 0 1.64.42 1.64 1.48 0 1.05-.76 1.44-1.69 1.44ZM17.04 9.37c-2.48 0-4.17 1.87-4.17 4.31 0 2.54 1.6 4.28 4.17 4.28 1.95 0 3.21-.88 3.82-2.75h-1.98c-.21.7-1.1 1.07-1.78 1.07-1.33 0-2.02-.78-2.02-2.09h5.88c.09-2.62-1.39-4.82-3.92-4.82Zm-1.96 3.48c.07-1.08.79-1.75 1.86-1.75 1.13 0 1.69.66 1.79 1.75h-3.65ZM14.45 6.9h4.72v1.15h-4.72V6.9Z" fill="currentColor" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M20 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M8.6 3.5H6.2A2.2 2.2 0 0 0 4 5.8C4.4 13.6 10.4 19.6 18.2 20a2.2 2.2 0 0 0 2.3-2.2v-2.4a1.3 1.3 0 0 0-1-1.3l-3.1-.8a1.3 1.3 0 0 0-1.3.4l-1.1 1.3a11.4 11.4 0 0 1-5-5l1.3-1.1a1.3 1.3 0 0 0 .4-1.3L9.9 4.5a1.3 1.3 0 0 0-1.3-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M12 2.75a9.25 9.25 0 0 0-7.98 13.93L2.9 21.1l4.5-1.1A9.25 9.25 0 1 0 12 2.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8.9 7.6c.2-.4.5-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.2.3 0 .6.5.8 1 1.4 1.7 2 .6.5 1.3.9 1.9 1.1.3.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.4.3.1.2.1.8-.2 1.4-.3.7-1.4 1.2-1.9 1.2-.5.1-1.1.2-3.4-.8-2.6-1.1-4.2-3.7-4.4-3.9-.1-.2-1-1.3-1-2.6 0-1.2.6-1.8.9-2.1Z" fill="currentColor" />
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M20.5 11.2A8.5 8.5 0 1 1 12.8 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16.4 11.5a4.4 4.4 0 1 1-3.9-3.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m12 12 6.5-6.5M15.5 5.5v3h3l2-2h-3v-3l-2 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PuzzleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M9 4.5a2 2 0 1 1 4 0V6h3.5A1.5 1.5 0 0 1 18 7.5V11h1.5a2 2 0 1 1 0 4H18v3.5a1.5 1.5 0 0 1-1.5 1.5H13v-1.5a2 2 0 1 0-4 0V20H5.5A1.5 1.5 0 0 1 4 18.5V15h1.5a2 2 0 1 0 0-4H4V7.5A1.5 1.5 0 0 1 5.5 6H9V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <circle cx="12" cy="12" r="8.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XLogoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M17.6 3.5h3l-6.6 7.5 7.8 9.5h-6.1l-4.8-6-5.5 6H2.4l7-7.9L2 3.5h6.2l4.3 5.5 5.1-5.5Zm-1 15.3h1.7L7.4 5.1H5.6l11 13.7Z" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BedIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M3 5.5v14M3 15h18v4.5M21 15v-3a3 3 0 0 0-3-3h-7.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5.5" y="10" width="3" height="2.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function DeskIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <rect x="7.5" y="3.5" width="9" height="6.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 10v3.5M3 13.5h18M5 13.5v7M19 13.5v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CutleryIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M6 3.5v5a2.75 2.75 0 0 0 5.5 0v-5M8.75 3.5v17M17.5 20.5v-17c-2 1.4-3.25 3.9-3.25 7v3.25h3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ToothIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <path d="M7.5 4C5 4 4 6 4 8.2c0 2.2 1 3.3 1.5 5.3.6 2.4.8 6.5 2.6 6.5 1.6 0 1.6-4.8 3.9-4.8s2.3 4.8 3.9 4.8c1.8 0 2-4.1 2.6-6.5.5-2 1.5-3.1 1.5-5.3C20 6 19 4 16.5 4c-1.8 0-2.7 1-4.5 1S9.3 4 7.5 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function ConsultationIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <circle cx="9" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 20c.6-3 2.8-4.75 5.5-4.75s4.9 1.75 5.5 4.75M15 3.5h4.5A1.5 1.5 0 0 1 21 5v3a1.5 1.5 0 0 1-1.5 1.5H18l-2 1.75V9.5h-1A1.5 1.5 0 0 1 13.5 8V5A1.5 1.5 0 0 1 15 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...base} {...props}>
      <rect x="5" y="3.5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 11h14M8 17.5v3M16 17.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8.5" cy="14.25" r="1" fill="currentColor" />
      <circle cx="15.5" cy="14.25" r="1" fill="currentColor" />
    </svg>
  );
}
