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
