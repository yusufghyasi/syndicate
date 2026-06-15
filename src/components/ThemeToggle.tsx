"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  // `mounted` guards against a hydration mismatch: the server can't know the
  // stored/preferred theme, so the first client render must match the server
  // (a neutral placeholder), then we reveal the real icon after mount.
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Defer out of the effect's synchronous phase to avoid a cascading render.
    const id = requestAnimationFrame(() => {
      setDark(document.documentElement.classList.contains("dark"));
      setMounted(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid size-8 place-items-center border border-border transition-colors hover:bg-muted"
    >
      {/* Until mounted, render an invisible fixed-size box so SSR + first
          client render are byte-identical. */}
      {!mounted ? (
        <span className="size-3.5" />
      ) : dark ? (
        <Sun className="size-3.5" />
      ) : (
        <Moon className="size-3.5" />
      )}
    </button>
  );
}
