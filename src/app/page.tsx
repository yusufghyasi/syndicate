import Link from "next/link";
import { GLSLHills } from "@/components/ui/glsl-hills";
import { SolidBtn, OutlineBtn, SectionHeader } from "@/components/bits";

const STEPS = [
  { n: "01", title: "Discover", body: "Syndicate maps your application's full attack surface — its endpoints, inputs, and exposed logic." },
  { n: "02", title: "Assess", body: "Specialized agents test for real vulnerabilities and chain weaknesses together, validating each one through controlled exploitation rather than guesswork." },
  { n: "03", title: "Report", body: "You receive confirmed findings, prioritized by severity, with clear reproduction steps and remediation guidance." },
];

const INDUSTRIES = [
  { title: "Fintech & Banking", body: "Payment flows, ledgers, and KYC paths where a single access-control flaw means real money moves.", span: "md:col-span-2 md:row-span-2" },
  { title: "Healthcare & Health-tech", body: "PHI exposure, patient portals, and HIPAA-sensitive APIs tested without ever retaining data.", span: "md:col-span-2" },
  { title: "SaaS & B2B Platforms", body: "Multi-tenant isolation, RBAC, and the cross-tenant IDORs that break customer trust.", span: "" },
  { title: "AI & Developer Tools", body: "Prompt-injection, agent tool-use abuse, and the new attack surface that ships with AI features.", span: "" },
  { title: "E-commerce & Marketplaces", body: "Checkout abuse, coupon and pricing logic, and account-takeover paths at scale.", span: "md:col-span-2" },
  { title: "Government & Defense", body: "High-assurance assessments for systems where exposure is a national-security problem.", span: "md:col-span-2" },
];

const TRUST = ["ACME", "NORTHWIND", "INITECH", "HOOLI", "MASSIVE DYN", "STARK IND", "WAYNE", "UMBRELLA"];

export default function Home() {
  return (
    <main className="relative">
      {/* HERO — animated GLSL hills background */}
      <section className="relative isolate overflow-hidden">
        <div className="marble" />
        {/* animated rolling hills — full-bleed, fills the hero */}
        <div
          className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_30%,#000_60%,#000_88%,transparent)]"
          aria-hidden
        >
          <GLSLHills width="100%" height="100%" speed={0.4} />
        </div>

        {/* contrast scrim — radial wash of the page background behind the hero
            copy. Opaque-ish at center for guaranteed text contrast, fades to
            transparent at the edges so the wire-mountain ridges still show.
            Theme-aware via var(--background): cream in light, near-black in dark.
            Sits above the canvas (z-1) and below the copy (z-10). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(64% 44% at 50% 56%, var(--background) 0%, color-mix(in oklab, var(--background) 55%, transparent) 48%, transparent 78%)",
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-4xl flex-col items-center justify-center px-6 py-32 text-center">
          {/* eyebrow chip */}
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 border border-border bg-background/60 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm rounded-[var(--radius-sm)]">
              <span className="size-1.5 bg-accent-red" />
              Autonomous penetration testing
            </span>
          </div>

          <h1 className="mt-8 max-w-3xl font-display text-[clamp(42px,7vw,80px)] font-medium leading-[1.0] tracking-[-0.02em] text-balance animate-rise">
            Security testing that keeps pace with your code
          </h1>

          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-balance animate-rise">
            Syndicate is an autonomous penetration testing platform. It assesses
            your web applications the way an attacker would, confirms what&apos;s
            actually exploitable, and delivers findings your team can act on
            immediately.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-rise">
            <SolidBtn>Request access</SolidBtn>
            <OutlineBtn href="/how-it-works">See how it works</OutlineBtn>
          </div>

          <p className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/70">
            <span className="flex items-center gap-2">
              <span className="size-1 bg-accent-green" /> Isolated environment
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1 bg-accent-green" /> No credentials retained
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1 bg-accent-green" /> Verified by exploitation
            </span>
          </p>
        </div>
      </section>

      {/* TRUST MARQUEE — blended, scrolls right→left */}
      <section className="pb-16 pt-16">
        <p className="mb-8 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by teams building tomorrow
        </p>
        <div className="mask-x overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-16 pr-16">
            {[...TRUST, ...TRUST].map((name, i) => (
              <span key={i} className="font-display text-[14px] font-medium tracking-[0.18em] text-muted-foreground/35">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STOP CHASING ALERTS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden bg-card rounded-[var(--radius)] border border-border">
          <div className="grid gap-10 p-10 lg:grid-cols-2 lg:p-16">
            <h2 className="font-display text-[clamp(26px,3.4vw,38px)] font-medium leading-[1.08] text-balance">
              Stop chasing alerts. Start fixing what&apos;s real.
            </h2>
            <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground">
              <p>You probably use lots of security tools.</p>
              <p>You probably get lots of alerts.</p>
              <p>You probably spend lots of time chasing them down.</p>
              <p className="text-foreground">
                But in the end, how many of them were actually worth your time?
              </p>
              <p>
                Syndicate finds exploitable vulnerabilities and helps your team
                fix what matters — built on one principle:{" "}
                <span className="font-display tracking-wide text-foreground">PoC || GTFO.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader eyebrow="How it works" title="Three phases, end to end" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-card p-8 transition-colors hover:bg-muted rounded-[var(--radius)] border border-border">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <span className="font-display text-[14px] text-accent-blue">{s.n}</span>
                <span>Phase</span>
              </div>
              <h3 className="mt-10 font-display text-[19px] font-medium tracking-tight">{s.title}</h3>
              <p className="mt-4 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <OutlineBtn href="/how-it-works">See the full workflow</OutlineBtn>
        </div>
      </section>

      {/* INDUSTRIES WE COVER — bento box */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          eyebrow="Industries we cover"
          title="Built for the teams that can't afford to be wrong"
          intro="Syndicate assesses the high-stakes applications where a single exploitable flaw has real consequences."
        />
        <div className="mt-14 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-5 md:grid-cols-4">
          {INDUSTRIES.map((p, i) => (
            <div
              key={p.title}
              className={`flex flex-col justify-between bg-card p-7 transition-colors hover:bg-muted rounded-[var(--radius)] border border-border ${p.span}`}
            >
              <span className="font-display text-[12px] text-accent-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-8">
                <h3 className="font-display text-[clamp(16px,1.4vw,20px)] font-medium tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ADVISORY TEASER */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeader
          eyebrow="Advisories"
          title="Real vulnerabilities. Real impact."
          intro="The same engine that protects our customers surfaces novel vulnerabilities in the wild. We disclose them responsibly."
        />
        <div className="mt-12 bg-card rounded-[var(--radius)] border border-border">
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.1em]">
            <span className="border border-accent-red px-2 py-0.5 text-accent-red rounded-[var(--radius-sm)]">Critical</span>
            <span className="text-muted-foreground">SYN-001</span>
            <span className="text-muted-foreground">— Pre-auth RCE</span>
          </div>
          <div className="px-6 py-7">
            <h3 className="font-display text-[19px] font-medium tracking-tight">
              Unauthenticated remote code execution via unsafe deserialization
            </h3>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
              Discovered and validated through controlled exploitation, then
              reported to the vendor ahead of public disclosure.
            </p>
            <Link href="/advisories" className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.1em] underline-offset-4 hover:underline">
              View advisories →
            </Link>
          </div>
        </div>
      </section>

      {/* CLOSING CTA — designed panel */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden bg-foreground text-background rounded-[var(--radius)] border border-border">
          <div className="relative grid gap-10 p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-16">
            <div>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-background/60">
                <span className="size-1.5 bg-accent-red" />
                Ready when you are
              </span>
              <h2 className="mt-5 font-display text-[clamp(30px,4.4vw,48px)] font-medium leading-[1.04] text-balance">
                Understand your real exposure
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-background/65 text-balance">
                Syndicate gives you continuous, expert-grade security assessment —
                so you find the weaknesses before someone else does.
              </p>
            </div>

            <div className="lg:justify-self-end">
              {/* mini stat row */}
              <div className="mb-7 grid grid-cols-3 gap-6">
                {[
                  ["0", "false positives"],
                  ["24/7", "on demand"],
                  ["100%", "isolated"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display text-[22px] font-medium leading-none">{n}</div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-background/55">{l}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-background px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-foreground transition-opacity hover:opacity-90 rounded-[var(--radius-sm)]"
                >
                  Request access
                  <span aria-hidden className="text-[10px] opacity-70">↗</span>
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center border border-background/40 px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-background/10 rounded-[var(--radius-sm)]"
                >
                  See how it works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
