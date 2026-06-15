const ITEMS = Array.from({ length: 8 }).flatMap(() => [
  "SYNDICATE",
  "PoC || GTFO",
]);

export default function Ticker() {
  return (
    <div className="overflow-hidden border-t border-border bg-foreground py-2.5 text-background">
      <div className="flex w-max animate-marquee-slow items-center gap-8 whitespace-nowrap">
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <span
            key={i}
            className={
              t === "SYNDICATE"
                ? "font-display text-[11px] font-medium tracking-[0.28em]"
                : "text-[11px] uppercase tracking-[0.18em] opacity-60"
            }
          >
            {t}
            <span className="ml-8 opacity-40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
