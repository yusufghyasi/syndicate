"use client";

import { useEffect, useState } from "react";

type Row = [string, string];

function useDiagnostics(): { rows: Row[]; clock: string } | null {
  const [data, setData] = useState<{ rows: Row[]; clock: string } | null>(null);

  useEffect(() => {
    const read = (): { rows: Row[]; clock: string } => {
      const nav = navigator;
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const utc = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
      const local = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      let webgl = "DISABLED";
      try {
        const c = document.createElement("canvas");
        webgl =
          c.getContext("webgl") || c.getContext("experimental-webgl")
            ? "ENABLED"
            : "DISABLED";
      } catch {
        webgl = "DISABLED";
      }
      const rows: Row[] = [
        ["PLATFORM", nav.platform || "—"],
        ["CORES", String(nav.hardwareConcurrency ?? "—")],
        ["LANGUAGE", nav.language || "—"],
        ["VIEWPORT", `${window.innerWidth}×${window.innerHeight}`],
        ["SCREEN", `${screen.width}×${screen.height}`],
        ["PIXEL RATIO", String(window.devicePixelRatio || 1)],
        ["TIMEZONE", Intl.DateTimeFormat().resolvedOptions().timeZone || "—"],
        ["COOKIES", nav.cookieEnabled ? "ENABLED" : "DISABLED"],
        ["WEBGL", webgl],
        ["ONLINE", nav.onLine ? "● ONLINE" : "○ OFFLINE"],
        ["UTC", utc],
        ["LOCAL", local],
      ];
      return { rows, clock: utc };
    };

    // Defer the first read out of the effect's sync phase, then tick.
    const raf = requestAnimationFrame(() => setData(read()));
    const id = setInterval(() => setData(read()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  return data;
}

const PLACEHOLDER: Row[] = [
  ["PLATFORM", "—"],
  ["CORES", "—"],
  ["LANGUAGE", "—"],
  ["VIEWPORT", "—"],
  ["SCREEN", "—"],
  ["PIXEL RATIO", "—"],
  ["TIMEZONE", "—"],
  ["COOKIES", "—"],
  ["WEBGL", "—"],
  ["ONLINE", "—"],
  ["UTC", "—"],
  ["LOCAL", "—"],
];

/** Footer DIAGNOSTICS panel — a live readout of the visitor's environment. */
export function DiagnosticsPanel() {
  const data = useDiagnostics();
  const rows = data?.rows ?? PLACEHOLDER;

  return (
    <div className="relative rounded-[var(--radius)] border border-border p-6">
      <div className="mb-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Diagnostics
      </div>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-[11px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="truncate text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Tiny fixed bottom-left CLIENT readout. */
export function ClientReadout() {
  const data = useDiagnostics();
  const get = (k: string) => data?.rows.find((r) => r[0] === k)?.[1] ?? "—";

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-30 hidden select-none font-mono text-[9px] leading-[1.6] uppercase tracking-[0.08em] text-muted-foreground/60 lg:block">
      <div>CLIENT: {get("PLATFORM")}</div>
      <div>VIEWPORT: {get("VIEWPORT")}</div>
      <div>LOCAL: {get("LOCAL")}</div>
    </div>
  );
}
