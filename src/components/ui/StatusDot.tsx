import { cn } from "@/lib/cn";

const colors = {
  green: "text-green bg-green",
  cyan: "text-cyan bg-cyan",
  blue: "text-blue bg-blue",
  amber: "text-amber bg-amber",
  red: "text-red bg-red",
  dim: "text-dim bg-dim",
};

export function StatusDot({
  tone = "green",
  pulse = true,
  className,
}: {
  tone?: keyof typeof colors;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-1.5 shrink-0 rounded-full", colors[tone], pulse && "animate-pulse-dot", className)}
    />
  );
}
