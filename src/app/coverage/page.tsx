import type { Metadata } from "next";
import Bracketed from "@/components/Bracketed";
import {
  PageHero,
  SectionHeader,
  StatStrip,
  CtaPanel,
  TrustRow,
} from "@/components/bits";

export const metadata: Metadata = {
  title: "Coverage — Syndicate",
  description:
    "Depth across the attack surface: injection, access control, business logic, APIs, SSRF, client-side, and misconfiguration — with honest scope.",
};

const ROWS: { cls: string; examples: string; sev: "Critical" | "High" | "Medium"; chain: boolean }[] = [
  { cls: "Injection", examples: "SQLi · command · template · NoSQL", sev: "Critical", chain: true },
  { cls: "Broken access control", examples: "IDOR · privilege escalation · forced browsing", sev: "Critical", chain: true },
  { cls: "Authentication & sessions", examples: "weak flows · token handling · fixation", sev: "High", chain: true },
  { cls: "Business logic abuse", examples: "workflow & state-machine flaws", sev: "High", chain: true },
  { cls: "API security", examples: "REST + GraphQL · mass assignment · BOLA", sev: "High", chain: true },
  { cls: "SSRF & request forgery", examples: "SSRF · CSRF · open redirect", sev: "High", chain: true },
  { cls: "Client-side & XSS", examples: "reflected · stored · DOM-based", sev: "Medium", chain: false },
  { cls: "Secrets & misconfiguration", examples: "exposed keys · headers · insecure defaults", sev: "Medium", chain: false },
];

// Monochrome severity hierarchy — encoded by blue intensity, not hue.
const sevColor: Record<string, string> = {
  Critical: "text-accent-blue border-accent-blue bg-accent-blue/10",
  High: "text-accent-blue/80 border-accent-blue/50",
  Medium: "text-muted-foreground border-border",
};

const DISTRIBUTION: { label: string; count: number; pct: number; fill: string }[] = [
  { label: "Critical", count: 2, pct: 80, fill: "bg-accent-blue" },
  { label: "High", count: 4, pct: 64, fill: "bg-accent-blue/70" },
  { label: "Medium", count: 2, pct: 40, fill: "bg-accent-blue/40" },
];

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Coverage"
        title="Depth across the attack surface"
        intro="Syndicate doesn't stop at the surface. It tests the classes of vulnerability that matter — and chains them the way a real attacker would."
        belowIntro={<TrustRow items={["8 vulnerability classes", "CVSS 1–10 scale", "0 false-positive policy"]} />}
      />

      {/* TABLE */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <Bracketed className="overflow-hidden bg-card">
          {/* Horizontal scroll on narrow screens so the 4-col table never clips
              inside the overflow-hidden Bracketed frame. */}
          <div className="overflow-x-auto">
          <div className="min-w-[600px]">
          <div className="grid grid-cols-[1.2fr_2fr_auto_auto] items-center gap-4 bg-muted px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span>Class</span>
            <span>Examples</span>
            <span className="text-center">Chained</span>
            <span className="text-right">Severity</span>
          </div>
          {ROWS.map((r) => (
            <div
              key={r.cls}
              className="group relative grid grid-cols-[1.2fr_2fr_auto_auto] items-center gap-4 border-t border-border px-6 py-4 transition-colors hover:bg-muted"
            >
              <span className="absolute left-0 top-0 h-full w-[3px] bg-accent-red opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="font-display text-[14px] tracking-tight">{r.cls}</span>
              <span className="text-[12.5px] text-muted-foreground">{r.examples}</span>
              <span className="text-center text-[13px]">
                {r.chain ? <span className="text-accent-green">✓</span> : <span className="text-muted-foreground/40">—</span>}
              </span>
              <span className={`justify-self-end rounded-[var(--radius-sm)] border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${sevColor[r.sev]}`}>
                {r.sev}
              </span>
            </div>
          ))}
          </div>
          </div>
        </Bracketed>
      </section>

      {/* SEVERITY DISTRIBUTION — the wow moment */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeader eyebrow="At a glance" title="Class severity distribution" />
        <Bracketed className="mt-10 bg-card p-8 lg:p-10">
          <div className="space-y-6">
            {DISTRIBUTION.map((d) => (
              <div key={d.label} className="grid grid-cols-[90px_1fr_auto] items-center gap-5">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{d.label}</span>
                <span className="h-3 w-full bg-border/60">
                  <span className={`block h-full ${d.fill}`} style={{ width: `${d.pct}%` }} />
                </span>
                <span className="font-mono text-[12px] text-muted-foreground">{d.count} classes</span>
              </div>
            ))}
          </div>
        </Bracketed>
      </section>

      {/* HONEST SCOPE */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeader
            eyebrow="Honest scope"
            title="What Syndicate doesn't do"
            intro="We'd rather be precise about scope than overpromise. Syndicate focuses on application-layer security."
          />
          <Bracketed className="bg-card p-8">
            <ul className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
              {[
                "Not a replacement for human red-team engagements on hardware, physical, or social-engineering vectors.",
                "Not a network/infrastructure scanner — we focus on the application, its APIs, and its logic.",
                "Not a compliance checkbox tool — findings are real exploits, not policy mappings.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="text-accent-red">—</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Bracketed>
        </div>
      </section>

      <StatStrip
        stats={[
          ["8", "vuln classes"],
          ["6", "actively chained"],
          ["1–10", "CVSS scale"],
          ["0%", "false positives"],
        ]}
      />

      <CtaPanel
        title="Find what others miss"
        intro="See the full attack surface assessed against the classes that actually get exploited."
        stats={[
          ["8", "classes"],
          ["100%", "verified"],
          ["0", "noise"],
        ]}
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />
    </main>
  );
}
