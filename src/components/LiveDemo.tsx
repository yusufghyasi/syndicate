"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * LiveDemo — a full-width interactive Syndicate operations dashboard that sits
 * right under the hero copy (agaro.ai "click anything" style), in Syndicate's
 * SF-blue / off-white / pitch-black + rounded scheme. Pure React + Tailwind.
 *
 * Interactive:
 *   - Left sidebar nav (grouped) — click a module to refocus the dashboard
 *   - Top tabs (Overview / Runs / Health / Spend) — switch the KPI set
 *   - Live KPIs that tick, a live area chart, a modules-health list (click a
 *     row to inspect), a streaming live feed, and an Insights rail.
 */

// ----- sidebar nav (grouped, pentest modules) -----
const NAV: { group: string; items: { id: string; label: string; icon: string; badge?: string }[] }[] = [
  {
    group: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "M3 3h5v5H3zM10 3h5v5h-5zM3 10h5v5H3zM10 10h5v5h-5z", badge: "9" },
      { id: "activity", label: "Activity", icon: "M3 14V3M3 14h12M6 11l3-4 3 2 3-5" },
      { id: "audit", label: "Audit log", icon: "M9 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM9 7v2l1.5 1" },
    ],
  },
  {
    group: "Recon",
    items: [
      { id: "surface", label: "Attack Surface", icon: "M9 2v3M9 13v3M2 9h3M13 9h3M9 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" },
      { id: "auth", label: "Auth & Sessions", icon: "M5 8V6a4 4 0 0 1 8 0v2M4 8h10v6H4z" },
    ],
  },
  {
    group: "Exploitation",
    items: [
      { id: "engine", label: "Exploit Engine", icon: "M3 13 L8 8 M6 4h7v7 M13 4l-9 9" },
      { id: "chains", label: "Attack Chains", icon: "M6 9a2 2 0 0 1 2-2h1M12 9a2 2 0 0 1-2 2H9M5 7l-2 2 2 2M13 7l2 2-2 2" },
      { id: "idor", label: "Access Control", icon: "M9 2 L15 5 V9 C15 13 12 15 9 16 C6 15 3 13 3 9 V5 Z" },
    ],
  },
  {
    group: "Findings",
    items: [
      { id: "confirmed", label: "Confirmed", icon: "M4 9l3 3 7-7" },
      { id: "report", label: "Reports", icon: "M4 3h10v12H4zM7 7h4M7 10h4" },
    ],
  },
  {
    group: "Coverage",
    items: [{ id: "scope", label: "Scope & Targets", icon: "M9 3v12M3 9h12" }],
  },
];

// ----- KPI sets per tab -----
type Kpi = { lbl: string; val: number; fmt: "int" | "pct" | "k" | "score"; sub: string; accent?: boolean };
const TABS: { id: string; label: string; kpis: Kpi[] }[] = [
  {
    id: "overview",
    label: "Overview",
    kpis: [
      { lbl: "Targets live", val: 9, fmt: "int", sub: "+2 this scan", accent: true },
      { lbl: "Requests / 24h", val: 84200, fmt: "k", sub: "across sandbox" },
      { lbl: "Confirmed", val: 9, fmt: "int", sub: "by exploitation" },
      { lbl: "False positives", val: 0, fmt: "int", sub: "PoC || GTFO" },
    ],
  },
  {
    id: "runs",
    label: "Runs",
    kpis: [
      { lbl: "Chains run", val: 1842, fmt: "int", sub: "this session" },
      { lbl: "Succeeded", val: 142, fmt: "int", accent: true, sub: "reached impact" },
      { lbl: "Mean time", val: 340, fmt: "int", sub: "ms to PoC" },
      { lbl: "Coverage", val: 96, fmt: "pct", sub: "of surface" },
    ],
  },
  {
    id: "health",
    label: "Health",
    kpis: [
      { lbl: "Critical", val: 2, fmt: "int", accent: true, sub: "exploitable now" },
      { lbl: "High", val: 5, fmt: "int", sub: "chainable" },
      { lbl: "Mean CVSS", val: 84, fmt: "score", sub: "top findings" },
      { lbl: "Replayable", val: 100, fmt: "pct", sub: "every finding" },
    ],
  },
  {
    id: "spend",
    label: "Scope",
    kpis: [
      { lbl: "In scope", val: 1284, fmt: "int", sub: "endpoints" },
      { lbl: "Out of scope", val: 38, fmt: "int", sub: "respected" },
      { lbl: "Credentials", val: 0, fmt: "int", accent: true, sub: "retained" },
      { lbl: "Environments", val: 1, fmt: "int", sub: "isolated" },
    ],
  },
];

// ----- modules health list -----
const MODULES = [
  { name: "Attack Surface", grp: "RECON", icon: "M9 2v3M2 9h3M13 9h3M9 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z", meta: "1,284 endpoints", status: "mapped" },
  { name: "Auth & Sessions", grp: "RECON", icon: "M5 8V6a4 4 0 0 1 8 0v2M4 8h10v6H4z", meta: "7 flows", status: "bypass" },
  { name: "Exploit Engine", grp: "EXPLOITATION", icon: "M3 13 L8 8 M6 4h7v7", meta: "142 chains", status: "active" },
  { name: "Access Control", grp: "EXPLOITATION", icon: "M9 2 L15 5 V9 C15 13 12 15 9 16 C6 15 3 13 3 9 V5 Z", meta: "IDOR · BOLA", status: "confirmed" },
  { name: "Injection", grp: "EXPLOITATION", icon: "M3 13 L8 8 M13 4l-9 9", meta: "SQLi · cmd", status: "confirmed" },
  { name: "Confirmed Findings", grp: "FINDINGS", icon: "M4 9l3 3 7-7", meta: "2 crit · 5 high", status: "review" },
];

// ----- live feed events -----
const FEED = [
  ["Attack Surface", "mapped", "214 routes crawled · /api/v2"],
  ["Access Control", "confirmed", "IDOR · /api/orders/{id} cross-tenant"],
  ["Injection", "confirmed", "SQLi chained → data read"],
  ["Auth & Sessions", "bypass", "privilege escalation · role=admin"],
  ["Exploit Engine", "active", "SSRF reached internal metadata"],
  ["Confirmed Findings", "review", "Pre-auth RCE via unsafe deserialize"],
];

// ----- insights rail -----
const INSIGHTS = [
  { tag: "CRITICAL", title: "Pre-auth RCE confirmed", body: "Unsafe deserialization on /api/import reached code execution in the sandbox — no auth required.", stat: "CVSS 9.8", delta: "exploited" },
  { tag: "EXPLOIT", title: "IDOR chain reads any tenant", body: "Predictable order IDs + missing object-level checks let a low-priv user read across tenants.", stat: "1,284 objects", delta: "cross-tenant" },
  { tag: "COVERAGE", title: "Surface fully enumerated", body: "GraphQL introspection + crawl mapped the full route table, including a hidden /ops admin panel.", stat: "100% mapped", delta: "+1 hidden" },
];

function fmt(v: number, kind: Kpi["fmt"]) {
  if (kind === "k") return (v / 1000).toFixed(1) + "K";
  if (kind === "pct") return Math.round(v) + "%";
  if (kind === "score") return (v / 10).toFixed(1);
  return Math.round(v).toLocaleString("en-US");
}

// deterministic-ish chart path (handled vs escalated)
const HANDLED = [22, 26, 24, 30, 28, 34, 33, 40, 52, 66, 78, 72, 64, 58];
const ESCAL = [3, 4, 3, 5, 4, 4, 5, 4, 6, 5, 7, 6, 5, 5];

export default function LiveDemo() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("overview");
  const [activeModule, setActiveModule] = useState(0);
  const tab = TABS.find((t) => t.id === activeTab)!;

  const [kpiVals, setKpiVals] = useState<number[]>(tab.kpis.map((k) => k.val));
  const [flash, setFlash] = useState(-1);
  const [feed, setFeed] = useState<{ mod: string; status: string; text: string; t: string }[]>([]);
  const feedIdx = useRef(0);
  const [clock, setClock] = useState("--:--:--");
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const navLabel = useMemo(() => {
    for (const g of NAV) for (const it of g.items) if (it.id === activeNav) return it.label;
    return "Dashboard";
  }, [activeNav]);

  useEffect(() => setKpiVals(tab.kpis.map((k) => k.val)), [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const now = nowStr();
    setFeed(FEED.slice(0, 4).map(([mod, status, text]) => ({ mod, status, text, t: now })));
    feedIdx.current = 4;
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => setInView(e.isIntersecting)), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const t = () => { const d = new Date(); const p = (n: number) => String(n).padStart(2, "0"); setClock(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`); };
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setKpiVals((prev) => prev.map((v, i) => {
        const base = tab.kpis[i].val;
        return Math.max(0, base + base * (Math.random() * 0.012 - 0.004));
      }));
      setFlash(Math.floor(Math.random() * tab.kpis.length));
      setTimeout(() => setFlash(-1), 480);
    }, 2300);
    return () => clearInterval(id);
  }, [inView, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      const [mod, status, text] = FEED[feedIdx.current % FEED.length];
      feedIdx.current += 1;
      setFeed((prev) => [{ mod, status, text, t: nowStr() }, ...prev].slice(0, 5));
    }, 3800);
    return () => clearInterval(id);
  }, [inView]);

  function nowStr() { const d = new Date(); const p = (n: number) => String(n).padStart(2, "0"); return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`; }

  // build chart SVG paths
  const W = 560, H = 150, n = HANDLED.length;
  const max = Math.max(...HANDLED) * 1.15;
  const xs = (i: number) => (i / (n - 1)) * W;
  const ys = (v: number) => H - (v / max) * H;
  const line = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(" ");
  const area = `${line(HANDLED)} L${W},${H} L0,${H} Z`;

  return (
    <div ref={rootRef} className="relative z-10 mx-auto w-full max-w-[1240px] px-4 pb-24 sm:px-6">
      {/* LIVE DEMO pill */}
      <div className="mb-5 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
          <Pulse /> Live demo · click anything
        </span>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[0_50px_120px_-50px_rgba(0,0,0,0.6)]">
        {/* ===== top bar ===== */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
          <span className="flex gap-1.5">
            <span className="size-3 rounded-full bg-foreground/15" />
            <span className="size-3 rounded-full bg-foreground/15" />
            <span className="size-3 rounded-full bg-accent-blue/70" />
          </span>
          <span className="ml-1 inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-background/50 px-2.5 py-1.5 text-[12px]">
            <span className="grid size-4 place-items-center rounded bg-accent-blue/20 text-[9px] text-accent-blue">◆</span>
            <span className="font-medium">Acme Corp</span>
            <span className="text-muted-foreground/60">▾</span>
          </span>
          <div className="mx-2 hidden min-w-0 flex-1 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-background/40 px-3 py-1.5 text-[12px] text-muted-foreground/60 md:flex">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="7" cy="7" r="4.5" /><path d="M11 11l3 3" strokeLinecap="round" /></svg>
            <span className="truncate">Search targets, runs, findings…</span>
            <span className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">⌘K</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-background/40 px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground sm:flex">All targets ▾</span>
            <span className="hidden items-center gap-1.5 rounded-[var(--radius-sm)] border border-border bg-background/40 px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground sm:flex">Last 24h ▾</span>
            <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-foreground px-3 py-1.5 text-[11px] font-medium text-background">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v12M2 8h12" strokeLinecap="round" /></svg>
              Generate report
            </span>
          </div>
        </div>

        {/* ===== body: sidebar | center | insights ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[208px_1fr] xl:grid-cols-[208px_1fr_300px]">
          {/* sidebar */}
          <aside className="hidden border-r border-border bg-muted/20 p-3 lg:block">
            {NAV.map((g) => (
              <div key={g.group} className="mb-4">
                <div className="px-2 pb-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground/50">{g.group}</div>
                {g.items.map((it) => {
                  const on = it.id === activeNav;
                  return (
                    <button
                      key={it.id}
                      onClick={() => setActiveNav(it.id)}
                      className={`flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-[13px] transition-colors ${
                        on ? "bg-accent-blue/10 font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={on ? "text-accent-blue" : "opacity-70"}><path d={it.icon} /></svg>
                      <span className="truncate">{it.label}</span>
                      {it.badge && <span className={`ml-auto rounded px-1.5 py-0.5 font-mono text-[9.5px] ${on ? "bg-accent-blue/20 text-accent-blue" : "bg-muted text-muted-foreground"}`}>{it.badge}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* center */}
          <div className="min-w-0 p-5 sm:p-6">
            <div className="font-display text-[22px] font-medium tracking-tight">{navLabel}</div>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Assessment summary across every target in scope — last 24 hours, isolated environment.
            </p>

            {/* tabs */}
            <div className="mt-4 inline-flex gap-1 rounded-[var(--radius-sm)] border border-border bg-muted/30 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`rounded-[5px] px-3 py-1.5 text-[12px] transition-colors ${
                    activeTab === t.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* KPI cards */}
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {tab.kpis.map((k, i) => (
                <div key={k.lbl} className="rounded-[var(--radius-sm)] border border-border bg-muted/20 p-4">
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground/70">{k.lbl}</div>
                  <div className={`mt-2 font-display text-[clamp(22px,2.6vw,30px)] leading-none transition-colors duration-300 ${k.accent ? "text-accent-blue" : "text-foreground"} ${flash === i ? "!text-accent-blue" : ""}`}>
                    {fmt(kpiVals[i] ?? k.val, k.fmt)}
                  </div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground">{k.sub}</div>
                </div>
              ))}
            </div>

            {/* chart + modules health */}
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
              {/* chart */}
              <div className="rounded-[var(--radius-sm)] border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground/70">Requests · last 24h</div>
                    <div className="mt-1 font-display text-[19px]">84,212 <span className="text-[13px] text-muted-foreground">handled</span></div>
                  </div>
                  <div className="flex gap-3 font-mono text-[10px] uppercase tracking-[0.08em]">
                    <span className="flex items-center gap-1.5 text-foreground"><span className="h-px w-3 bg-foreground" /> Handled</span>
                    <span className="flex items-center gap-1.5 text-accent-blue"><span className="h-px w-3 border-t border-dashed border-accent-blue" /> Confirmed</span>
                  </div>
                </div>
                <svg viewBox={`0 0 ${W} ${H + 22}`} className="mt-3 w-full" preserveAspectRatio="none" style={{ height: 170 }}>
                  <defs>
                    <linearGradient id="ldfill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={area} fill="url(#ldfill)" />
                  <path d={line(HANDLED)} fill="none" stroke="var(--accent-blue)" strokeWidth="1.6" />
                  <path d={line(ESCAL)} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="text-muted-foreground/50" />
                  {["00:00", "06:00", "12:00", "18:00", "24:00"].map((lbl, i) => (
                    <text key={lbl} x={(i / 4) * W} y={H + 16} fontSize="9" fontFamily="var(--font-mono)" fill="currentColor" className="text-muted-foreground/50" textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}>{lbl}</text>
                  ))}
                </svg>
              </div>

              {/* modules health */}
              <div className="rounded-[var(--radius-sm)] border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground/70">Modules · health</div>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground/50">tap a row</span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  {MODULES.map((m, i) => {
                    const on = i === activeModule;
                    return (
                      <button
                        key={m.name}
                        onClick={() => setActiveModule(i)}
                        className={`flex items-center gap-3 rounded-[var(--radius-sm)] border px-3 py-2.5 text-left transition-colors ${
                          on ? "border-accent-blue/40 bg-accent-blue/[0.07]" : "border-border bg-background/30 hover:bg-muted"
                        }`}
                      >
                        <span className="grid size-7 shrink-0 place-items-center rounded-[6px] bg-accent-blue/10">
                          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent-blue"><path d={m.icon} /></svg>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium">{m.name}</span>
                          <span className="block font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground/60">{m.grp}</span>
                        </span>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] ${
                          m.status === "confirmed" || m.status === "bypass" ? "bg-accent-blue/15 text-accent-blue" : "bg-muted text-muted-foreground"
                        }`}>{m.status}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* live feed */}
            <div className="mt-4 rounded-[var(--radius-sm)] border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground/70">Recent activity · live feed <Pulse /></div>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground/50">{clock} UTC</span>
              </div>
              <ul className="mt-3 flex flex-col">
                {feed.map((f, i) => (
                  <li key={f.t + f.text + i} className="grid animate-[ld-slide_0.4s_ease] grid-cols-[52px_1fr_auto] items-center gap-3 border-b border-hairline py-2.5 last:border-b-0">
                    <span className="font-mono text-[10px] text-muted-foreground/50">{f.t}</span>
                    <span className="min-w-0">
                      <span className="text-[12.5px] text-foreground">{f.mod}</span>
                      <span className="ml-2 text-[12px] text-muted-foreground">— {f.text}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase ${
                      f.status === "confirmed" || f.status === "bypass" ? "bg-accent-blue/15 text-accent-blue" : "bg-muted text-muted-foreground"
                    }`}>{f.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* insights rail */}
          <aside className="hidden border-l border-border bg-muted/10 p-4 xl:block">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-display text-[15px]"><span className="text-accent-blue">◆</span> Insights</div>
              <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/50">updated 1m ago</span>
            </div>
            <div className="flex flex-col gap-3">
              {INSIGHTS.map((ins) => (
                <div key={ins.title} className="rounded-[var(--radius-sm)] border border-border bg-background/30 p-3.5">
                  <span className="inline-block rounded bg-accent-blue/12 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent-blue">{ins.tag}</span>
                  <div className="mt-2 text-[13px] font-medium leading-tight">{ins.title}</div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">{ins.body}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-hairline pt-2.5 font-mono text-[10px]">
                    <span className="text-muted-foreground/70">{ins.stat}</span>
                    <span className="text-accent-blue">{ins.delta}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @keyframes ld-slide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .ld-anim, [style*="ld-slide"] { animation: none !important; }
        }
      `}</style>
    </div>
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
