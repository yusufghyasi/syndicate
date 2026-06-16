import type { Metadata } from "next";
import Bracketed from "@/components/Bracketed";
import {
  PageHero,
  SectionHeader,
  StatStrip,
  CtaPanel,
} from "@/components/bits";

export const metadata: Metadata = {
  title: "Platform — Syndicate",
  description:
    "Trusted findings, depth across the attack surface, isolated execution, and integrations with the tools your team already uses.",
};

const FEATURES = [
  { title: "Findings you can trust", body: "Every result is verified through exploitation, so your team isn't wasting cycles on false positives.", sub: "Each finding ships with a working reproduction." },
  { title: "Depth across the attack surface", body: "Coverage spans injection, access control, business logic, API security, and the client side.", sub: "Chained, not just enumerated." },
  { title: "Adaptive by design", body: "What Syndicate learns early in an assessment shapes how it tests later.", sub: "The instinct of an experienced tester." },
  { title: "Safe and contained", body: "Each assessment runs in an isolated environment. Credentials are encrypted and never retained.", sub: "Non-destructive by default." },
  { title: "Made for teams", body: "Role-based access, finding management, and reports built to share with engineers and stakeholders.", sub: "From security lead to IC." },
  { title: "Runs continuously", body: "Trigger on every release, on a schedule, or on demand.", sub: "Security testing at the speed of CI." },
];

const ARCH = String.raw`┌──────────────┐    ┌────────────────────┐    ┌──────────────┐
│  YOUR TARGET │──▶ │  ISOLATED SANDBOX  │──▶ │   FINDINGS   │
│  app + APIs  │    │  agent swarm       │    │  verified    │
└──────────────┘    │  · discover        │    │  · severity  │
       creds        │  · assess + chain  │    │  · repro     │
   (encrypted) ──▶  │  · exploit (safe)  │──▶ │  · fix       │
                    └────────────────────┘    └──────────────┘`;

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Platform"
        title="An autonomous security engineer, in your stack"
        intro="Syndicate proves what's exploitable and gives your team something to act on the same day — wherever your code lives."
        right={
          <Bracketed className="bg-card p-5">
            <pre className="font-mono text-[9px] leading-relaxed text-muted-foreground sm:text-[10px]">{ARCH}</pre>
          </Bracketed>
        }
      />

      {/* FEATURE GRID — numbered Bracketed cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Bracketed key={f.title} className="bg-card p-7 transition-colors hover:bg-muted">
              <span className="font-display text-[11px] uppercase tracking-[0.16em] text-accent-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 font-display text-[16px] font-medium tracking-tight">{f.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{f.body}</p>
              <p className="mt-4 border-t border-border pt-4 text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60">
                {f.sub}
              </p>
            </Bracketed>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE — inverted editorial panel */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Bracketed className="overflow-hidden bg-foreground text-background">
          <div className="grid gap-10 p-10 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:p-14">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-background/60">
                <span className="size-1.5 bg-accent-red" />
                Isolated execution
              </span>
              <h2 className="mt-5 font-display text-[clamp(24px,3.2vw,36px)] font-medium leading-[1.06] text-balance">
                Every assessment is sandboxed, end to end
              </h2>
              <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-background/65">
                Your credentials enter an encrypted sandbox, the agent swarm does
                its work, and only verified findings come back out.
              </p>
              <div className="mt-7 grid grid-cols-3 gap-5 border-t border-background/15 pt-6">
                {[
                  ["Encrypted", "at rest"],
                  ["Destroyed", "post-test"],
                  ["Zero", "retention"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-[15px] font-medium leading-none">{n}</div>
                    <div className="mt-1.5 text-[10px] uppercase tracking-[0.12em] text-background/50">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <Bracketed className="overflow-x-auto border-background/20 bg-background/5 p-6">
              <pre className="font-mono text-[10px] leading-relaxed text-background/85 sm:text-[12px]">{ARCH}</pre>
            </Bracketed>
          </div>
        </Bracketed>
      </section>

      {/* INTEGRATIONS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader eyebrow="Integrations" title="Fits the tools you already use" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["GitHub", "GitLab", "Bitbucket", "Jira", "Slack", "Linear", "CI / CD", "Webhooks"].map((n) => (
            <div
              key={n}
              className="rounded-[var(--radius-sm)] border border-border px-5 py-6 text-center font-display text-[13px] tracking-[0.12em] text-muted-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {n}
            </div>
          ))}
        </div>
      </section>

      <StatStrip
        stats={[
          ["8", "vuln classes"],
          ["24/7", "on demand"],
          ["0", "false positives"],
          ["100%", "isolated"],
        ]}
      />

      <CtaPanel
        title="Expert-grade assessment, on demand"
        intro="Bring Syndicate into your stack and prove what's exploitable before someone else does."
        stats={[
          ["Same-day", "findings"],
          ["RBAC", "for teams"],
          ["CI", "native"],
        ]}
        secondary={{ label: "How it works", href: "/how-it-works" }}
      />
    </main>
  );
}
