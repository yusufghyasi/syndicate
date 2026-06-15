"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sniper-scope custom cursor.
 *
 * A reticle that tracks the pointer: a crosshair with a center dot, tick marks,
 * and an outer ring that "locks on" (tightens + turns accent-red) when hovering
 * an interactive target. Range/coordinate HUD text trails the scope for a
 * tactical, pentest feel. Pure transform/opacity animation — cheap and smooth.
 *
 * Disabled on touch / coarse pointers and when the user prefers reduced motion,
 * where it both makes no sense and would hide the native cursor.
 */
export default function SniperCursor() {
  const [enabled, setEnabled] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  // Smoothed (lerped) position for the trailing HUD vs. the instant scope.
  const target = useRef({ x: -100, y: -100 });
  const hud = useRef({ x: -100, y: -100 });
  const locked = useRef(false);
  const down = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("sniper-cursor");

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Lock-on when the element (or an ancestor) is interactive.
      const el = e.target as Element | null;
      locked.current = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="target"]',
      );
    };
    const onDown = () => (down.current = true);
    const onUp = () => (down.current = false);
    const onLeave = () => {
      target.current.x = -100;
      target.current.y = -100;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointerout", (e) => {
      if (!e.relatedTarget) onLeave();
    });

    let raf = 0;
    const tick = () => {
      const scope = scopeRef.current;
      const hudEl = hudRef.current;
      if (scope) {
        const lock = locked.current;
        const press = down.current;
        // Scope follows instantly; scale tightens on lock / press.
        const s = press ? 0.82 : lock ? 0.9 : 1;
        scope.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%) scale(${s})`;
        scope.dataset.lock = lock ? "1" : "0";
        scope.dataset.press = press ? "1" : "0";
      }
      if (hudEl) {
        // HUD trails with a soft lerp.
        hud.current.x += (target.current.x - hud.current.x) * 0.18;
        hud.current.y += (target.current.y - hud.current.y) * 0.18;
        hudEl.style.transform = `translate3d(${hud.current.x}px, ${hud.current.y}px, 0)`;
        hudEl.textContent = `${String(Math.round(target.current.x)).padStart(4, "0")} · ${String(
          Math.round(target.current.y),
        ).padStart(4, "0")}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("sniper-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="sniper-root pointer-events-none fixed inset-0 z-[9999]">
      {/* Trailing coordinate HUD */}
      <div
        ref={hudRef}
        className="sniper-hud absolute left-0 top-0 ml-4 mt-4 select-none font-mono text-[9px] uppercase tracking-[0.18em] text-accent-red/80"
        style={{ willChange: "transform" }}
      />

      {/* The scope */}
      <div
        ref={scopeRef}
        className="sniper-scope absolute left-0 top-0"
        data-lock="0"
        data-press="0"
        style={{ willChange: "transform" }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          {/* outer ring */}
          <circle className="sniper-ring" cx="28" cy="28" r="20" strokeWidth="1" />
          {/* inner ring (appears on lock) */}
          <circle className="sniper-ring-inner" cx="28" cy="28" r="11" strokeWidth="1" />
          {/* crosshair arms (gap in the middle) */}
          <line className="sniper-line" x1="28" y1="2" x2="28" y2="13" strokeWidth="1" />
          <line className="sniper-line" x1="28" y1="43" x2="28" y2="54" strokeWidth="1" />
          <line className="sniper-line" x1="2" y1="28" x2="13" y2="28" strokeWidth="1" />
          <line className="sniper-line" x1="43" y1="28" x2="54" y2="28" strokeWidth="1" />
          {/* center dot */}
          <circle className="sniper-dot" cx="28" cy="28" r="1.4" />
        </svg>
      </div>
    </div>
  );
}
