"use client";

import { useEffect, useRef, useState } from "react";

/**
 * LiveDemo — an interactive Syndicate operations console embedded in the
 * landing page. Pure React + Tailwind (the site's tokens), no backend.
 *
 * Four live behaviours, all client-side:
 *   1. Switchable modules   — click the sidebar to swap the active console.
 *   2. Live KPIs            — numbers tick on a timer for a real-time feel.
 *   3. Working agent chat    — type a prompt, get a scripted streamed reply.
 *   4. Live activity feed    — new events animate in over time.
 *
 * Pentest-themed: recon, exploitation, confirmed findings, reporting — in
 * Syndicate's SF-blue / off-white / pitch-black + rounded scheme.
 */

type Kpi = { lbl: string; val: number; fmt: "int" | "pct" | "ms" | "score"; sub: string; accent?: boolean };
type Module = {
  id: string;
  label: string;
  icon: string;
  title: string;
  subtitle: string;
  kpis: Kpi[];
  feed: string[];
};

const MODULES: Module[] = [
  {
    id: "recon",
    label: "Recon",
    icon: "M9 2v3M9 13v3M2 9h3M13 9h3M9 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
    title: "Attack-Surface Recon",
    subtitle: "target · app.acme.io",
    kpis: [
      { lbl: "Endpoints", val: 1284, fmt: "int", sub: "mapped" },
      { lbl: "Inputs", val: 3962, fmt: "int", sub: "fuzzable params" },
      { lbl: "Auth flows", val: 7, fmt: "int", accent: true, sub: "discovered" },
    ],
    feed: [
      "Crawled /api/v2 · 214 routes",
      "GraphQL schema introspected",
      "JWT auth flow fingerprinted",
      "Hidden admin route found · /ops",
    ],
  },
  {
    id: "exploit",
    label: "Exploit",
    icon: "M3 13 L8 8 M6 4h7v7 M13 4l-9 9",
    title: "Exploitation Engine",
    subtitle: "live · sandboxed",
    kpis: [
      { lbl: "Chains run", val: 142, fmt: "int", sub: "this session" },
      { lbl: "Confirmed", val: 9, fmt: "int", accent: true, sub: "by exploitation" },
      { lbl: "False pos", val: 0, fmt: "int", sub: "PoC || GTFO" },
    ],
    feed: [
      "IDOR confirmed · /api/orders/{id}",
      "SQLi chained → data read",
      "Auth bypass · privilege escalation",
      "SSRF reached internal metadata",
    ],
  },
  {
    id: "findings",
    label: "Findings",
    icon: "M5 3h6l3 3v9H5zM5 8h8M5 11h8",
    title: "Confirmed Findings",
    subtitle: "severity · prioritized",
    kpis: [
      { lbl: "Critical", val: 2, fmt: "int", accent: true, sub: "exploitable now" },
      { lbl: "High", val: 5, fmt: "int", sub: "chainable" },
      { lbl: "Mean CVSS", val: 84, fmt: "score", sub: "top findings" },
    ],
    feed: [
      "CRIT · Pre-auth RCE · deserialize",
      "CRIT · Cross-tenant IDOR",
      "HIGH · Stored XSS → session theft",
      "HIGH · Mass assignment · role=admin",
    ],
  },
  {
    id: "report",
    label: "Report",
    icon: "M4 3h10v12H4zM7 7h4M7 10h4",
    title: "Remediation Report",
    subtitle: "act-ready · per finding",
    kpis: [
      { lbl: "Repro steps", val: 100, fmt: "pct", sub: "every finding" },
      { lbl: "Time to PoC", val: 340, fmt: "ms", sub: "avg verify" },
      { lbl: "Fix guidance", val: 9, fmt: "int", accent: true, sub: "attached" },
    ],
    feed: [
      "Report SYN-001 generated",
      "Repro steps + curl attached",
      "Remediation guidance written",
      "Exported to Jira · 9 tickets",
    ],
  },
];

type Reply = { match: string[]; steps: [string, string][] };
const REPLIES: Reply[] = [
  {
    match: ["recon", "surface", "endpoint", "map", "crawl", "scan"],
    steps: [
      ["Discover", "1,284 endpoints · 3,962 inputs mapped"],
      ["Assess", "7 auth flows · hidden /ops route flagged"],
      ["Confirm", "Recon snapshot saved. Ready to exploit."],
    ],
  },
  {
    match: ["idor", "exploit", "chain", "rce", "sqli", "ssrf", "exploitable"],
    steps: [
      ["Discover", "142 chains run in sandbox"],
      ["Assess", "IDOR + SQLi chained → cross-tenant read"],
      ["Confirm", "Exploited. PoC captured, 0 false positives."],
    ],
  },
  {
    match: ["finding", "critical", "severity", "cvss", "vuln", "high"],
    steps: [
      ["Discover", "9 confirmed · 2 critical, 5 high"],
      ["Assess", "Top: pre-auth RCE via unsafe deserialize"],
      ["Confirm", "Prioritized by exploitability. CVSS 9.8."],
    ],
  },
  {
    match: ["report", "fix", "remediat", "repro", "jira", "export"],
    steps: [
      ["Discover", "9 findings · 100% with repro steps"],
      ["Assess", "Fix guidance written per finding"],
      ["Confirm", "Report SYN-001 exported · 9 Jira tickets."],
    ],
  },
];

const CHIPS = ["Map the attack surface", "What's exploitable?", "Show critical findings"];

function fmt(v: number, kind: Kpi["fmt"]) {
  if (kind === "int") return Math.round(v).toLocaleString("en-US");
  if (kind === "pct") return Math.round(v) + "%";
  if (kind === "ms") return Math.round(v) + "ms";
  if (kind === "score") return (v / 10).toFixed(1);
  return String(Math.round(v));
}

type Msg =
  | { role: "agent"; text: string }
  | { role: "user"; text: string }
  | { role: "thinking" }
  | { role: "steps"; steps: [string, string][]; shown: number; typed: string };

export default function LiveDemo() {
  const [activeId, setActiveId] = useState(MODULES[0].id);
  const active = MODULES.find((m) => m.id === activeId)!;

  // live KPI values (random-walk around the module's base values)
  const [kpiVals, setKpiVals] = useState<number[]>(active.kpis.map((k) => k.val));
  const [flash, setFlash] = useState<number>(-1);

  // activity feed
  const [feed, setFeed] = useState<{ text: string; t: string; act?: boolean }[]>([]);
  const feedIdx = useRef(0);

  // chat
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "agent", text: "Ask me anything about this assessment — try “What's exploitable?” or pick a module." },
  ]);
  const [input, setInput] = useState("");
  const busy = useRef(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // clock
  const [clock, setClock] = useState("--:--:-- UTC");

  // in-view gate so timers only run when visible
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // reset KPIs + feed on module switch
  useEffect(() => {
    setKpiVals(active.kpis.map((k) => k.val));
    const now = nowStr();
    setFeed(active.feed.slice(0, 3).map((text) => ({ text, t: now })));
    feedIdx.current = 3;
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // in-view observer
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // clock (always)
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // live KPI ticking — only while in view
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setKpiVals((prev) =>
        prev.map((v, i) => {
          const base = active.kpis[i].val;
          const jitter = base * (Math.random() * 0.012 - 0.004);
          return Math.max(0, base + jitter);
        }),
      );
      const i = Math.floor(Math.random() * active.kpis.length);
      setFlash(i);
      setTimeout(() => setFlash(-1), 480);
    }, 2200);
    return () => clearInterval(id);
  }, [inView, activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // live feed — only while in view
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      const items = active.feed;
      const text = items[feedIdx.current % items.length];
      feedIdx.current += 1;
      setFeed((prev) => [{ text, t: nowStr() }, ...prev].slice(0, 6));
    }, 4200);
    return () => clearInterval(id);
  }, [inView, activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // autoscroll chat
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  function nowStr() {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function pickReply(q: string): Reply {
    const lc = q.toLowerCase();
    let best: Reply | null = null;
    let score = 0;
    for (const r of REPLIES) {
      const s = r.match.reduce((n, kw) => (lc.includes(kw) ? n + 1 : n), 0);
      if (s > score) {
        score = s;
        best = r;
      }
    }
    return best || REPLIES[0];
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function send(q: string) {
    const v = q.trim();
    if (!v || busy.current) return;
    busy.current = true;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: v }, { role: "thinking" }]);
    await sleep(600);

    const reply = pickReply(v);
    // replace thinking with an empty steps block
    setMsgs((m) => {
      const copy = m.slice(0, -1);
      copy.push({ role: "steps", steps: reply.steps, shown: 0, typed: "" });
      return copy;
    });

    // stream each step
    for (let i = 0; i < reply.steps.length; i++) {
      const body = reply.steps[i][1];
      // reveal the row
      setMsgs((m) => updateSteps(m, (s) => ({ ...s, shown: i + 1, typed: "" })));
      await sleep(90);
      for (let c = 0; c < body.length; c++) {
        const slice = body.slice(0, c + 1);
        setMsgs((m) => updateSteps(m, (s) => ({ ...s, typed: slice })));
        if (c % 2 === 0) await sleep(9);
      }
      // Row i is now fully typed. When the next row reveals, `shown` advances so
      // this row falls back to its full `body` (isLastShown becomes false) —
      // no extra bookkeeping needed.
      await sleep(150);
    }
    // log final action into the live feed
    const last = reply.steps[reply.steps.length - 1][1];
    setFeed((prev) => [{ text: last, t: nowStr(), act: true }, ...prev].slice(0, 6));
    busy.current = false;
  }

  // helper: update the last steps message
  function updateSteps(m: Msg[], fn: (s: Extract<Msg, { role: "steps" }>) => Msg): Msg[] {
    const copy = [...m];
    for (let i = copy.length - 1; i >= 0; i--) {
      if (copy[i].role === "steps") {
        copy[i] = fn(copy[i] as Extract<Msg, { role: "steps" }>);
        break;
      }
    }
    return copy;
  }

  return (
    <section id="live-demo" className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex flex-col items-start">
        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-accent-blue" />
          Live demo
        </span>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(26px,3.6vw,40px)] font-medium leading-[1.08] tracking-tight text-balance">
          Don&apos;t take our word for it — <span className="text-accent-blue">drive the console</span>.
        </h2>
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          Switch phases, ask the agent, and watch Syndicate confirm what&apos;s actually exploitable — in real time.
        </p>
      </div>

      <div
        ref={rootRef}
        className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[0_40px_90px_-40px_rgba(0,0,0,0.5)]"
      >
        {/* chrome bar */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-foreground/20" />
              <span className="size-2.5 rounded-full bg-foreground/20" />
              <span className="size-2.5 rounded-full bg-accent-blue/70" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground">{active.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-blue">
              <Pulse /> Live
            </span>
            <span className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground/70">{clock}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          {/* sidebar */}
          <aside className="flex gap-1 overflow-x-auto border-b border-border bg-muted/20 p-3 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
            {MODULES.map((m) => {
              const on = m.id === activeId;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveId(m.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-[var(--radius-sm)] border px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
                    on
                      ? "border-accent-blue/40 bg-accent-blue/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={on ? "text-accent-blue" : "opacity-70"}
                  >
                    <path d={m.icon} />
                  </svg>
                  <span className="hidden sm:inline md:inline">{m.label}</span>
                </button>
              );
            })}
            <div className="ml-auto mt-0 hidden items-center gap-2 px-2 pt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70 md:mt-auto md:flex">
              <Pulse /> sandbox armed
            </div>
          </aside>

          {/* main */}
          <div className="flex flex-col p-5 md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-[22px] font-medium leading-tight">{active.title}</div>
                <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  {active.subtitle}
                </div>
              </div>
              <div className="hidden gap-4 pt-1 sm:flex">
                {["Overview", "Stream", "Agents"].map((t, i) => (
                  <span
                    key={t}
                    className={`border-b-[1.5px] pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] ${
                      i === 0 ? "border-accent-blue text-foreground" : "border-transparent text-muted-foreground/70"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              {active.kpis.map((k, i) => (
                <div key={k.lbl} className="rounded-[var(--radius-sm)] border border-border bg-muted/30 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">{k.lbl}</div>
                  <div
                    className={`mt-2 font-display text-[clamp(20px,2.4vw,30px)] leading-none transition-colors duration-300 ${
                      k.accent ? "text-accent-blue" : "text-foreground"
                    } ${flash === i ? "!text-accent-blue" : ""}`}
                  >
                    {fmt(kpiVals[i] ?? k.val, k.fmt)}
                  </div>
                  <div className="mt-1.5 text-[11.5px] text-muted-foreground">{k.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
              {/* chat */}
              <div className="flex flex-col rounded-[var(--radius-sm)] border border-border bg-muted/20 p-4">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  Ask the agent
                </div>
                <div ref={threadRef} className="flex max-h-[230px] flex-1 flex-col gap-3 overflow-y-auto pr-1">
                  {msgs.map((m, i) => (
                    <MsgRow key={i} m={m} />
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="mt-3 flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-background/60 px-3 py-2.5 focus-within:border-accent-blue/50"
                >
                  <span className="font-mono text-accent-blue">›</span>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Brief me on what's exploitable…"
                    aria-label="Message the Syndicate agent"
                    autoComplete="off"
                    className="flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60"
                  />
                  <button
                    type="submit"
                    aria-label="Send"
                    className="grid size-7 place-items-center rounded-[6px] bg-accent-blue text-background transition-transform hover:translate-x-px"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => send(c)}
                      className="rounded-full border border-border bg-background/40 px-2.5 py-1.5 font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-accent-blue/40 hover:bg-accent-blue/10 hover:text-foreground"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* activity feed */}
              <div className="flex flex-col rounded-[var(--radius-sm)] border border-border bg-muted/20 p-4">
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70">
                  Activity <Pulse />
                </div>
                <ul className="flex flex-col gap-px overflow-hidden">
                  {feed.map((f, i) => (
                    <li
                      key={f.t + f.text + i}
                      className="grid animate-[ld-slide_0.4s_ease] grid-cols-[auto_1fr_auto] items-center gap-2.5 border-b border-hairline py-2.5 last:border-b-0"
                    >
                      <span className={`size-1.5 rounded-full ${f.act ? "bg-accent-blue ring-2 ring-accent-blue/20" : "bg-accent-blue/70"}`} />
                      <span className={`truncate text-[12.5px] ${f.act ? "text-foreground" : "text-muted-foreground"}`}>{f.text}</span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">{f.t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] tracking-[0.04em] text-muted-foreground/70">
        Interactive preview · simulated data. The real engine runs in an isolated environment and verifies every finding by exploitation.
      </p>

      <style>{`
        @keyframes ld-slide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @keyframes ld-blink { 0%,100% { opacity: 0.25; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          [id="live-demo"] * { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

function Pulse() {
  return (
    <span className="relative inline-flex size-[7px]">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-blue/60" />
      <span className="relative inline-flex size-[7px] rounded-full bg-accent-blue" />
    </span>
  );
}

function MsgRow({ m }: { m: Msg }) {
  if (m.role === "thinking") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent-blue">Syndicate</span>
        <span className="inline-flex gap-1 py-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-[5px] rounded-full bg-muted-foreground/60"
              style={{ animation: `ld-blink 1.2s ${i * 0.2}s infinite` }}
            />
          ))}
        </span>
      </div>
    );
  }
  if (m.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground/70">You</span>
        <span className="max-w-[85%] rounded-[12px_12px_2px_12px] bg-accent-blue/12 px-3 py-2 text-[13px] text-foreground">
          {m.text}
        </span>
      </div>
    );
  }
  if (m.role === "steps") {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent-blue">Syndicate</span>
        <div className="mt-0.5 flex flex-col gap-2.5">
          {m.steps.slice(0, m.shown).map(([phase, body], i) => {
            const isLastShown = i === m.shown - 1;
            const text = isLastShown ? m.typed : body;
            const isFinal = i === m.steps.length - 1;
            return (
              <div key={phase} className="flex items-start gap-3">
                <span className="w-[72px] shrink-0 pt-0.5 font-mono text-[9.5px] uppercase tracking-[0.1em] text-accent-blue">
                  0{i + 1} {phase}
                </span>
                <span className={`text-[12.5px] leading-snug ${isFinal ? "text-foreground" : "text-muted-foreground"}`}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  // agent plain text
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent-blue">Syndicate</span>
      <span className="text-[13px] leading-relaxed text-muted-foreground">{m.text}</span>
    </div>
  );
}
