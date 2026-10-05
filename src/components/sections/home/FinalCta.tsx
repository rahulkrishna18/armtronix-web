"use client";

import Link from "next/link";
import { useRef } from "react";
import { FINAL_CTA } from "@/content/home";
import { CONTACT } from "@/content/site";
import { CircuitButton } from "@/components/ui/CircuitButton";
import { Magnetic } from "@/components/ui/Magnetic";
import { TechLabel } from "@/components/ui/TechLabel";
import { gsap, useGSAP } from "@/lib/gsap";

const BUS = ["Foundation", "Facility", "Systems", "Power + Network", "Intelligence"];

export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } });
        tl.from("[data-bus-line]", { scaleX: 0, transformOrigin: "left center", duration: 1.6, ease: "power2.inOut" })
          .from("[data-bus-node]", { opacity: 0.15, duration: 0.3, stagger: 0.26 }, 0.1)
          .from("[data-bus-end]", { scale: 0.6, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 1.4)
          .from("[data-cta-line]", { yPercent: 105, duration: 1, ease: "expo.out", stagger: 0.1 }, 0.2);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="start" data-section="11" aria-labelledby="cta-title" className="relative overflow-hidden border-t border-steel/70 py-24 lg:py-40">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 mask-fade-y" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-[50%] bg-cyan/[0.07] blur-3xl" />

      <div className="container-x relative">
        {/* System bus: the whole stack terminates in the visitor's project */}
        <div className="relative hidden items-center lg:flex" aria-hidden>
          <span data-bus-line className="absolute left-0 right-16 top-1/2 h-px bg-gradient-to-r from-steel-2 via-cyan to-green" />
          <div className="relative grid flex-1 grid-cols-5 pr-16">
            {BUS.map((b, i) => (
              <span key={b} data-bus-node className="flex flex-col items-start gap-3">
                <span className="size-2.5 border border-cyan bg-ink" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                  L{i} · {b}
                </span>
              </span>
            ))}
          </div>
          <span data-bus-end className="relative flex size-16 items-center justify-center border border-green bg-green/10">
            <span className="size-3 rounded-full bg-green shadow-[0_0_18px_var(--color-green)] motion-safe:animate-pulse" />
          </span>
        </div>

        <div className="mt-0 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <TechLabel dot tone="green">
              {FINAL_CTA.eyebrow}
            </TechLabel>
            <h2 id="cta-title" className="display mt-7 text-[clamp(2.5rem,6.2vw,6rem)]">
              <span className="block overflow-hidden pb-[0.05em]">
                <span data-cta-line className="block">
                  {FINAL_CTA.title[0]}
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-cta-line className="block bg-gradient-to-r from-white via-white to-cyan bg-clip-text text-transparent">
                  {FINAL_CTA.title[1]}
                </span>
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[16px] leading-relaxed text-mute">{FINAL_CTA.body}</p>
            <div className="mt-9 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
              <Magnetic className="block xs:inline-block">
                <CircuitButton href="/contact" size="lg" className="w-full xs:w-auto">
                  Start Your Project
                </CircuitButton>
              </Magnetic>
            </div>
            <div className="mt-8 grid gap-1.5 font-mono text-[12.5px] text-mute">
              <a href={CONTACT.phoneHref} className="w-fit transition-colors hover:text-cyan">
                {CONTACT.phone}
              </a>
              <a href={CONTACT.emailHref} className="w-fit transition-colors hover:text-cyan">
                {CONTACT.email}
              </a>
              <Link href="/faq" className="w-fit text-dim transition-colors hover:text-cyan">
                Read the FAQ →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
