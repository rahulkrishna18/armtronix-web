import { cn } from "@/lib/cn";

/** Measurement tick strip. Purely decorative. */
export function Ruler({
  ticks = 40,
  major = 5,
  className,
  vertical = false,
}: {
  ticks?: number;
  major?: number;
  className?: string;
  vertical?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none flex justify-between text-steel-2",
        vertical ? "h-full flex-col" : "w-full items-end",
        className,
      )}
    >
      {Array.from({ length: ticks + 1 }, (_, i) => (
        <span
          key={i}
          className={cn("bg-current", vertical ? "h-px" : "w-px", i % major === 0 ? (vertical ? "w-3" : "h-3") : vertical ? "w-1.5" : "h-1.5")}
        />
      ))}
    </div>
  );
}
