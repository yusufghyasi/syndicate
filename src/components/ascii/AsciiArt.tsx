"use client";

import { useEffect, useRef } from "react";

/**
 * Faint Braille/ASCII art. Renders a pre-baked art string behind/within
 * content, with a subtle scroll-driven drift written straight to the DOM
 * node's transform (no per-frame React state). Decorative only.
 */
export default function AsciiArt({
  art,
  className = "",
  drift = true,
  opacity = 0.22,
  size = "clamp(6px, 1vw, 13px)",
}: {
  art: string;
  className?: string;
  drift?: boolean;
  opacity?: number;
  size?: string;
}) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!drift) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        el.style.transform = `translate3d(0, ${(-p * 20).toFixed(1)}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [drift]);

  return (
    <pre
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none whitespace-pre text-foreground will-change-transform ${className}`}
      style={{ fontSize: size, lineHeight: 1, opacity, letterSpacing: "0.02em" }}
    >
      {art}
    </pre>
  );
}
