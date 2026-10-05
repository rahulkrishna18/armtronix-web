"use client";

import { loadNetworkScene, useSceneElement } from "@/components/three/preload";
import Link from "next/link";
import { useState } from "react";
import { TECH_CAPABILITIES, type TechCapabilityId } from "@/content/home";
import { getDivision } from "@/content/divisions";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ScenePoster } from "@/components/three/ScenePoster";
import { NETWORK_NODES } from "@/components/three/sceneLabels";
import { LabelLayer, LabelNode, useLabelRegistry } from "@/components/three/labelRegistry";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useIsDesktop } from "@/lib/hooks";
import { cn } from "@/lib/cn";


const TIERS = ["", "Physical → sensor", "Edge · control", "Intelligence layer"];

export function Technologies() {
  const division = getDivision("technologies");
  const desktop = useIsDesktop();
  const [hover, setHover] = useState<TechCapabilityId | null>(null);
  const [selected, setSelected] = useState<TechCapabilityId | null>(null);
  const focus = hover ?? selected;
  const shown = TECH_CAPABILITIES.find((c) => c.id === focus);
  const labels = useLabelRegistry();

  const scene = useSceneElement(loadNetworkScene, { focus, compact: !desktop, labels });

  return (
    <section id="technologies" data-section="06" aria-labelledby="tech-title" className="relative border-t border-steel/70 py-24 lg:py-36">
      <div className="container-x">
        <SectionHeader
          index="06"
          label="Armtronix Technologies"
          title={
            <span id="tech-title">
              {division.approach.title[0]}
              <span className="block text-mute">{division.approach.title[1]}</span>
            </span>
          }
          body={division.hero.body}
        />

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-4">
            <p className="tech-label text-dim">Capabilities · select to trace</p>
            <ul className="mt-5 border-t border-steel/70" role="list">
              {TECH_CAPABILITIES.map((c, i) => {
                const on = focus === c.id;
                return (
                  <li key={c.id} className="border-b border-steel/70">
                    <button
                      type="button"
                      aria-pressed={selected === c.id}
                      onMouseEnter={() => setHover(c.id)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(c.id)}
                      onBlur={() => setHover(null)}
                      onClick={() => setSelected((s) => (s === c.id ? null : c.id))}
                      className="group flex w-full items-center gap-4 py-3.5 text-left"
                    >
                      <span className={cn("font-mono text-[10.5px] transition-colors", on ? "text-cyan" : "text-dim")}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={cn("flex-1 text-[16px] transition-colors", on ? "text-white" : "text-white/70 group-hover:text-white")}>{c.label}</span>
                      <span aria-hidden className={cn("h-px bg-cyan transition-[width] duration-500", on ? "w-10" : "w-0")} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 min-h-[112px] border border-steel/70 bg-graphite/50 p-5" aria-live="polite">
              {shown ? (
                <>
                  <p className="tech-label text-[10px] text-cyan">
                    {shown.source} · {TIERS[shown.tier]}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/85">{shown.body}</p>
                </>
              ) : (
                <>
                  <p className="tech-label text-[10px] text-dim">Closed-loop intelligence</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">
                    Physical assets stream data upward through sensors and edge controllers; automation sends decisions back down — the loop that makes infrastructure intelligent.
                  </p>
                </>
              )}
            </div>
            <Link href="/technologies" className="group mt-8 inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-cyan">
              Technologies division
              <span aria-hidden className="h-px w-8 bg-current transition-[width] duration-500 group-hover:w-12" />
            </Link>
          </div>

          <div className="relative order-1 h-[56svh] min-h-[380px] border border-steel/70 bg-graphite/30 lg:order-2 lg:col-span-8 lg:h-auto lg:min-h-[640px]">
            <SceneCanvas
            loaded={scene !== null}
              label="3D network: physical assets feed sensors, sensors feed edge gateways, gateways feed an intelligence platform with monitoring, analytics, automation, cloud and security; automation commands flow back down to the assets."
              camera={{ fov: 32, position: [9, 8, 11.5], near: 0.1, far: 80 }}
              className="absolute inset-0"
              fallback={<ScenePoster label="Intelligence network" />}
            >
              {scene}
            </SceneCanvas>
            {desktop && (
              <LabelLayer>
                {NETWORK_NODES.map((n) => (
                  <LabelNode key={n.id} registry={labels} id={n.id}>
                    <div className="-translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/90">{n.label}</div>
                  </LabelNode>
                ))}
              </LabelLayer>
            )}
            <div className="pointer-events-none absolute left-4 top-4 grid gap-1.5 font-mono text-[10px] tracking-[0.1em] text-mute sm:left-5 sm:top-5">
              <span className="flex items-center gap-2">
                <span className="size-1.5 bg-cyan" /> Data up · sensors → intelligence
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 bg-green" /> Commands down · automation → assets
              </span>
            </div>
            <span className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] tracking-[0.12em] text-dim sm:bottom-5 sm:right-5">
              T0 Assets · T1 Sensors · T2 Edge · T3 Intelligence
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
