"use client";

import { loadEcosystemScene, useSceneElement } from "@/components/three/preload";
import { useRef } from "react";
import type { Division } from "@/content/divisions";
import { ECOSYSTEM_LAYERS } from "@/content/home";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ScenePoster } from "@/components/three/ScenePoster";
import { EcosystemLabels } from "@/components/three/EcosystemLabels";
import { useLabelRegistry } from "@/components/three/labelRegistry";
import { CircuitButton } from "@/components/ui/CircuitButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { Brackets } from "@/components/ui/Brackets";
import { StatusDot } from "@/components/ui/StatusDot";
import { useIsDesktop } from "@/lib/hooks";
import { gsap, useGSAP } from "@/lib/gsap";


export function DivisionHero({ division }: { division: Division }) {
  const desktop = useIsDesktop();
  const root = useRef<HTMLElement>(null);
  const labels = useLabelRegistry();
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-line]", { yPercent: 105, duration: 1.1, ease: "expo.out", stagger: 0.1, delay: 0.1 });
        gsap.from("[data-fade]", { opacity: 0, y: 14, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.45 });
      });
    },
    { scope: root },
  );

  const scene = useSceneElement(loadEcosystemScene, { active: -1, highlight: division.layers, compact: !desktop, labels });

  return (
    <section ref={root} aria-labelledby="division-title" className="relative overflow-hidden pt-[calc(var(--header-h)+48px)] pb-16 lg:pb-24">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 mask-fade-b" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6">
          <div data-fade className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[11px] tracking-[0.16em] text-cyan">{division.code}</span>
            <span aria-hidden className="tech-label text-dim">·</span>
            <span className="tech-label text-mute">{division.hero.eyebrow}</span>
            <span aria-hidden className="tech-label text-dim">·</span>
            <span className="tech-label text-dim">{division.pillar}</span>
          </div>
          <h1 id="division-title" className="display mt-7 text-[clamp(2.2rem,4.3vw,4.1rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">
                {division.hero.title[0]}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-line className="block text-mute">
                {division.hero.title[1]}
              </span>
            </span>
          </h1>
          <p data-fade className="mt-7 max-w-xl text-[16px] leading-relaxed text-mute sm:text-[17px]">
            {division.hero.body}
          </p>
          <div data-fade className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <Magnetic className="block xs:inline-block">
              <CircuitButton href={`/contact?division=${division.slug}`} size="lg" className="w-full xs:w-auto">
                {division.hero.cta}
              </CircuitButton>
            </Magnetic>
            <CircuitButton href="#deliver" variant="ghost" size="lg" className="w-full xs:w-auto">
              View Capability
            </CircuitButton>
          </div>
          {division.credential && (
            <p data-fade className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">
              <StatusDot tone="green" pulse={false} />
              {division.credential}
            </p>
          )}
        </div>

        <div data-fade className="relative h-[52svh] min-h-[360px] border border-steel/70 bg-graphite/40 lg:col-span-6 lg:h-[min(72svh,640px)]">
          <SceneCanvas
            loaded={scene !== null}
            eager
            label={`3D ecosystem stack highlighting where ${division.fullName} sits: ${division.layers.map((l) => ECOSYSTEM_LAYERS[l].label).join(" and ")}.`}
            camera={{ fov: 30, position: [13, 9.5, 15.5], near: 0.1, far: 80 }}
            className="absolute inset-0"
            fallback={<ScenePoster label="Ecosystem position" />}
          >
            {scene}
          </SceneCanvas>
          {desktop && <EcosystemLabels registry={labels} />}
          <Brackets className="m-3" />
          <div className="pointer-events-none absolute left-5 top-5">
            <p className="tech-label text-[10px] text-dim">Position in the ecosystem</p>
            <ul className="mt-2 grid gap-1">
              {division.layers.map((l) => (
                <li key={l} className="font-mono text-[11px] uppercase tracking-[0.12em] text-cyan">
                  L{l} · {ECOSYSTEM_LAYERS[l].label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
