import { cn } from "@/lib/cn";

/** Four corner brackets — framing device used on technical panels and imagery. */
export function Brackets({ className, size = 10, tone = "border-steel-2" }: { className?: string; size?: number; tone?: string }) {
  const s = { width: size, height: size };
  const base = cn("pointer-events-none absolute", tone);
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span style={s} className={cn(base, "left-0 top-0 border-l border-t")} />
      <span style={s} className={cn(base, "right-0 top-0 border-r border-t")} />
      <span style={s} className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span style={s} className={cn(base, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}
