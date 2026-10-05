"use client";

import { useEffect, useRef, useState } from "react";
import { LIFECYCLE } from "@/content/home";
import { DIVISIONS } from "@/content/divisions";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const TRACKS = [
  { id: "lifecycle", label: "Integrated lifecycle", intro: LIFECYCLE.intro, steps: LIFECYCLE.steps, closing: ["No fragmented infrastructure delivery.", "Everything operates as one coordinated ecosystem."] as const },
  ...DIVISIONS.map((d) => ({ id: d.slug, label: d.name, intro: d.process.intro, steps: d.process.steps, closing: d.process.closing })),
];

export function ProcessFlow({ trackIds, index = "08", compact = false }: { trackIds?: string[]; index?: string; compact?: boolean }) {
  const tracks = trackIds ? TRACKS.filter((t) => trackIds.includes(t.id)) : TRACKS;
  const [tab, setTab] = useState(0);
  const track = tracks[tab];
  const n = track.steps.length;
  const root = useRef<HTMLDivElement>(null);
  const scrollCharge = useRef(0);
  const sweep = useRef({ v: 1 });
  const [charge, setCharge] = useState(0);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 75%",
        end: "bottom 55%",
        scrub: true,
        onUpdate: (self) => {
          scrollCharge.current = self.progress;
          setCharge(Math.min(self.progress, sweep.current.v));
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  // Re-energise the circuit when switching tracks.
  useEffect(() => {
    if (reduced) return;
    const s = sweep.current;
    s.v = 0;
    const tween = gsap.to(s, {
      v: 1,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => setCharge(Math.min(scrollCharge.current, s.v)),
    });
    return () => {
      tween.kill();
    };
  }, [tab, reduced]);

  const level = reduced ? n + 1 : charge * (n + 1);
  const online = level >= n + 0.5;

  return (
    <div ref={root}>
      {!compact && (
        <SectionHeader
          index={index}
          label="How the system works"
          title={
            <>
              Every system,
              <span className="block text-mute">brought online.</span>
            </>
          }
          body={track.intro}
        />
      )}

      <div role="tablist" aria-label="Delivery framework" className={cn("flex flex-wrap gap-2", compact ? "" : "mt-12 lg:mt-16")}>
        {tracks.length > 1 &&
          tracks.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === i}
              aria-controls="process-panel"
              onClick={() => setTab(i)}
              className={cn(
                "border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
                tab === i ? "border-cyan bg-cyan/10 text-cyan" : "border-steel-2/70 text-mute hover:border-steel-2 hover:text-white",
              )}
            >
              {t.label}
            </button>
          ))}
      </div>

      <div id="process-panel" role="tabpanel" aria-labelledby={`tab-${track.id}`} className="relative mt-10">
        {/* Desktop: horizontal circuit */}
        <ol className="relative hidden lg:grid" style={{ gridTemplateColumns: `repeat(${n + 1}, minmax(0, 1fr))` }}>
          <span aria-hidden className="absolute left-0 right-0 top-[27px] h-px bg-steel" />
          <span aria-hidden className="absolute left-0 top-[27px] h-px bg-gradient-to-r from-cyan via-cyan to-green transition-[width] duration-200" style={{ width: `${Math.min(1, level / (n + 0.5)) * 100}%` }} />
          {track.steps.map((step, i) => {
            const state = level >= i + 1 ? "online" : level >= i + 0.35 ? "init" : "standby";
            return <Node key={`${track.id}-${step}`} index={i} label={step} state={state} />;
          })}
          <li className="relative pr-4">
            <div className={cn("relative z-10 flex size-14 items-center justify-center border transition-colors duration-500", online ? "border-green bg-[color-mix(in_srgb,var(--color-green)_12%,var(--color-ink))]" : "border-steel bg-ink")}>
              <span className={cn("size-2.5 rounded-full transition-colors", online ? "bg-green shadow-[0_0_14px_var(--color-green)]" : "bg-steel-2")} />
            </div>
            <p className={cn("mt-5 text-[15px] font-medium uppercase tracking-[0.1em] transition-colors", online ? "text-green" : "text-dim")}>Operational</p>
            <p className="mt-1 font-mono text-[10.5px] tracking-[0.1em] text-dim">{online ? "SYSTEM ONLINE" : "AWAITING"}</p>
          </li>
        </ol>

        {/* Mobile: vertical circuit */}
        <ol className="relative grid gap-6 pl-2 lg:hidden">
          <span aria-hidden className="absolute bottom-6 left-[29px] top-6 w-px bg-steel" />
          <span aria-hidden className="absolute left-[29px] top-6 w-px bg-gradient-to-b from-cyan to-green" style={{ height: `calc(${Math.min(1, level / (n + 0.5)) * 100}% - 48px)` }} />
          {track.steps.map((step, i) => {
            const state = level >= i + 1 ? "online" : level >= i + 0.35 ? "init" : "standby";
            return (
              <li key={`${track.id}-${step}-m`} className="relative flex items-center gap-5">
                <span className={cn("relative z-10 flex size-11 shrink-0 items-center justify-center border font-mono text-[11px] transition-colors", state === "online" ? "border-cyan bg-[color-mix(in_srgb,var(--color-cyan)_12%,var(--color-ink))] text-cyan" : state === "init" ? "border-cyan/50 bg-ink text-cyan/70" : "border-steel bg-ink text-dim")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className={cn("block text-[17px] font-medium uppercase tracking-[0.08em]", state === "standby" ? "text-dim" : "text-white")}>{step}</span>
                  <span className="font-mono text-[10px] tracking-[0.12em] text-dim">{state === "online" ? "ONLINE" : state === "init" ? "INITIALIZING" : "STANDBY"}</span>
                </span>
              </li>
            );
          })}
          <li className="relative flex items-center gap-5">
            <span className={cn("relative z-10 flex size-11 shrink-0 items-center justify-center border", online ? "border-green bg-[color-mix(in_srgb,var(--color-green)_12%,var(--color-ink))]" : "border-steel bg-ink")}>
              <span className={cn("size-2 rounded-full", online ? "bg-green" : "bg-steel-2")} />
            </span>
            <span className={cn("text-[17px] font-medium uppercase tracking-[0.08em]", online ? "text-green" : "text-dim")}>Operational</span>
          </li>
        </ol>

        <p className="mt-12 max-w-2xl text-[17px] leading-relaxed text-white/85 lg:mt-16">
          {track.closing[0]} <span className="text-mute">{track.closing[1]}</span>
        </p>
      </div>
    </div>
  );
}

function Node({ index, label, state }: { index: number; label: string; state: "online" | "init" | "standby" }) {
  return (
    <li className="relative pr-4">
      <div
        className={cn(
          "relative z-10 flex size-14 items-center justify-center border font-mono text-[12px] transition-colors duration-500",
          state === "online" ? "border-cyan bg-[color-mix(in_srgb,var(--color-cyan)_12%,var(--color-ink))] text-cyan" : state === "init" ? "border-cyan/50 bg-ink text-cyan/70" : "border-steel bg-ink text-dim",
        )}
      >
        {String(index + 1).padStart(2, "0")}
        {state === "init" && <span className="absolute -right-1 -top-1 size-2 animate-pulse rounded-full bg-cyan" />}
      </div>
      <p className={cn("mt-5 text-[15px] font-medium uppercase tracking-[0.1em] transition-colors duration-500", state === "standby" ? "text-dim" : "text-white")}>{label}</p>
      <p className="mt-1 font-mono text-[10.5px] tracking-[0.1em] text-dim">{state === "online" ? "ONLINE" : state === "init" ? "INITIALIZING" : "STANDBY"}</p>
    </li>
  );
}

export function Process() {
  return (
    <section id="process" data-section="08" aria-label="How the system works" className="relative border-t border-steel/70 py-24 lg:py-36">
      <div className="container-x">
        <ProcessFlow />
      </div>
    </section>
  );
}
