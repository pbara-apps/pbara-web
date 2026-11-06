"use client";

import { usePrefersReducedMotion } from "@/components/site/motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion} from "framer-motion";
import { FiArrowRight, FiArrowUpRight, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/lib/cn";
import { useScrollSize } from "@/hooks/useScrollSize";
import { PORTAL_LINKS } from "@/lib/portal";

type NavChild = { href: string; label: string; description: string };
type NavItem = { href: string; label: string; children?: NavChild[] };

const NAV: NavItem[] = [
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "Who we are", description: "Our heritage and identity" },
      { href: "/about#mission", label: "Mission & vision", description: "What we stand for" },
      { href: "/about#objectives", label: "Cardinal objectives", description: "The seven aims of RA" },
      { href: "/about#director", label: "Director's desk", description: "A word from the Director" },
    ],
  },
  {
    href: "/events",
    label: "Programs",
    children: [
      { href: "/events", label: "Events & programs", description: "Camps, drills, competitions" },
      { href: "/registration", label: "Open registrations", description: "Register and pay online" },
    ],
  },
  { href: "/chapters", label: "Chapters" },
  { href: "/executives", label: "Leadership" },
  {
    href: "/news",
    label: "Newsroom",
    children: [
      { href: "/news", label: "News & announcements", description: "Updates from the association" },
      { href: "/media", label: "Media gallery", description: "Photos, videos and downloads" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

/** Pixels scrolled before the bar switches from "over hero" to solid. */
const SCROLL_SOLID_THRESHOLD = 24;

function matches(pathname: string, href: string) {
  const path = href.split("#")[0];
  return pathname === path || (path !== "/" && pathname.startsWith(path));
}

function isItemActive(pathname: string, item: NavItem) {
  if (matches(pathname, item.href)) return true;
  return item.children?.some((c) => matches(pathname, c.href)) ?? false;
}

function DesktopDropdown({
  item,
  active,
  light,
}: {
  item: NavItem;
  active: boolean;
  light: boolean;
}) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <li
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
          light
            ? active
              ? "text-ink"
              : "text-ink/70 hover:text-ink"
            : active
              ? "text-white"
              : "text-white/75 hover:text-white",
        )}
      >
        {item.label}
        <FiChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")}
          aria-hidden
        />
        {active ? (
          <span aria-hidden className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
        ) : null}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_30px_80px_-24px_rgba(5,6,31,0.45)] ring-1 ring-line">
              <ul>
                {item.children!.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="group/item flex items-start justify-between gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-ivory focus:bg-ivory focus:outline-none"
                    >
                      <span>
                        <span className="block text-[14px] font-semibold text-ink">
                          {child.label}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-text-muted">
                          {child.description}
                        </span>
                      </span>
                      <FiArrowRight
                        className="mt-1 h-4 w-4 shrink-0 -translate-x-1 text-gold opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScrollSize();
  const reduced = usePrefersReducedMotion();

  const isHome = pathname === "/";
  const overHero = isHome && scrollY <= SCROLL_SOLID_THRESHOLD && !mobileOpen;
  const light = !overHero && !mobileOpen;

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock page scroll and allow Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ease-brand",
        mobileOpen
          ? "bg-ink"
          : overHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line bg-ivory/85 backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <nav
        className="container-site relative flex h-[72px] items-center justify-between gap-3 sm:gap-6"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="PBA Royal Ambassadors home"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-gold/60 transition-transform duration-500 ease-brand group-hover:rotate-[8deg]">
            <Image
              src="/images/ra-logo.png"
              alt=""
              width={40}
              height={40}
              className="rounded-full object-contain"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
             <span
              className={cn(
                "font-heading text-[16px] font-extrabold tracking-[-0.02em] transition-colors min-[360px]:text-[18px]",
                light ? "text-ink" : "text-white",
              )}
            >
              Royal Ambassadors
            </span>
            <span
              className={cn(
                "mt-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors min-[360px]:text-[11px] min-[360px]:tracking-[0.2em]",
                light ? "text-text-muted" : "text-white/60",
              )}
            >
              Pentecost Baptist Assoc.
            </span>
           
            
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active = isItemActive(pathname, item);
            if (item.children) {
              return (
                <DesktopDropdown
                  key={item.href}
                  item={item}
                  active={active}
                  light={light}
                />
              );
            }
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                    light
                      ? active
                        ? "text-ink"
                        : "text-ink/70 hover:text-ink"
                      : active
                        ? "text-white"
                        : "text-white/75 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
                {active ? (
                  <motion.span
                    layoutId="nav-active-dot"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    aria-hidden
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold"
                  />
                ) : null}
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/registration"
            className={cn(
              "btn group hidden min-h-[42px] px-5 text-[13.5px] sm:inline-flex",
              light ? "btn-navy" : "btn-gold",
            )}
          >
            Register
            <FiArrowRight className="btn-arrow h-4 w-4" aria-hidden />
          </Link>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold touch-manipulation lg:hidden",
              light
                ? "border-line bg-white text-ink hover:bg-mist"
                : "border-white/20 bg-white/5 text-white hover:bg-white/10",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <FiX className="h-5 w-5" aria-hidden />
            ) : (
              <FiMenu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-72px)] overflow-y-auto bg-ink text-white lg:hidden"
          >
            <div className="container-site flex min-h-full flex-col pb-10 pt-6">
              <ul className="flex flex-col">
                {NAV.map((item, i) => {
                  const active = isItemActive(pathname, item);
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduced ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduced ? 0 : 0.04 * i + 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-white/10 py-4"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between font-heading text-[28px] font-bold tracking-[-0.03em]",
                          active ? "text-gold" : "text-white",
                        )}
                      >
                        {item.label}
                        <FiArrowRight className="h-5 w-5 text-white/30" aria-hidden />
                      </Link>
                      {item.children && item.children.length > 1 ? (
                        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                          {item.children.slice(1).map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className="text-[14px] text-white/60 transition-colors hover:text-white"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <Link
                  href="/registration"
                  className="btn btn-gold group w-full"
                >
                  Register for a program
                  <FiArrowRight className="btn-arrow h-4 w-4" aria-hidden />
                </Link>
              </div>

              <div className="mt-auto pt-10">
                <p className="eyebrow text-white/40">Member portals</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {PORTAL_LINKS.map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 transition-colors hover:border-white/30"
                      >
                        <span>
                          <span className="block text-sm font-semibold">{p.label}</span>
                          <span className="block text-xs text-white/50">{p.hint}</span>
                        </span>
                        <FiArrowUpRight className="h-4 w-4 text-white/40" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
