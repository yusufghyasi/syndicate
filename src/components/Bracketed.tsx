import { cn } from "@/lib/utils";

/** Wraps content in a soft rounded hairline box (SF-style card frame). */
export default function Bracketed({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-[var(--radius)] border border-border", className)}>
      {children}
    </div>
  );
}
