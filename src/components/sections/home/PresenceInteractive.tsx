"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Region = { id: string; country: string; entity: string; role: string; sites: readonly string[] };

/** Region list that highlights its country on the (server-rendered) dot map. */
export function PresenceInteractive({ regions, map }: { regions: readonly Region[]; map: ReactNode }) {
  const [active, setActive] = useState<string>("my");
  return (
    <div data-region={active} className="presence mt-14 grid items-center gap-10 lg:mt-20 lg:grid-cols-12">
      <ul className="order-2 grid gap-px border border-steel/70 bg-steel/70 lg:order-1 lg:col-span-5">
        {regions.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onMouseEnter={() => setActive(r.id)}
              onFocus={() => setActive(r.id)}
              onClick={() => setActive(r.id)}
              aria-pressed={active === r.id}
              className={cn("block w-full bg-ink p-6 text-left transition-colors", active === r.id ? "bg-graphite" : "hover:bg-graphite/60")}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-[20px] font-medium font-wide">{r.country}</span>
                <span className={cn("font-mono text-[10.5px] tracking-[0.12em] transition-colors", active === r.id ? "text-cyan" : "text-dim")}>{r.entity}</span>
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-mute">{r.role}</p>
              {r.sites.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {r.sites.map((s) => (
                    <li key={s} className="border border-steel-2/70 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em] text-white/80">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="order-1 lg:order-2 lg:col-span-7">{map}</div>
    </div>
  );
}
