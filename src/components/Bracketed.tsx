import { cn } from "@/lib/utils";

/** Wraps content in a hairline box with four bracket corners (hacktron frame). */
export default function Bracketed({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bracket-frame relative border border-border", className)}>
      <span className="bracket-corners" />
      {children}
    </div>
  );
}
