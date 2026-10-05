"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { SHOWCASE } from "@/content/home";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Brackets } from "@/components/ui/Brackets";
import { Ruler } from "@/components/ui/Ruler";
import { gsap, useGSAP } from "@/lib/gsap";

export function Showcase() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (next) {
            gsap.to(card.querySelector("[data-card-inner]"), {
              scale: 0.93,
              opacity: 0.35,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
            });
          }
          // Image parallax inside its frame
          gsap.fromTo(
            card.querySelector("[data-card-img]"),
            { yPercent: -6 },
            { yPercent: 6, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
          );
          // Annotations draw in when the card settles
          gsap.from(card.querySelectorAll("[data-annot]"), {
            opacity: 0,
            scale: 0.6,
            duration: 0.6,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: { trigger: card, start: "top 40%", toggleActions: "play none none reverse" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="showcase" data-section="09" aria-labelledby="showcase-title" className="relative border-t border-steel/70 py-24 lg:py-36">
      <div className="container-x">
        <SectionHeader
          index="09"
          label="Capability showcase"
          title={
            <span id="showcase-title">
              Delivering
              <span className="block text-mute">Engineered Intelligence.</span>
            </span>
          }
          body="How Armtronix transforms complex infrastructure into high-performance, mission-critical environments through integrated execution, precision engineering, and intelligent systems."
        />
      </div>

      <div ref={root} className="container-x mt-14 grid gap-6 lg:mt-20 lg:block">
        {SHOWCASE.map((s) => (
          <article key={s.id} data-card className="lg:sticky lg:top-[calc(var(--header-h)+20px)] lg:mb-[14vh] lg:h-[calc(100svh-var(--header-h)-40px)] lg:last:mb-0">
            <div data-card-inner className="grid h-full origin-top overflow-hidden border border-steel bg-graphite lg:grid-cols-12">
              {/* Image */}
              <div className="photo-grade relative aspect-[4/3] lg:col-span-7 lg:aspect-auto">
                <div data-card-img className="absolute -inset-y-[8%] inset-x-0">
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
                  <div className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-cyan/[0.07] to-transparent motion-safe:animate-scan" />
                </div>
                <div aria-hidden className="absolute inset-0 z-[3] grid-lines-fine opacity-25" />
                {s.annotations.map((a) => (
                  <div key={a.label} data-annot className="absolute z-[4] -translate-x-1/2 -translate-y-1/2" style={{ left: `${a.x}%`, top: `${a.y}%` }}>
                    <span className="relative flex size-6 items-center justify-center">
                      <span className="absolute inset-0 rounded-full border border-cyan/70 motion-safe:animate-ping" />
                      <span className="size-1.5 rounded-full bg-cyan" />
                    </span>
                    <span className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap ${a.x > 60 ? "right-7 flex-row-reverse" : "left-7"}`}>
                      <span className="h-px w-6 bg-cyan/70" />
                      <span className="border border-cyan/40 bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan backdrop-blur-sm">{a.label}</span>
                    </span>
                  </div>
                ))}
                <div className="absolute left-4 top-4 z-[4] font-mono text-[10px] tracking-[0.14em] text-white/70">
                  FIG. {s.index} – {s.division.toUpperCase()}
                </div>
                <Brackets className="z-[4] m-3" tone="border-white/40" />
                <Ruler ticks={50} major={10} className="absolute inset-x-6 bottom-3 z-[4] opacity-60" />
              </div>

              {/* Text */}
              <div className="relative flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10 xl:p-12">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-cyan">{s.index} / 0{SHOWCASE.length}</span>
                  <span className="tech-label text-dim">{s.division}</span>
                </div>
                <h3 className="display mt-8 text-[clamp(1.8rem,2.8vw,2.9rem)] text-balance lg:mt-auto">{s.title}</h3>
                <p className="mt-5 text-[16px] leading-relaxed text-white/85">{s.summary}</p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-mute">{s.detail}</p>
                <dl className="mt-8 grid grid-cols-3 gap-px border border-steel/70 bg-steel/70">
                  {s.specs.map((spec, k) => (
                    <div key={spec} className="bg-graphite px-3 py-3">
                      <dt className="font-mono text-[9.5px] tracking-[0.14em] text-dim">SPEC.{k + 1}</dt>
                      <dd className="mt-1 text-[12.5px] leading-snug text-white/85">{spec}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={s.href} className="group mt-8 inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:text-cyan lg:mb-auto">
                  Explore {s.division}
                  <span aria-hidden className="h-px w-8 bg-current transition-[width] duration-500 group-hover:w-12" />
                </Link>
                <span aria-hidden className="pointer-events-none absolute -bottom-6 right-4 font-mono text-[120px] leading-none text-white/[0.03] lg:text-[180px]">
                  {s.index}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
