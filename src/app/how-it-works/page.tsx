import type { Metadata } from "next";
import AsciiArt from "@/components/ascii/AsciiArt";
import { HERO } from "@/components/ascii/art";
import Bracketed from "@/components/Bracketed";
import {
  PageHero,
  SectionHeader,
  StatStrip,
  CtaPanel,
  TrustRow,
} from "@/components/bits";

export const metadata: Metadata = {
  title: "How it works — Syndicate",
  description:
    "Discover, Assess, Report — how Syndicate runs an autonomous penetration test end to end, with a real IDOR-to-account-takeover walkthrough.",
};

const PHASES = [
  {
    n: "01",
    title: "Discover",
    body: "Syndicate crawls and instruments your application to build a live model of the attack surface — every route, parameter, form, auth flow, and trust boundary.",
    detail: ["Authenticated + unauthenticated crawl", "API + GraphQL schema inference", "Role and tenant mapping"],
  },
  {
    n: "02",
    title: "Assess",
    body: "Specialized agents probe each surface for real weaknesses, then chain them — the way an experienced tester escalates a small flaw into a serious one.",
    detail: ["Per-class vulnerability probes", "Multi-step exploit chaining", "Controlled, validated exploitation"],
  },
  {
    n: "03",
    title: "Report",
    body: "Every confirmed finding ships with severity, a working reproduction, and concrete remediation — nothing speculative, no false positives to triage.",
    detail: ["Reproduction steps + evidence", "Severity + business impact", "Remediation guidance"],
  },
];

const WALK = [
  { tone: "dim", t: "→ GET /api/v2/orders/1042  →  200 OK (own order)" },
  { tone: "warn", t: "→ GET /api/v2/orders/1043  →  200 OK (NOT your order) — IDOR" },
  { tone: "dim", t: "→ enumerate object references … 8,400 orders readable" },
  { tone: "dim", t: "→ found admin order with password-reset token in payload" },
  { tone: "crit", t: "✗ CONFIRMED: account takeover by replaying reset token" },
  { tone: "ok", t: "✓ severity CRITICAL · reproduction + fix attached" },
];

const toneClass: Record<string, string> = {
  dim: "text-background/55",
  warn: "text-accent-amber",
  crit: "text-accent-red",
  ok: "text-accent-green",
};

const SAFETY = [
  { h: "Isolated by default", b: "Every assessment runs in a sandboxed environment, scoped strictly to the targets you authorize." },
  { h: "Credentials never retained", b: "Any credentials you provide are encrypted, used only during the test, and destroyed afterward." },
  { h: "Non-destructive", b: "Exploitation is controlled and reversible — we prove the path without damaging your data." },
];

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="How it works"
        title="From attack surface to confirmed exploit"
        intro="Syndicate runs the same loop a senior tester would — map everything, probe and chain, then prove what's real. Here's exactly what happens."
        belowIntro={<TrustRow items={["No false positives", "Isolated environment", "Verified by exploitation"]} />}
        right={
          <div className="dark:[--scorpion-opacity:0.5] [--scorpion-opacity:0.64]">
            <AsciiArt
              art={HERO}
              drift={false}
              opacity={0.64}
              size="clamp(6px, 0.62vw, 10px)"
              className="scorpion-anim text-foreground [mask-image:radial-gradient(75%_75%_at_50%_45%,#000_60%,transparent_94%)]"
            />
          </div>
        }
      />

      {/* PHASE TIMELINE — one instrument panel */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <Bracketed className="bg-card">
          {PHASES.map((p, i) => (
            <div
              key={p.n}
              className={`grid gap-8 p-10 lg:grid-cols-[110px_1.1fr_1fr] ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="select-none font-display text-[clamp(48px,5vw,72px)] font-medium leading-none tracking-[-0.02em] text-muted-foreground/15">
                {p.n}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-accent-blue">
                  Phase {p.n}
                </span>
                <h3 className="mt-3 font-display text-[20px] font-medium tracking-tight">{p.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
              <ul className="flex flex-col gap-2.5 lg:pt-1">
                {p.detail.map((d) => (
                  <li key={d} className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                    <span className="text-accent-blue opacity-60">·</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Bracketed>
      </section>

      {/* WALKTHROUGH — inverted proof panel */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeader
          eyebrow="Example finding"
          title="An IDOR becomes an account takeover"
          intro="A single weak object reference, chained step by step into a critical. This is what 'verified by exploitation' means."
        />
        <Bracketed className="mt-10 overflow-hidden bg-foreground text-background">
          <div className="border-b border-background/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] text-background/50">
            chain · SYN-XXX
          </div>
          <pre className="overflow-x-auto px-6 py-6 font-mono text-[12.5px] leading-relaxed">
            {WALK.map((l, i) => (
              <div
                key={i}
                className={`${toneClass[l.tone]} ${l.tone === "crit" ? "font-display text-[13.5px]" : ""}`}
              >
                {l.t}
              </div>
            ))}
          </pre>
          <div className="grid grid-cols-3 gap-6 border-t border-background/15 px-6 py-5 text-background/70">
            {[
              ["8,400", "objects enumerable"],
              ["5-step", "exploit chain"],
              ["9.8", "CVSS score"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-[18px] font-medium leading-none">{n}</div>
                <div className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-background/50">{l}</div>
              </div>
            ))}
          </div>
        </Bracketed>
      </section>

      {/* SAFETY */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader eyebrow="Safe & contained" title="Built to test without breaking anything" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SAFETY.map((c, i) => (
            <Bracketed key={c.h} className="relative overflow-hidden bg-card p-7">
              <span className="pointer-events-none absolute -right-1 -top-3 select-none font-display text-[72px] font-medium leading-none text-muted-foreground/10">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="relative font-display text-[15px] font-medium tracking-tight">{c.h}</h3>
              <p className="relative mt-3 text-[13px] leading-relaxed text-muted-foreground">{c.b}</p>
            </Bracketed>
          ))}
        </div>
      </section>

      <StatStrip
        stats={[
          ["Thousands", "tests / assessment"],
          ["0%", "false positive rate"],
          ["4 steps", "avg chain depth"],
          ["100%", "isolated"],
        ]}
      />

      <CtaPanel
        title="Run an assessment whenever you ship"
        intro="Map your surface, prove what's exploitable, and hand your team a fix — on demand."
        stats={[
          ["0", "false positives"],
          ["24/7", "on demand"],
          ["100%", "isolated"],
        ]}
        secondary={{ label: "See coverage", href: "/coverage" }}
      />
    </main>
  );
}
