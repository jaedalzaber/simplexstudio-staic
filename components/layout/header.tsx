"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Logo } from "@/components/brand/logo";
import { PillLink } from "@/components/ui/pill-link";
import { contactNavigation, primaryNavigation, type NavigationMenu } from "@/config/navigation";
import { Container } from "./container";
import { CapabilitiesMenu, SolutionsMenu } from "./header-menus";
import styles from "./header.module.css";

const mobileQuery = "(max-width: 799px)";
const hoverQuery = "(hover: hover) and (pointer: fine)";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function subscribeToMobile(callback: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const ease = [0.16, 1, 0.3, 1] as const;

const desktopPanel: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.985, filter: "blur(6px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.45, ease, staggerChildren: 0.012, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: -6, scale: 0.99, filter: "blur(4px)", transition: { duration: 0.22, ease: "easeIn" } },
};

const mobilePanel: Variants = {
  hidden: { opacity: 0, height: 0 },
  show: { opacity: 1, height: "auto", transition: { duration: 0.45, ease, staggerChildren: 0.015 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease } },
};

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const scrolled = useSyncExternalStore(subscribeToScroll, () => window.scrollY > 12, () => false);
  const isMobile = useSyncExternalStore(subscribeToMobile, () => window.matchMedia(mobileQuery).matches, () => false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const toggleRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number | undefined>(undefined);
  const id = useId();
  const navigationId = `${id}-navigation`;
  const anyMenuOpen = Boolean(openMenu || hoveredMenu);

  function closeMenus() {
    window.clearTimeout(closeTimer.current);
    setMobileOpen(false);
    setOpenMenu(null);
    setHoveredMenu(null);
  }

  // Tuck the bar away while reading downward; bring it back on any upward scroll.
  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 8) return;
      setHidden(delta > 0 && y > 320);
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen && !anyMenuOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) closeMenus();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (openMenu || hoveredMenu) {
        toggleRefs.current[openMenu ?? hoveredMenu ?? ""]?.focus();
        setOpenMenu(null);
        setHoveredMenu(null);
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
  }, [mobileOpen, anyMenuOpen, openMenu, hoveredMenu]);

  useEffect(() => {
    // Reset disclosure state when switching between desktop and mobile layouts.
    const breakpoint = window.matchMedia(mobileQuery);
    breakpoint.addEventListener("change", closeMenus);
    return () => breakpoint.removeEventListener("change", closeMenus);
  }, []);

  // Freeze smooth scrolling behind the full-screen mobile menu.
  useEffect(() => {
    if (!lenis) return;
    if (mobileOpen) lenis.stop();
    else lenis.start();
  }, [lenis, mobileOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const transparent = pathname === "/" && !scrolled && !mobileOpen;

  return (
    <>
      <header
        ref={headerRef}
        className={styles.header}
        data-transparent={transparent}
        data-hidden={hidden && !anyMenuOpen && !mobileOpen}
        data-mobile-open={mobileOpen}
      >
        <div className={styles.bar} aria-hidden="true" />
        <Container className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label="Simplex Studio home" onClick={closeMenus}>
            <Logo width={121} alt="" className={styles.logo} preload />
          </Link>

          <nav id={navigationId} className={styles.navigation} aria-label="Main navigation" data-open={mobileOpen} data-lenis-prevent={mobileOpen || undefined}>
            <ul className={styles.list}>
              {primaryNavigation.map((item, index) => {
                const expanded = openMenu === item.label || hoveredMenu === item.label;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const panelId = `${id}-${item.label.toLowerCase()}-menu`;
                const menu: NavigationMenu | undefined = item.menu;

                return (
                  <li
                    className={styles.item}
                    key={item.label}
                    data-menu={menu}
                    style={{ "--i": index } as CSSProperties}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setOpenMenu((current) => current === item.label ? null : current);
                        setHoveredMenu((current) => current === item.label ? null : current);
                      }
                    }}
                    onMouseEnter={() => {
                      if (!window.matchMedia(hoverQuery).matches || isMobile) return;
                      window.clearTimeout(closeTimer.current);
                      if (menu) {
                        setOpenMenu(null);
                        setHoveredMenu(item.label);
                      } else {
                        setHoveredMenu(null);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!window.matchMedia(hoverQuery).matches || isMobile) return;
                      window.clearTimeout(closeTimer.current);
                      closeTimer.current = window.setTimeout(() => {
                        setHoveredMenu((current) => current === item.label ? null : current);
                      }, 140);
                    }}
                  >
                    {menu ? (
                      <>
                        <button
                          ref={(element) => { toggleRefs.current[item.label] = element; }}
                          type="button"
                          className={styles.toggle}
                          aria-expanded={expanded}
                          aria-controls={panelId}
                          data-active={active}
                          onClick={() => setOpenMenu((current) => current === item.label ? null : item.label)}
                          onFocus={(event) => {
                            if (event.currentTarget.matches(":focus-visible") && !isMobile) setOpenMenu(item.label);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "ArrowDown") {
                              event.preventDefault();
                              setOpenMenu(item.label);
                              requestAnimationFrame(() => document.getElementById(panelId)?.querySelector<HTMLAnchorElement>("a")?.focus());
                            }
                          }}
                        >
                          {expanded && !isMobile && (
                            <motion.span
                              layoutId="header-menu-tab"
                              className={styles.tab}
                              aria-hidden="true"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.35, ease }}
                            />
                          )}
                          <span className={styles.toggleLabel}>{item.label}</span>
                          <svg className={styles.chevron} width={9} height={9} viewBox="0 0 10 10" fill="none" aria-hidden="true">
                            <path d="m2 4 3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              key={item.label}
                              id={panelId}
                              className={styles.panel}
                              data-menu={menu}
                              data-lenis-prevent
                              variants={isMobile ? mobilePanel : desktopPanel}
                              initial="hidden"
                              animate="show"
                              exit="exit"
                            >
                              {menu === "capabilities" ? <CapabilitiesMenu onNavigate={closeMenus} /> : <SolutionsMenu onNavigate={closeMenus} />}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={item.href} className={styles.navLink} aria-current={active ? "page" : undefined} onClick={closeMenus}>
                        <span className={styles.toggleLabel}>{item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <PillLink href={contactNavigation.href} size="md" className={styles.mobileContact} onClick={closeMenus} magnetic={false}>
              {contactNavigation.label}
            </PillLink>
          </nav>

          <PillLink href={contactNavigation.href} size="md" className={styles.desktopContact} onClick={closeMenus}>
            {contactNavigation.label}
          </PillLink>

          <button
            ref={menuToggleRef}
            type="button"
            className={styles.menuToggle}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-controls={navigationId}
            aria-expanded={mobileOpen}
            onClick={() => { setMobileOpen(!mobileOpen); setOpenMenu(null); }}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </Container>
      </header>
      {pathname !== "/" && <div className={styles.spacer} aria-hidden="true" />}
    </>
  );
}
