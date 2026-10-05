"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { DeliverItem } from "@/content/divisions";
import { Brackets } from "@/components/ui/Brackets";
import { cn } from "@/lib/cn";

/** Interactive "What we deliver" spec console. */
export function DeliverConsole({ items, code }: { items: DeliverItem[]; code: string }) {
  const [active, setActive] = useState(0);
  const item = items[active];

  return (
    <div className="grid gap-px border border-steel bg-steel lg:grid-cols-12">
      <div role="tablist" aria-label="Deliverables" aria-orientation="vertical" className="bg-ink lg:col-span-5">
        {items.map((d, i) => (
          <button
            key={d.title}
            role="tab"
            id={`deliver-tab-${i}`}
            aria-selected={active === i}
            aria-controls="deliver-panel"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            className={cn(
              "group relative flex w-full items-center gap-4 border-b border-steel/70 px-5 py-4 text-left transition-colors last:border-b-0 sm:px-6",
              active === i ? "bg-graphite" : "hover:bg-graphite/50",
            )}
          >
            <span aria-hidden className={cn("absolute left-0 top-0 h-full w-px bg-cyan transition-transform duration-500 origin-top", active === i ? "scale-y-100" : "scale-y-0")} />
            <span className={cn("font-mono text-[11px] transition-colors", active === i ? "text-cyan" : "text-dim")}>{String(i + 1).padStart(2, "0")}</span>
            <span className={cn("flex-1 text-[15.5px] transition-colors first-letter:uppercase", active === i ? "text-white" : "text-white/65 group-hover:text-white")}>{d.title}</span>
            <svg viewBox="0 0 16 16" className={cn("size-4 transition-all duration-300", active === i ? "translate-x-0 text-cyan opacity-100" : "-translate-x-1 opacity-0")} aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        ))}
      </div>

      <div id="deliver-panel" role="tabpanel" aria-labelledby={`deliver-tab-${active}`} aria-live="polite" className="relative min-h-[420px] overflow-hidden bg-graphite p-6 sm:p-10 lg:col-span-7">
        <div className="grid-lines-fine pointer-events-none absolute inset-0 opacity-40" />
        <Brackets className="m-4" />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full flex-col"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="tech-label text-cyan">{item.category}</span>
              <span className="font-mono text-[10.5px] tracking-[0.14em] text-dim">
                {code}.{String(active + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="display mt-6 text-[clamp(1.6rem,3vw,2.5rem)] first-letter:uppercase">{item.title}</h3>

            <dl className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <dt className="tech-label text-[10px] text-dim">Challenge</dt>
                <dd className="mt-3 text-[15.5px] leading-relaxed text-white/85">{item.challenge}</dd>
              </div>
              <div>
                <dt className="tech-label text-[10px] text-dim">Outcome</dt>
                <dd className="mt-3 text-[15.5px] leading-relaxed text-white/85">{item.outcome}</dd>
              </div>
            </dl>

            <div className="mt-auto flex items-end justify-between gap-6 pt-12">
              {item.stat ? (
                <div>
                  <p className="tech-label text-[10px] text-dim">Specification</p>
                  <p className="display mt-2 text-[clamp(2rem,4vw,3.4rem)] text-cyan">{item.stat}</p>
                </div>
              ) : (
                <span />
              )}
              <div className="flex gap-1" aria-hidden>
                {items.map((_, i) => (
                  <span key={i} className={cn("h-1 w-5 transition-colors", i === active ? "bg-cyan" : i < active ? "bg-cyan/40" : "bg-steel")} />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
