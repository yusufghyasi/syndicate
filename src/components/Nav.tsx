"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Platform", href: "/platform" },
  { label: "Coverage", href: "/coverage" },
  { label: "Advisories", href: "/advisories" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Announcement bar — only visible (solid) once scrolled; fully collapsed
          to zero height at the top so it leaves NO sliver/line over the hero.
          Hidden while the mobile drawer is open so it can't peek above it. */}
      <div
        className={`relative z-50 grid overflow-hidden bg-foreground text-center text-[11px] uppercase tracking-[0.14em] text-background transition-all duration-300 ${
          scrolled && !menuOpen ? "max-h-10 py-2 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        <span className="opacity-85">
          PoC || GTFO — every finding verified by exploitation, never a false positive
        </span>
      </div>

      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-md"
            : "border-0 bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative grid size-6 place-items-center border border-foreground">
              <span className="size-1.5 bg-foreground" />
              <span
                aria-hidden
                className="absolute -left-2 -top-2 text-[8px] leading-none text-muted-foreground/60"
              >
                ◇
              </span>
            </span>
            <span className="font-display text-[14px] font-medium tracking-[0.24em]">
              SYNDICATE
            </span>
          </Link>

          {/* centralized nav */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-[12px] uppercase tracking-[0.1em] transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden bg-foreground px-3.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-85 sm:inline-flex"
            >
              Request access
            </Link>
            {/* Mobile burger — only shown below md */}
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-8 place-items-center border border-border transition-colors hover:bg-muted md:hidden"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu drawer — z-[60] sits ABOVE the scrolled announcement bar
          (z-50) and header (z-40) so neither peeks through when opened mid-page. */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* panel */}
        <nav
          className={`absolute inset-x-0 top-0 origin-top border-b border-border bg-background px-6 pb-8 pt-20 transition-all duration-300 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          {/* Close button lives INSIDE the drawer so it's always clickable even
              when the header burger is covered by this higher-z panel. */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute right-5 top-5 grid size-8 place-items-center border border-border transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
          <div className="flex flex-col gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`border-b border-hairline py-4 text-[15px] uppercase tracking-[0.1em] transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
          <Link
            href="/contact"
            className="mt-8 inline-flex w-full items-center justify-center bg-foreground px-3.5 py-3.5 text-[12px] uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-85"
          >
            Request access
          </Link>
        </nav>
      </div>
    </>
  );
}
