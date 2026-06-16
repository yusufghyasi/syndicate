"use client";

import { useEffect, useRef, useState } from "react";

type Line = { text: string; tone?: "dim" | "ok" | "crit" | "warn" };

const SCRIPT: Line[] = [
  { text: "$ syndicate assess --target app.company.com", tone: "dim" },
  { text: "→ enumerating attack surface ...", tone: "dim" },
  { text: "  412 endpoints · 38 forms · 11 auth flows" },
  { text: "→ probing access control ...", tone: "dim" },
  { text: "  candidate: IDOR /api/v2/orders/{id}", tone: "warn" },
  { text: "→ chaining IDOR → privilege escalation ...", tone: "dim" },
  { text: "  CONFIRMED account takeover via object reference", tone: "crit" },
  { text: "→ writing reproduction + remediation ...", tone: "dim" },
  { text: "  report ready: 1 critical · 3 high · 6 medium", tone: "ok" },
  { text: "  0 false positives", tone: "ok" },
];

const toneClass: Record<string, string> = {
  dim: "text-muted-foreground",
  ok: "text-accent-green",
  crit: "text-accent-red",
  warn: "text-accent-amber",
  default: "text-foreground",
};

export default function LiveTerminal({ className = "" }: { className?: string }) {
  const [done, setDone] = useState<Line[]>([]);
  const [cur, setCur] = useState<{ text: string; tone: string }>({
    text: "",
    tone: "default",
  });
  const li = useRef(0);
  const ci = useRef(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      const line = SCRIPT[li.current];
      if (!line) {
        t = setTimeout(() => {
          setDone([]);
          setCur({ text: "", tone: "default" });
          li.current = 0;
          ci.current = 0;
          t = setTimeout(tick, 400);
        }, 2800);
        return;
      }

      const tone = line.tone ?? "default";

      if (reduce) {
        setDone((d) => [...d, line]);
        li.current += 1;
        t = setTimeout(tick, 120);
        return;
      }

      ci.current += 1;
      setCur({ text: line.text.slice(0, ci.current), tone });

      if (ci.current >= line.text.length) {
        setDone((d) => [...d, line]);
        setCur({ text: "", tone: "default" });
        li.current += 1;
        ci.current = 0;
        t = setTimeout(tick, 240);
      } else {
        t = setTimeout(tick, 14 + Math.random() * 22);
      }
    };

    t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`relative rounded-[var(--radius)] border border-border bg-card ${className}`}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        <span className="size-1.5 bg-accent-green" />
        syndicate · live assessment
      </div>
      <pre className="min-h-[240px] whitespace-pre-wrap break-words px-5 py-4 font-mono text-[12px] leading-relaxed">
        {done.map((l, i) => (
          <div key={i} className={toneClass[l.tone ?? "default"]}>
            {l.text}
          </div>
        ))}
        {cur.text && (
          <div className={toneClass[cur.tone]}>
            {cur.text}
            <span className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-0.5 bg-foreground blink" />
          </div>
        )}
      </pre>
    </div>
  );
}
