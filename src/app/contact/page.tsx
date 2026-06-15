import type { Metadata } from "next";
import Bracketed from "@/components/Bracketed";
import { PageHero, Label, StatStrip, TrustRow } from "@/components/bits";

export const metadata: Metadata = {
  title: "Request access — Syndicate",
  description:
    "Request access to Syndicate and book an isolated, expert-grade assessment of your application.",
};

const FIELDS = [
  { id: "name", label: "Name", type: "text", ph: "Ada Lovelace" },
  { id: "email", label: "Work email", type: "email", ph: "you@company.com" },
  { id: "company", label: "Company", type: "text", ph: "Company, Inc." },
  { id: "target", label: "Application URL", type: "url", ph: "https://app.company.com" },
];

const STEPS = [
  { n: "01", h: "We scope it", b: "We confirm your targets, authorization, and the environment Syndicate will run against." },
  { n: "02", h: "We assess it", b: "An isolated assessment maps your surface, chains weaknesses, and validates each finding." },
  { n: "03", h: "We walk you through it", b: "You get a report of confirmed findings — severity, reproduction, and remediation — and a live walkthrough." },
];

const inputCls =
  "mt-2 w-full border border-border bg-background px-3 py-2.5 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground focus:ring-1 focus:ring-foreground/20";

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Request access"
        title="Book your first assessment"
        intro="Tell us where your application lives. We'll set up an isolated, expert-grade assessment and walk you through the findings."
        belowIntro={
          <TrustRow items={["Response within 1 business day", "Isolated environment", "Credentials never retained"]} />
        }
      />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* form first */}
          <Bracketed className="h-fit bg-card p-8">
            <form className="space-y-5">
              {FIELDS.map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {f.label}
                  </label>
                  <input id={f.id} name={f.id} type={f.type} placeholder={f.ph} className={inputCls} />
                </div>
              ))}
              <div>
                <label htmlFor="scope" className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  What would you like assessed?
                </label>
                <textarea
                  id="scope"
                  name="scope"
                  rows={4}
                  placeholder="Describe the application, its auth flows, or any areas of particular concern."
                  className={`${inputCls} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-foreground px-5 py-3 text-[12px] uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-85"
              >
                Request access ↗
              </button>
            </form>
          </Bracketed>

          {/* what happens next */}
          <div>
            <Label>What happens next</Label>
            <div className="mt-8 border-l border-border">
              {STEPS.map((s) => (
                <div key={s.n} className="relative pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[5px] top-1 size-2.5 bg-foreground" />
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[12px] text-accent-blue">{s.n}</span>
                    <h3 className="font-display text-[16px] font-medium tracking-tight">{s.h}</h3>
                  </div>
                  <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">{s.b}</p>
                </div>
              ))}
            </div>
            <Bracketed className="mt-8 bg-card p-5">
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                <span className="text-foreground">Response within one business day.</span>{" "}
                Isolated environment · credentials encrypted and never retained.
              </p>
            </Bracketed>
          </div>
        </div>
      </section>

      <StatStrip
        stats={[
          ["Isolated", "sandbox"],
          ["Zero", "credential retention"],
          ["Non-", "destructive testing"],
          ["1 day", "response"],
        ]}
      />
    </main>
  );
}
