import type { Metadata } from "next";
import Link from "next/link";
import Bracketed from "@/components/Bracketed";
import {
  PageHero,
  SectionHeader,
  Meter,
  CtaPanel,
} from "@/components/bits";

export const metadata: Metadata = {
  title: "Advisories — Syndicate",
  description:
    "Real vulnerabilities, responsibly disclosed. Findings from the Syndicate engine in the wild, with severity, metadata, and disclosure timelines.",
};

const ADVISORIES = [
  {
    id: "SYN-001", sev: "Critical", meter: 5, tone: "red" as const, cvss: "9.8", type: "Pre-auth RCE",
    title: "Unauthenticated remote code execution via unsafe deserialization",
    body: "A pre-auth endpoint deserialized attacker-controlled input, yielding remote code execution. Validated end to end and reported ahead of public disclosure.",
    reported: "2026-01-31", published: "2026-02-06",
  },
  {
    id: "SYN-002", sev: "High", meter: 4, tone: "orange" as const, cvss: "8.1", type: "Access control",
    title: "Cross-tenant data access via predictable object references",
    body: "An IDOR chain exposed records belonging to other tenants. Confirmed with full reproduction across 8,400 enumerable objects.",
    reported: "2026-03-12", published: "2026-03-20",
  },
  {
    id: "SYN-003", sev: "High", meter: 4, tone: "orange" as const, cvss: "7.6", type: "Auth bypass",
    title: "Authentication bypass through JWT algorithm confusion",
    body: "A token-verification flaw allowed forged sessions via algorithm confusion. Reported with a minimal proof-of-concept and remediation.",
    reported: "2026-04-02", published: "2026-04-11",
  },
];

const sevColor: Record<string, string> = {
  Critical: "text-accent-red border-accent-red",
  High: "text-accent-orange border-accent-orange",
};
const accentBorder: Record<string, string> = {
  red: "border-l-2 border-l-accent-red",
  orange: "border-l-2 border-l-accent-orange",
};

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Advisories"
        title="Real vulnerabilities. Real impact."
        intro="The same engine that protects our customers surfaces novel vulnerabilities in the wild. We disclose them responsibly."
        right={
          <Bracketed className="min-w-[230px] bg-card p-8">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Research output
            </span>
            <div className="mt-6 space-y-6">
              {[
                ["03", "Advisories published"],
                ["9.8", "Highest CVSS"],
                ["100%", "Coordinated disclosure"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-[30px] font-medium leading-none">{n}</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">{l}</div>
                </div>
              ))}
            </div>
          </Bracketed>
        }
      />

      {/* ADVISORY CARDS */}
      <section className="mx-auto max-w-4xl space-y-6 px-6 pb-24 pt-16">
        {ADVISORIES.map((a) => (
          <Bracketed key={a.id} className={`bg-card ${accentBorder[a.tone]}`}>
            <div className="flex flex-wrap items-center gap-4 border-b border-border px-6 py-4 text-[11px] uppercase tracking-[0.1em]">
              <span className={`border px-2 py-0.5 ${sevColor[a.sev]}`}>{a.sev}</span>
              <span className="text-muted-foreground">{a.id}</span>
              <span className="text-muted-foreground">— {a.type}</span>
              <span className="ml-auto flex items-center gap-4">
                <span className="font-display text-[18px] font-medium normal-case tracking-normal">
                  CVSS {a.cvss}
                </span>
                <Meter level={a.meter} tone={a.tone} />
              </span>
            </div>
            <div className="px-6 py-6">
              <h3 className={`font-display font-medium tracking-tight ${a.sev === "Critical" ? "text-[19px]" : "text-[16px]"}`}>
                {a.title}
              </h3>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted-foreground">{a.body}</p>
              <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                <span>Reported · {a.reported}</span>
                <span className="h-px w-12 bg-muted-foreground/25" />
                <span className="flex items-center gap-2">
                  <span className="size-1.5 bg-accent-green" />
                  Published · {a.published}
                </span>
              </div>
            </div>
          </Bracketed>
        ))}
      </section>

      {/* DISCLOSURE POLICY */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHeader
            eyebrow="Coordinated disclosure"
            title="How we handle what we find"
            intro="We give vendors time to fix before anything goes public. Always."
          />
          <Bracketed className="bg-card p-8">
            <ol className="space-y-4 text-[13px] leading-relaxed text-muted-foreground">
              {[
                "Report privately to the vendor with a working proof-of-concept.",
                "Coordinate a remediation timeline — typically 90 days.",
                "Publish the advisory only after a fix is available or the window closes.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="font-display text-accent-blue">{i + 1}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </Bracketed>
        </div>
        <p className="mt-8 text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70">
          Security researcher?{" "}
          <Link href="/contact" className="underline-offset-4 hover:underline">Get in touch</Link>
        </p>
      </section>

      <CtaPanel
        title="Found before it's exploited"
        intro="Put the engine that finds zero-days in the wild to work on your own applications."
        stats={[
          ["03", "advisories"],
          ["9.8", "top CVSS"],
          ["100%", "disclosed"],
        ]}
        secondary={{ label: "See coverage", href: "/coverage" }}
      />
    </main>
  );
}
