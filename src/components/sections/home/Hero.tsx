"use client";

import { loadHeroScene, useSceneElement } from "@/components/three/preload";
import { useRef } from "react";
import { SITE } from "@/content/site";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ScenePoster } from "@/components/three/ScenePoster";
import { BOOT_STAGES, useBoot } from "@/components/three/bootStore";
import { HERO_LABELS } from "@/components/three/sceneLabels";
import { LabelLayer, LabelNode, useLabelRegistry } from "@/components/three/labelRegistry";
import { CircuitButton } from "@/components/ui/CircuitButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { StatusDot } from "@/components/ui/StatusDot";
import { Ruler } from "@/components/ui/Ruler";
import { useIsDesktop } from "@/lib/hooks";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";


export function Hero() {
  const desktop = useIsDesktop();
  const stage = useBoot((s) => s.stage);
  const online = stage >= BOOT_STAGES.length;
  const root = useRef<HTMLElement>(null);
  const labels = useLabelRegistry();

  // Headline assembles line by line — mechanical, not floaty.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-line]", { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.15 });
        gsap.from("[data-hero-fade]", { opacity: 0, y: 16, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.55 });
      });
    },
    { scope: root },
  );

  const scene = useSceneElement(loadHeroScene, { compact: !desktop, shift: desktop ? 0.2 : 0, labels });

  return (
    <section ref={root} id="top" data-section="00" aria-labelledby="hero-title" className="relative isolate overflow-hidden lg:min-h-[max(100svh,760px)]">
      {/* Desktop legibility gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] hidden bg-[linear-gradient(180deg,var(--color-ink)_0%,transparent_22%,transparent_70%,var(--color-ink)_100%)] lg:block" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] hidden bg-[linear-gradient(90deg,var(--color-ink)_0%,color-mix(in_srgb,var(--color-ink)_75%,transparent)_30%,transparent_58%)] lg:block" />

      {/* HUD frame */}
      <div aria-hidden className="pointer-events-none absolute inset-x-(--gutter) bottom-6 top-[calc(var(--header-h)+16px)] hidden lg:block">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-steel-2" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-steel-2" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-steel-2" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-steel-2" />
        <Ruler ticks={80} major={10} className="absolute inset-x-16 bottom-0 opacity-50" />
      </div>

      <div className="container-x relative pt-[calc(var(--header-h)+36px)] lg:flex lg:min-h-[max(100svh,760px)] lg:flex-col lg:justify-center lg:pb-24 lg:pt-[calc(var(--header-h)+24px)]">
        <div className="max-w-[44rem]">
          <div data-hero-fade className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="tech-label text-cyan">Armtronix Group</span>
            <span aria-hidden className="tech-label text-dim">·</span>
            <span className="tech-label text-mute">{SITE.tagline}</span>
          </div>

          <h1 id="hero-title" className="display mt-6 text-[clamp(2.4rem,10.4vw,4.4rem)] lg:text-[clamp(3.6rem,5.4vw,6rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block">
                Bridging Physical
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-line className="block">
                Foundations <span className="text-mute">and</span>
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span
                data-hero-line
                className={cn(
                  "block transition-[color,-webkit-text-stroke-color] duration-[1600ms] [-webkit-text-stroke:1px_var(--color-cyan)]",
                  online ? "text-white [-webkit-text-stroke-color:transparent]" : "text-transparent",
                )}
              >
                Digital Frontiers.
              </span>
            </span>
          </h1>

          <p data-hero-fade className="mt-7 max-w-[34rem] text-[15.5px] leading-relaxed text-mute sm:text-[17px]">
            {SITE.heroBody}
          </p>

          <div data-hero-fade className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <Magnetic className="block xs:inline-block">
              <CircuitButton href="#ecosystem" size="lg" className="w-full xs:w-auto">
                Explore Our Ecosystem
              </CircuitButton>
            </Magnetic>
            <CircuitButton href="/contact" variant="ghost" size="lg" className="w-full xs:w-auto">
              Start Your Project
            </CircuitButton>
          </div>
        </div>
      </div>

      {/* 3D facility: its own band on mobile, full-bleed backdrop on desktop */}
      <div className="relative -mt-2 h-[min(68svh,560px)] min-h-[400px] lg:absolute lg:inset-0 lg:-z-10 lg:mt-0 lg:h-auto lg:min-h-0">
        <SceneCanvas
            loaded={scene !== null}
          eager
          label="Animated 3D model of an intelligent facility: the physical structure is built, power and cooling energise, network paths link, sensors come online and data flows into an intelligence layer."
          camera={{ fov: 34, near: 0.1, far: 120, position: [18, 10, 15] }}
          className="absolute inset-0"
          fallback={<ScenePoster />}
        >
          {scene}
        </SceneCanvas>
        {desktop && (
          <LabelLayer>
            {HERO_LABELS.map((l) => (
              <LabelNode key={l.id} registry={labels} id={l.id}>
                {/* Stem ends in a dot centred exactly on the anchored object. */}
                <div className="flex -translate-x-1/2 translate-y-[calc(-100%+3px)] flex-col items-center whitespace-nowrap">
                  <div className="border border-steel-2/80 bg-ink/80 px-2.5 py-1.5 backdrop-blur-sm">
                    <div className="font-mono text-[9px] tracking-[0.14em] text-mute">{l.code}</div>
                    <div className="font-mono text-[11px] tracking-[0.04em]" style={{ color: l.tone }}>
                      {l.value}
                    </div>
                  </div>
                  <div className="h-10 w-px" style={{ background: `linear-gradient(to bottom, ${l.tone}, ${l.tone}66)` }} />
                  <div className="size-1.5 rounded-full" style={{ background: l.tone, boxShadow: `0 0 0 3px ${l.tone}26` }} />
                </div>
              </LabelNode>
            ))}
          </LabelLayer>
        )}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent lg:hidden" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent lg:hidden" />
      </div>

      {/* Full-width row is click-through so it never covers the hero CTAs; only the panel takes input. */}
      <div className="pointer-events-none absolute inset-x-(--gutter) bottom-5 flex items-end justify-end gap-6 lg:bottom-12 lg:px-10">
        <BootPanel stage={stage} />
      </div>
    </section>
  );
}

function BootPanel({ stage }: { stage: number }) {
  const replay = useBoot((s) => s.replay);
  const total = BOOT_STAGES.length;
  const done = stage >= total;

  return (
    <div data-hero-fade className="pointer-events-auto w-full border border-steel/80 bg-ink/70 backdrop-blur-md sm:max-w-[340px] lg:w-[340px]">
      <div className="flex items-center justify-between border-b border-steel/80 px-4 py-2.5">
        <span className="tech-label text-[10px] text-mute">Sys.boot · ATX-01</span>
        <span className="tech-label flex items-center gap-2 text-[10px]">
          <StatusDot tone={done ? "green" : "cyan"} />
          <span className={done ? "text-green" : "text-cyan"}>{done ? "Operational" : "Booting"}</span>
        </span>
      </div>
      <span className="sr-only" aria-live="polite">
        {done ? "Facility boot sequence complete: all systems operational." : ""}
      </span>
      <ol className="hidden px-4 py-3 lg:block">
        {BOOT_STAGES.map((s, i) => {
          const state = stage > i ? "done" : stage === i ? "active" : "pending";
          return (
            <li key={s.id} className="flex items-center gap-3 py-[3px] font-mono text-[11px]">
              <span className="w-5 text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("flex-1 transition-colors", state === "pending" ? "text-dim" : "text-white/90")}>{s.label}</span>
              <span
                className={cn(
                  "tracking-[0.08em] transition-colors",
                  state === "done" && "text-green",
                  state === "active" && "text-cyan",
                  state === "pending" && "text-dim/70",
                )}
              >
                {state === "done" ? s.status : state === "active" ? "···" : "Standby"}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-3 border-t border-steel/80 px-4 py-2.5">
        <div className="flex flex-1 gap-1" aria-hidden>
          {BOOT_STAGES.map((s, i) => (
            <span key={s.id} className={cn("h-1 flex-1 transition-colors duration-500", stage > i ? "bg-green" : stage === i ? "bg-cyan" : "bg-steel")} />
          ))}
        </div>
        {!done && (
          <span className="font-mono text-[10px] text-dim lg:hidden">{stage >= 0 ? BOOT_STAGES[Math.min(stage, total - 1)].label : "Standby"}</span>
        )}
        <button
          type="button"
          onClick={replay}
          className="tech-label text-[10px] text-mute transition-colors hover:text-cyan"
          aria-label="Replay the boot sequence"
        >
          ↻ Replay
        </button>
      </div>
      <p className="border-t border-steel/80 px-4 py-2 font-mono text-[9.5px] tracking-[0.1em] text-dim">SIMULATED SEQUENCE · UI DEMONSTRATION</p>
    </div>
  );
}
