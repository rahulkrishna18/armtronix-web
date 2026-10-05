"use client";

import { useState } from "react";
import { INDUSTRIES } from "@/content/home";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Brackets } from "@/components/ui/Brackets";
import { cn } from "@/lib/cn";
import { IndustryScene } from "./IndustryScenes";

export function Industries() {
  const [active, setActive] = useState(0);

  return (
    <section id="industries" data-section="07" aria-labelledby="industries-title" className="relative border-t border-steel/70 py-24 lg:py-36">
      <div className="container-x">
        <SectionHeader
          index="07"
          label="Mission-critical infrastructure"
          title={
            <span id="industries-title">
              Industries we power.
              <span className="block text-mute">Engineered environments.</span>
            </span>
          }
          body="Mission-critical infrastructure solutions across modern industries — from hyperscale compute and national grids to sovereign, high-security facilities."
        />

        {/* Desktop: expanding environments */}
        <ul className="mt-14 hidden h-[580px] gap-2 lg:mt-20 lg:flex" role="list">
          {INDUSTRIES.map((ind, i) => {
            const on = active === i;
            return (
              <li
                key={ind.id}
                data-active={on}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "group relative min-w-0 overflow-hidden border bg-graphite/40 transition-[flex-grow,border-color,background-color] duration-700 ease-(--ease-mech)",
                  on ? "grow-[3.4] border-steel-2 bg-graphite/80" : "grow border-steel/70",
                )}
                style={{ flexBasis: 0 }}
              >
                <button
                  type="button"
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-expanded={on}
                  aria-label={ind.name}
                  className="absolute inset-0 z-10 cursor-default focus-visible:outline-offset-[-3px]"
                />
                <IndustryScene id={ind.id} className={cn("absolute inset-0 size-full transition-[opacity,transform] duration-700 ease-(--ease-mech)", on ? "scale-100 opacity-100" : "scale-[1.04] opacity-40")} />
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className={cn("font-mono text-[10.5px] tracking-[0.14em] transition-colors", on ? "text-cyan" : "text-dim")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[10.5px] tracking-[0.14em] text-dim">{ind.code}</span>
                </div>
                {/* Collapsed: vertical title */}
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[14px] font-medium uppercase tracking-[0.14em] text-white/70 transition-opacity duration-300 [writing-mode:vertical-rl] rotate-180",
                    on ? "opacity-0" : "opacity-100",
                  )}
                >
                  {ind.name}
                </span>
                {/* Expanded: detail */}
                <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 p-6 transition-[opacity,transform] duration-500", on ? "translate-y-0 opacity-100 delay-200" : "translate-y-3 opacity-0")}>
                  <h3 className="display text-[30px] font-wide leading-none">{ind.name}</h3>
                  <ul className="mt-4 grid gap-1.5">
                    {ind.tags.map((t) => (
                      <li key={t} className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.06em] text-mute">
                        <span className="size-1 bg-cyan" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                {on && <Brackets className="m-2" tone="border-cyan/60" />}
              </li>
            );
          })}
        </ul>

        {/* Mobile / tablet: environment cards */}
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:hidden" role="list">
          {INDUSTRIES.map((ind, i) => (
            <li key={ind.id} data-active="true" className="relative h-[300px] overflow-hidden border border-steel/70 bg-graphite/50">
              <IndustryScene id={ind.id} className="absolute inset-0 size-full opacity-70" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex justify-between p-4 font-mono text-[10.5px] tracking-[0.14em]">
                <span className="text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-dim">{ind.code}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="display text-[24px] font-wide leading-none">{ind.name}</h3>
                <p className="mt-3 font-mono text-[10.5px] leading-relaxed tracking-[0.04em] text-mute">{ind.tags.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
