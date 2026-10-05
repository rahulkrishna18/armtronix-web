"use client";

import { loadEcosystemScene, useSceneElement } from "@/components/three/preload";
import Link from "next/link";
import { useRef, useState } from "react";
import { ECOSYSTEM_LAYERS } from "@/content/home";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { ScenePoster } from "@/components/three/ScenePoster";
import { EcosystemLabels } from "@/components/three/EcosystemLabels";
import { useLabelRegistry } from "@/components/three/labelRegistry";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechLabel } from "@/components/ui/TechLabel";
import { useIsDesktop } from "@/lib/hooks";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/cn";


const LAYER_COLORS = ["#C9D6DC", "#E9F0F2", "#4DFF9A", "#168BFF", "#00C8E8"];

export function Ecosystem() {
  const desktop = useIsDesktop();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const labels = useLabelRegistry();
  const shown = hover ?? active;

  useGSAP(
    () => {
      const items = listItems(listRef.current);
      items.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: listRef },
  );

  const goTo = (i: number) => {
    const el = listRef.current?.children[i] as HTMLElement | undefined;
    if (!el) return;
    setActive(i);
    const lenis = getLenis();
    const offset = -window.innerHeight * 0.3;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
  };

  const scene = useSceneElement(loadEcosystemScene, { active: shown, onHover: setHover, onSelect: goTo, compact: !desktop, labels });

  return (
    <section id="ecosystem" data-section="01" aria-labelledby="ecosystem-title" className="relative scroll-mt-20 border-t border-steel/70 pt-24 lg:pt-36">
      <div className="container-x">
        <SectionHeader
          index="01"
          label="Armtronix ecosystem"
          title={
            <span id="ecosystem-title">
              One ecosystem.
              <span className="block text-mute">Integrated infrastructure.</span>
            </span>
          }
          body="The Armtronix Group operates as a unified force of physical, structural, and digital expertise, covering the complete lifecycle of modern infrastructure — four specialized divisions under centralized governance."
        />
      </div>

      <div className="container-x relative mt-14 grid lg:mt-20 lg:grid-cols-12 lg:gap-10">
        {/* Sticky 3D stack */}
        <div className="sticky top-(--header-h) z-10 -mx-(--gutter) h-[48svh] bg-ink lg:col-span-7 lg:mx-0 lg:h-[calc(100svh-var(--header-h))] lg:bg-transparent">
          <SceneCanvas
            loaded={scene !== null}
            label="Interactive 3D stack of the five infrastructure layers Armtronix delivers, from foundation to digital intelligence."
            camera={{ fov: 30, position: [10.5, 8.2, 12.5], near: 0.1, far: 80 }}
            className="absolute inset-0"
            fallback={<ScenePoster label="Ecosystem stack" />}
          >
            {scene}
          </SceneCanvas>
          {desktop && <EcosystemLabels registry={labels} />}

          {/* Vertical physical → digital axis */}
          <div aria-hidden className="pointer-events-none absolute bottom-[12%] left-(--gutter) top-[12%] hidden w-10 flex-col items-center justify-between lg:left-0 lg:flex">
            <span className="tech-label rotate-180 text-[9.5px] text-cyan [writing-mode:vertical-rl]">Digital</span>
            <div className="relative my-3 w-px flex-1 bg-steel">
              <span
                className="absolute bottom-0 left-0 w-px bg-cyan transition-[height] duration-700 ease-(--ease-mech)"
                style={{ height: `${((shown + 1) / ECOSYSTEM_LAYERS.length) * 100}%` }}
              />
            </div>
            <span className="tech-label rotate-180 text-[9.5px] text-mute [writing-mode:vertical-rl]">Physical</span>
          </div>

          {/* Mobile: current layer chip */}
          <div className="pointer-events-none absolute inset-x-(--gutter) bottom-3 flex items-center justify-between lg:hidden">
            <span className="tech-label text-[10px]" style={{ color: LAYER_COLORS[shown] }}>
              L{shown} · {ECOSYSTEM_LAYERS[shown].label}
            </span>
            <span className="tech-label text-[10px] text-dim">{ECOSYSTEM_LAYERS[shown].divisionName.replace("Armtronix ", "")}</span>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink to-transparent lg:hidden" />
        </div>

        {/* Layer narrative */}
        <ol ref={listRef} className="relative lg:col-span-5">
          {ECOSYSTEM_LAYERS.map((layer, i) => (
            <li key={layer.id} className="flex min-h-[58svh] items-center py-10 lg:min-h-[78svh]">
              <article
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={cn(
                  "relative w-full border-l pl-6 transition-[border-color,opacity] duration-500 sm:pl-8",
                  shown === i ? "opacity-100" : "opacity-40",
                )}
                style={{ borderColor: shown === i ? LAYER_COLORS[i] : "var(--color-steel)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.14em]" style={{ color: LAYER_COLORS[i] }}>
                    L{i}
                  </span>
                  <span aria-hidden className="tech-label text-dim">·</span>
                  <TechLabel>{layer.pillar}</TechLabel>
                </div>
                <h3 className="display mt-5 text-[clamp(1.9rem,3.4vw,3rem)]">{layer.label}</h3>
                <p className="mt-2 font-mono text-[12px] tracking-[0.06em] text-mute">{layer.divisionName}</p>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-white/80">{layer.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {layer.tags.map((t) => (
                    <li key={t} className="border border-steel-2/70 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.08em] text-mute">
                      {t}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${layer.division}`}
                  className="group mt-8 inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-cyan"
                >
                  Explore {layer.divisionName.replace("Armtronix ", "")}
                  <span aria-hidden className="h-px w-8 bg-current transition-[width] duration-500 group-hover:w-12" />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <div className="container-x pb-24 lg:pb-32">
        <div className="grid gap-px border border-steel/70 bg-steel/70 sm:grid-cols-3">
          {["Four specialized divisions", "Centralized governance", "One coordinated ecosystem"].map((t, i) => (
            <div key={t} className="flex items-center gap-4 bg-ink px-6 py-5">
              <span className="font-mono text-[11px] text-cyan">0{i + 1}</span>
              <span className="text-[15px] text-white/85">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function listItems(list: HTMLOListElement | null) {
  return list ? (Array.from(list.children) as HTMLElement[]) : [];
}
