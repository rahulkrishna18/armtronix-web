"use client";

import { loadExplodedScene, useSceneElement } from "@/components/three/preload";
import Link from "next/link";
import { useRef, useState } from "react";
import { ENGINEERING_LAYERS } from "@/content/home";
import { getDivision } from "@/content/divisions";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ScenePoster } from "@/components/three/ScenePoster";
import { LabelLayer, LabelNode, useLabelRegistry } from "@/components/three/labelRegistry";
import { TechLabel } from "@/components/ui/TechLabel";
import { useIsDesktop } from "@/lib/hooks";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";


const N = ENGINEERING_LAYERS.length;
const activeAt = (p: number) => (p < 0.2 ? -1 : p >= 0.86 ? N : Math.min(N - 1, Math.floor(((p - 0.2) / 0.66) * N)));
const PHASES = ["Assembled", "Exploded view", "Operational"];

export function EngineeringSystems() {
  const engineering = getDivision("engineering");
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(-1);
  const desktop = useIsDesktop();
  const labels = useLabelRegistry();
  const layer = active >= 0 && active < N ? ENGINEERING_LAYERS[active] : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        progress.current = 0.6;
        setActive(activeAt(0.6));
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress;
            if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
            setActive(activeAt(self.progress));
          },
        });
      });
    },
    { scope: root },
  );

  const phase = active < 0 ? 0 : active >= N ? 2 : 1;

  const scene = useSceneElement(loadExplodedScene, { progress, active, compact: !desktop, labels });

  return (
    <section ref={root} id="engineering-systems" data-section="04" aria-labelledby="eng-title" className="relative border-t border-steel/70 motion-safe:h-[420svh]">
      <div className="sticky top-0 flex min-h-[100svh] flex-col overflow-hidden pt-(--header-h) motion-safe:h-[100svh]">
        <div className="container-x relative grid h-full flex-1 gap-4 py-6 lg:grid-cols-12 lg:gap-10 lg:py-10">
          {/* Copy + layer index */}
          <div className="relative z-10 flex flex-col lg:col-span-4">
            <TechLabel index="04">Engineering systems</TechLabel>
            <h2 id="eng-title" className="display mt-4 text-[clamp(1.7rem,2.9vw,2.8rem)] lg:mt-6">
              {engineering.approach.title[0]}
              <span className="block text-mute">{engineering.approach.title[1]}</span>
            </h2>
            <p className="mt-4 hidden max-w-sm text-[15px] leading-relaxed text-mute lg:block">{engineering.approach.items[0].body}</p>

            <ol className="mt-8 hidden border-t border-steel/70 lg:block">
              {ENGINEERING_LAYERS.map((l, i) => {
                const on = active === i || active === N;
                return (
                  <li key={l.id} className="flex items-center gap-4 border-b border-steel/70 py-2.5">
                    <span className="w-6 font-mono text-[10.5px]" style={{ color: on ? l.color : "var(--color-dim)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("flex-1 text-[14px] transition-colors duration-300", active === i ? "text-white" : on ? "text-white/80" : "text-dim")}>{l.label}</span>
                    <span className={cn("font-mono text-[10px] tracking-[0.06em] transition-opacity duration-300", active === i ? "text-mute opacity-100" : "opacity-0")}>{l.system}</span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-auto hidden items-center justify-between pt-6 lg:flex">
              <span className="tech-label text-[10px] text-dim">Credential · {engineering.credential}</span>
              <Link href="/engineering" className="tech-label text-[10px] text-white transition-colors hover:text-cyan">
                Engineering division →
              </Link>
            </div>
          </div>

          {/* Exploded 3D module */}
          <div className="relative min-h-0 flex-1 lg:col-span-8">
            <SceneCanvas
            loaded={scene !== null}
              label="Exploded 3D view of an operational module: structure, power, cooling, mechanical, automation, connectivity and monitoring systems separate and recombine."
              camera={{ fov: 34, position: [11.4, 8.4, 15], near: 0.1, far: 80 }}
              className="absolute inset-0"
              fallback={<ScenePoster label="Engineering systems" />}
            >
              {scene}
            </SceneCanvas>
            {desktop && (
              <LabelLayer>
                <LabelNode registry={labels} id="active-layer">
                  <div className="flex -translate-y-1/2 items-center gap-2 whitespace-nowrap">
                    <span className="h-px w-10" style={{ background: layer?.color }} />
                    <div className="border border-steel-2/80 bg-ink/85 px-3 py-2 backdrop-blur-sm">
                      <div className="font-mono text-[9.5px] tracking-[0.14em] text-dim">SYS.{String((layer ? active : 0) + 1).padStart(2, "0")}</div>
                      <div className="font-mono text-[12px] uppercase tracking-[0.08em]" style={{ color: layer?.color }}>
                        {layer?.label}
                      </div>
                      <div className="mt-0.5 text-[11px] text-mute">{layer?.system}</div>
                    </div>
                  </div>
                </LabelNode>
              </LabelLayer>
            )}

            {/* Phase readout */}
            <div className="pointer-events-none absolute right-0 top-0 flex items-center gap-3">
              {PHASES.map((p, i) => (
                <span key={p} className={cn("tech-label text-[9.5px] transition-colors duration-300", phase === i ? (i === 2 ? "text-green" : "text-cyan") : "text-dim")}>
                  {i > 0 && <span className="mr-3 text-steel-2">→</span>}
                  {p}
                </span>
              ))}
            </div>
            <span aria-hidden className="absolute bottom-0 right-0 top-8 hidden w-px bg-steel lg:block">
              <span ref={bar} className="absolute inset-0 origin-top scale-y-0 bg-cyan" />
            </span>

            {/* Mobile active-layer card */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 lg:hidden">
              <div className="border border-steel/80 bg-ink/85 px-4 py-3 backdrop-blur-sm">
                {active >= 0 && active < N ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: ENGINEERING_LAYERS[active].color }}>
                        {String(active + 1).padStart(2, "0")} · {ENGINEERING_LAYERS[active].label}
                      </span>
                      <span className="font-mono text-[10px] text-dim">
                        {active + 1}/{N}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-mute">{ENGINEERING_LAYERS[active].note}</p>
                  </>
                ) : (
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
                    {active >= N ? <span className="text-green">All systems combined · operational</span> : "Scroll to separate the systems"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
