"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/brand/logo";
import { contactNavigation, primaryNavigation } from "@/config/navigation";
import { classes } from "@/lib/classes";
import styles from "./header.module.css";
import { Container } from "./container";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function Arrow() {
  return (
    <svg className={styles.arrow} width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12 12 4M4 4h8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContactLink({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href={contactNavigation.href} className={classes(styles.contact, className)} onClick={onClick}>
      <span className={styles.contactPill}>
        <span className={styles.dot} aria-hidden="true" />
        {contactNavigation.label}
        <Arrow />
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 12, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const dropdownToggleRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const id = useId();
  const navigationId = `${id}-navigation`;

  function closeMenus() {
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  useEffect(() => {
    if (!mobileOpen && !openDropdown) return;

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (openDropdown) {
        dropdownToggleRefs.current[openDropdown]?.focus();
        setOpenDropdown(null);
      } else {
        setMobileOpen(false);
        menuToggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, openDropdown]);

  useEffect(() => {
    // Reset disclosure state when switching between desktop and mobile layouts.
    const breakpoint = window.matchMedia("(max-width: 799px)");
    function onBreakpointChange() {
      setMobileOpen(false);
      setOpenDropdown(null);
    }
    breakpoint.addEventListener("change", onBreakpointChange);
    return () => breakpoint.removeEventListener("change", onBreakpointChange);
  }, []);

  return (
    <>
    <header className={styles.header} ref={headerRef} data-transparent={pathname === "/" && !scrolled && !mobileOpen}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Simplex Studio home" onClick={closeMenus}>
          <Logo width={92} alt="" className={styles.logo} preload />
        </Link>

        <nav id={navigationId} className={styles.navigation} aria-label="Main navigation" data-open={mobileOpen} data-lenis-prevent={mobileOpen || undefined}>
          <ul className={styles.list}>
            {primaryNavigation.map((item) => {
              const expanded = openDropdown === item.label;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const dropdownId = `${id}-${item.label.toLowerCase()}-links`;
              return (
                <li className={styles.item} key={item.label} onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenDropdown((current) => current === item.label ? null : current);
                  }
                }}>
                  {item.children?.length ? (
                    <>
                      <button
                        ref={(element) => { dropdownToggleRefs.current[item.label] = element; }}
                        type="button"
                        className={styles.dropdownToggle}
                        aria-expanded={expanded}
                        aria-controls={dropdownId}
                        data-active={active}
                        onClick={() => setOpenDropdown(expanded ? null : item.label)}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowDown") {
                            event.preventDefault();
                            setOpenDropdown(item.label);
                            requestAnimationFrame(() => document.getElementById(dropdownId)?.querySelector<HTMLAnchorElement>("a")?.focus());
                          }
                        }}
                      >
                        {item.label}
                        <svg className={styles.chevron} width={9} height={9} viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="m2 4 3 3 3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <ul id={dropdownId} className={styles.dropdown} hidden={!expanded} data-lenis-prevent>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className={styles.dropdownLink} aria-current={pathname === child.href ? "page" : undefined} onClick={closeMenus}>
                              {child.label}
                              <Arrow />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={item.href} className={styles.navLink} aria-current={active ? "page" : undefined} onClick={closeMenus}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <ContactLink className={styles.mobileContact} onClick={closeMenus} />
        </nav>

        <ContactLink className={styles.desktopContact} onClick={closeMenus} />

        <button
          ref={menuToggleRef}
          type="button"
          className={styles.menuToggle}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-controls={navigationId}
          aria-expanded={mobileOpen}
          onClick={() => { setMobileOpen(!mobileOpen); setOpenDropdown(null); }}
        >
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d={mobileOpen ? "m5 5 10 10M5 15 15 5" : "M3 6h14M3 14h14"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </Container>
    </header>
    {pathname !== "/" && <div className={styles.spacer} aria-hidden="true" />}
    </>
  );
}
