import Link from "next/link";
import AsciiArt from "@/components/ascii/AsciiArt";
import { HERO } from "@/components/ascii/art";
import Bracketed from "@/components/Bracketed";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      <span className="size-1.5 bg-accent-red" />
      {children}
    </span>
  );
}

export function SolidBtn({
  children,
  href = "/contact",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-85"
    >
      {children}
      <span aria-hidden className="text-[10px] opacity-70">
        ↗
      </span>
    </Link>
  );
}

export function OutlineBtn({
  children,
  href = "/how-it-works",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center border border-foreground px-5 py-3 text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  );
}

/**
 * Section header — left-aligned eyebrow + grotesk title + optional intro.
 * Used across pages to introduce a section without the old canned hero look.
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const a = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col ${a} ${className}`}>
      <div className="animate-rise">
        <Label>{eyebrow}</Label>
      </div>
      <h2 className="mt-5 max-w-3xl font-display text-[26px] font-medium leading-[1.1] text-balance animate-rise sm:text-[36px]">
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 max-w-xl text-[14px] leading-relaxed text-muted-foreground text-balance animate-rise ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

/**
 * PageHero — premium page opener. Asymmetric grid (text left, optional visual
 * right). Ends at pb-0 so the marble bleeds into the first content section.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  belowIntro,
  right,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  belowIntro?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="marble" />
      <div className="relative mx-auto max-w-6xl px-6 pb-0 pt-28">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="animate-rise">
              <Label>{eyebrow}</Label>
            </div>
            <h1 className="mt-6 max-w-2xl font-display text-[clamp(40px,6vw,66px)] font-medium leading-[1.02] tracking-[-0.01em] text-balance animate-rise">
              {title}
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground text-balance animate-rise">
              {intro}
            </p>
            {belowIntro && <div className="mt-8 animate-rise">{belowIntro}</div>}
          </div>
          {right && (
            <div className="hidden shrink-0 animate-rise lg:block">{right}</div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Inline trust/stat cells used below a hero intro. */
export function TrustRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/80">
      {items.map((t) => (
        <span key={t} className="flex items-center gap-2">
          <span className="size-1 bg-accent-green" />
          {t}
        </span>
      ))}
    </div>
  );
}

/** A horizontal strip of (number, label) stats on a muted band. */
export function StatStrip({ stats }: { stats: [string, string][] }) {
  return (
    <section className="bg-muted">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
        {stats.map(([n, l]) => (
          <div key={l}>
            <div className="font-display text-[26px] font-medium leading-none tracking-tight">
              {n}
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
              {l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Severity / level meter — five cells. */
export function Meter({ level, tone }: { level: number; tone: "red" | "orange" | "amber" }) {
  const color =
    tone === "red" ? "bg-accent-red" : tone === "orange" ? "bg-accent-orange" : "bg-accent-amber";
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`h-4 w-2 ${i < level ? color : "bg-border"}`} />
      ))}
    </div>
  );
}

/** The premium dark inverted closing-CTA panel with scorpion watermark + stats. */
export function CtaPanel({
  eyebrow = "Ready when you are",
  title,
  intro,
  stats,
  primary = { label: "Request access", href: "/contact" },
  secondary,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  stats: [string, string][];
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Bracketed className="relative overflow-hidden bg-foreground text-background">
        <div
          className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 select-none lg:block"
          aria-hidden
        >
          <AsciiArt
            art={HERO}
            drift={false}
            opacity={0.1}
            size="clamp(6px, 0.7vw, 11px)"
            className="scorpion-anim text-background [mask-image:radial-gradient(70%_70%_at_60%_50%,#000_45%,transparent_90%)]"
          />
        </div>
        <div className="relative grid gap-10 p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-14">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-background/60">
              <span className="size-1.5 bg-accent-red" />
              {eyebrow}
            </span>
            <h2 className="mt-5 font-display text-[clamp(28px,4vw,44px)] font-medium leading-[1.05] text-balance">
              {title}
            </h2>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-background/65 text-balance">
              {intro}
            </p>
          </div>
          <div className="lg:justify-self-end">
            <div className="mb-7 grid grid-cols-3 gap-6">
              {stats.map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-[22px] font-medium leading-none">{n}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-background/55">
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={primary.href}
                className="inline-flex items-center gap-2 bg-background px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-foreground transition-opacity hover:opacity-90"
              >
                {primary.label}
                <span aria-hidden className="text-[10px] opacity-70">↗</span>
              </Link>
              {secondary && (
                <Link
                  href={secondary.href}
                  className="inline-flex items-center border border-background/40 px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-background/10"
                >
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Bracketed>
    </section>
  );
}
