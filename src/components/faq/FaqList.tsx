"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t border-steel/70">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className="border-b border-steel/70">
            <h2>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-a-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start gap-5 py-6 text-left sm:gap-8 sm:py-7"
              >
                <span className={cn("pt-1.5 font-mono text-[11px] transition-colors", isOpen ? "text-cyan" : "text-dim")}>Q.{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("flex-1 text-[clamp(1.1rem,1.8vw,1.45rem)] font-medium leading-snug tracking-[-0.01em] transition-colors", isOpen ? "text-white" : "text-white/75 group-hover:text-white")}>
                  {item.q}
                </span>
                <span aria-hidden className={cn("relative mt-1.5 flex size-6 shrink-0 items-center justify-center border transition-colors", isOpen ? "border-cyan text-cyan" : "border-steel-2 text-mute")}>
                  <span className="absolute h-px w-2.5 bg-current" />
                  <span className={cn("absolute h-2.5 w-px bg-current transition-transform duration-300", isOpen && "scale-y-0")} />
                </span>
              </button>
            </h2>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              className={cn("grid transition-[grid-template-rows] duration-500 ease-(--ease-mech)", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-8 pl-[calc(2.75rem+1.25rem)] text-[16px] leading-relaxed text-mute sm:pl-[calc(2.75rem+2rem)]">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
