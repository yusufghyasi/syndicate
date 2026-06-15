import Link from "next/link";
import { DiagnosticsPanel, ClientReadout } from "./Diagnostics";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Platform", href: "/platform" },
      { label: "Coverage", href: "/coverage" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Advisories", href: "/advisories" },
      { label: "Disclosure policy", href: "/advisories" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Request access", href: "/contact" },
      { label: "Book a call", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Trust center", href: "/contact" },
      { label: "Status", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <ClientReadout />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* left: about + columns */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-5 place-items-center border border-foreground">
                <span className="size-1.5 bg-foreground" />
              </span>
              <span className="font-display text-[12px] font-medium tracking-[0.24em]">
                SYNDICATE
              </span>
            </div>
            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-muted-foreground">
              A fully autonomous penetration testing platform. It assesses your
              applications without human intervention and proves what&apos;s real.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {COLS.map((c) => (
                <div key={c.title}>
                  <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {c.title}
                  </div>
                  <ul className="space-y-2">
                    {c.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-[12px] text-foreground/80 transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* right: diagnostics */}
          <DiagnosticsPanel />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-[11px] uppercase tracking-[0.1em] text-muted-foreground sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <span className="size-1.5 bg-accent-green" /> All systems operational
          </span>
          <span>Syndicate © 2026 · PoC || GTFO</span>
        </div>
      </div>
    </footer>
  );
}
