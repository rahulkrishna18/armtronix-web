import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  index?: string;
  className?: string;
  tone?: "mute" | "cyan" | "green" | "white" | "dim";
  dot?: boolean;
};

const tones = {
  mute: "text-mute",
  cyan: "text-cyan",
  green: "text-green",
  white: "text-white",
  dim: "text-dim",
};

/** Monospace engineering label, e.g. `[02] — ECOSYSTEM`. */
export function TechLabel({ children, index, className, tone = "mute", dot }: Props) {
  return (
    <span className={cn("tech-label inline-flex items-center gap-2.5", tones[tone], className)}>
      {dot && <span aria-hidden className="size-1.5 shrink-0 bg-current" />}
      {index && (
        <>
          <span className="text-cyan">[{index}]</span>
          <span aria-hidden className="text-dim">·</span>
        </>
      )}
      <span>{children}</span>
    </span>
  );
}
