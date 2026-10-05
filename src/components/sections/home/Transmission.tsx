"use client";

import { loadTransmissionScene, useSceneElement } from "@/components/three/preload";
import Link from "next/link";
import { useState } from "react";
import { TRANSMISSION_FLOWS } from "@/content/home";
import { getDivision } from "@/content/divisions";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ScenePoster } from "@/components/three/ScenePoster";
import { TRANSMISSION_LABELS } from "@/components/three/sceneLabels";
import { LabelLayer, LabelNode, useLabelRegistry } from "@/components/three/labelRegistry";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { useIsDesktop } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { FlowId } from "@/components/three/TransmissionScene";


export function Transmission() {
  const division = getDivision("transmission");
  const desktop = useIsDesktop();
  const [focus, setFocus] = useState<FlowId | null>(null);
  const [pinned, setPinned] = useState<FlowId | null>(null);
  const current = focus ?? pinned;
  const labels = useLabelRegistry();

  const scene = useSceneElement(loadTransmissionScene, { focus: current, compact: !desktop, labels });

  return (
    <section id="transmission" data-section="05" aria-labelledby="transmission-title" className="relative border-t border-steel/70 pt-24 lg:pt-36">
      <div className="container-x">
        <SectionHeader
          index="05"
          label="Transmission · Power + data"
          title={
            <span id="transmission-title">
              {division.hero.title[0]}
              <span className="block text-mute">{division.hero.title[1]}.</span>
            </span>
          }
          body={division.approach.items[0].body}
        />
      </div>

      <div className="relative mt-12 lg:mt-16">
        <div className="relative h-[62svh] min-h-[420px] lg:h-[78svh] lg:min-h-[560px]">
          <SceneCanvas
            loaded={scene !== null}
            label="3D infrastructure landscape: power flows from the national grid over transmission towers into a facility, data flows through buried fibre to telecom and carrier networks, and sensors stream readings into an intelligence layer."
            camera={{ fov: 34, position: [3, 9.5, 24], near: 0.1, far: 120 }}
            className="absolute inset-0"
            fallback={<ScenePoster label="Transmission network" />}
          >
            {scene}
          </SceneCanvas>
          {desktop && (
            <LabelLayer>
              {TRANSMISSION_LABELS.map((l) => (
                <LabelNode key={l.id} registry={labels} id={l.id}>
                  <div className="-translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center">
                    <div className="font-mono text-[9.5px] tracking-[0.16em]" style={{ color: l.color }}>
                      {l.title}
                    </div>
                    {l.sub && <div className="font-mono text-[9px] tracking-[0.08em] text-dim">{l.sub}</div>}
                  </div>
                </LabelNode>
              ))}
            </LabelLayer>
          )}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        </div>

        {/* Flow selectors */}
        <div className="container-x relative -mt-24 lg:-mt-28">
          <div role="group" aria-label="Highlight a flow" className="grid gap-px border border-steel/70 bg-steel/70 md:grid-cols-3">
            {TRANSMISSION_FLOWS.map((f) => {
              const on = current === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={pinned === f.id}
                  onMouseEnter={() => setFocus(f.id)}
                  onMouseLeave={() => setFocus(null)}
                  onFocus={() => setFocus(f.id)}
                  onBlur={() => setFocus(null)}
                  onClick={() => setPinned((p) => (p === f.id ? null : f.id))}
                  className={cn("group relative bg-ink/90 px-5 py-5 text-left backdrop-blur-md transition-colors sm:px-6", on ? "bg-graphite/95" : "hover:bg-graphite/90")}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left transition-transform duration-500" style={{ background: f.color, transform: `scaleX(${on ? 1 : 0})` }} />
                  <span className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em]">
                    <span style={{ color: f.color }}>{f.from}</span>
                    <svg viewBox="0 0 40 8" className="h-2 w-10" aria-hidden>
                      <path d="M0 4 H36 M32 1 L36 4 L32 7" fill="none" stroke={f.color} strokeWidth="1.2" strokeDasharray={on ? "4 3" : "0"} className={on ? "motion-safe:animate-[dash_0.8s_linear_infinite]" : ""} />
                    </svg>
                    <span className="text-white">{f.to}</span>
                  </span>
                  <span className="mt-2.5 block text-[14px] leading-relaxed text-mute">{f.body}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[10.5px] tracking-[0.08em] text-dim">Hover or select a flow to isolate it in the model.</p>
        </div>
      </div>

      {/* Verified delivery spec table */}
      <div className="container-x py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="tech-label text-dim">What we deliver</p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mute">{division.about}</p>
            <Link href="/transmission" className="group mt-8 inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-cyan">
              Transmission division
              <span aria-hidden className="h-px w-8 bg-current transition-[width] duration-500 group-hover:w-12" />
            </Link>
          </div>
          <ul className="border-t border-steel/70 lg:col-span-8">
            {division.deliver.map((d, i) => (
              <Reveal as="li" key={d.title} delay={i * 50} className="grid grid-cols-[2rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-steel/70 py-4 sm:grid-cols-[2.5rem_1fr_auto]">
                <span className="font-mono text-[11px] text-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15.5px] text-white/90">{d.title}</span>
                {d.stat && <span className="col-start-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-cyan sm:col-start-3">{d.stat}</span>}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
