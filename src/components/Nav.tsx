"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Announcement bar — only visible (solid) once scrolled; gone at top */}
      <div
        className={`relative z-50 flex items-center justify-center overflow-hidden bg-foreground text-center text-[11px] uppercase tracking-[0.14em] text-background transition-all duration-300 ${
          scrolled ? "py-2 opacity-100" : "py-0 opacity-0"
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
            : "border-b-0 bg-transparent"
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
              className="bg-foreground px-3.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-85"
            >
              Request access
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
