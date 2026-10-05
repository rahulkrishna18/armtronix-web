import Image from "next/image";
import Link from "next/link";
import { DIVISIONS, type Division } from "@/content/divisions";
import { DivisionHero } from "./DivisionHero";
import { DeliverConsole } from "./DeliverConsole";
import { ProcessFlow } from "@/components/sections/home/Process";
import { CtaBand } from "@/components/layout/CtaBand";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechLabel } from "@/components/ui/TechLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Brackets } from "@/components/ui/Brackets";
import { Ruler } from "@/components/ui/Ruler";

/** Line icons for the three approach principles: integrate · sustain · scale. */
const PRINCIPLE_ICONS = [
  <path key="0" d="M6 24h12M30 24h12M24 6v12M24 30v12M18 18h12v12H18z" />,
  <path key="1" d="M8 34 16 22l8 6 8-14 8 8M8 40h32" />,
  <path key="2" d="M8 40V28h8v12M20 40V20h8v20M32 40V10h8v30" />,
];

export function DivisionPage({ division }: { division: Division }) {
  const next = DIVISIONS[division.index % DIVISIONS.length];

  return (
    <>
      <DivisionHero division={division} />

      {/* Problem: conventional vs integrated */}
      <section aria-labelledby="problem-title" className="relative border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal variant="clip" className="photo-grade relative aspect-[4/3] border border-steel lg:col-span-6 lg:aspect-auto lg:min-h-[520px]">
            <Image src={division.image.src} alt={division.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 z-[3] grid-lines-fine opacity-25" />
            <Brackets className="z-[4] m-3" tone="border-white/40" />
            <span className="absolute left-5 top-5 z-[4] font-mono text-[10px] tracking-[0.14em] text-white/75">
              {division.code} · {division.fullName.toUpperCase()}
            </span>
            <Ruler ticks={40} major={10} className="absolute inset-x-6 bottom-3 z-[4] opacity-60" />
          </Reveal>

          <div className="lg:col-span-6 lg:pl-6">
            <TechLabel index="01">{division.problem.eyebrow}</TechLabel>
            <Reveal as="h2" className="display mt-6 text-[clamp(2rem,3.8vw,3.4rem)] text-balance">
              <span id="problem-title">{division.problem.title}</span>
            </Reveal>
            <p className="mt-8 text-[15px] text-mute">Conventional, fragmented delivery models aren’t structured for:</p>
            <div className="mt-5 border border-steel/70">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-steel/70 bg-graphite/60 px-4 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-dim sm:px-5">
                <span>Requirement</span>
                <span className="w-20 text-center">Fragmented</span>
                <span className="w-20 text-center">Armtronix</span>
              </div>
              <ul>
                {division.problem.list.map((item, i) => (
                  <Reveal as="li" key={item} delay={i * 70} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-steel/70 px-4 py-3.5 last:border-b-0 sm:px-5">
                    <span className="text-[15px] text-white/85">{item}</span>
                    <span className="flex w-20 justify-center" aria-label="Not structured for">
                      <svg viewBox="0 0 12 12" className="size-3 text-amber/80" aria-hidden>
                        <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </span>
                    <span className="flex w-20 justify-center" aria-label="Integrated">
                      <svg viewBox="0 0 12 12" className="size-3 text-green" aria-hidden>
                        <path d="M1.5 6.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>
            <p className="mt-8 border-l border-cyan/60 pl-5 text-[16px] leading-relaxed text-white/85">
              {division.problem.statement[0]} <span className="text-mute">{division.problem.statement[1]}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section aria-labelledby="approach-title" className="relative border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeader
            index="02"
            label={division.approach.eyebrow}
            title={
              <span id="approach-title">
                {division.approach.title[0]}
                <span className="block text-mute">{division.approach.title[1]}</span>
              </span>
            }
            body={division.approach.kicker}
          />
          <ol className="mt-14 grid gap-px border border-steel bg-steel md:grid-cols-3 lg:mt-20">
            {division.approach.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 90} className="group relative bg-ink p-7 transition-colors hover:bg-graphite sm:p-9">
                <div className="flex items-start justify-between">
                  <svg viewBox="0 0 48 48" className="size-11 text-steel-2 transition-colors duration-500 group-hover:text-cyan" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                    {PRINCIPLE_ICONS[i]}
                  </svg>
                  <span className="font-mono text-[11px] text-cyan">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-12 text-[22px] font-medium leading-tight tracking-[-0.01em] font-wide">{item.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-mute">{item.body}</p>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan transition-transform duration-700 group-hover:scale-x-100" />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* What we deliver */}
      <section id="deliver" aria-labelledby="deliver-title" className="relative scroll-mt-20 border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeader
            index="03"
            label="What we deliver"
            title={
              <span id="deliver-title">
                Capability,
                <span className="block text-mute">specified.</span>
              </span>
            }
            body={division.about}
          />
          <div className="mt-14 lg:mt-20">
            <DeliverConsole items={division.deliver} code={division.code} />
          </div>
        </div>
      </section>

      {/* How we work */}
      <section aria-label="How we work" className="relative border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x">
          <ProcessFlow trackIds={[division.slug]} index="04" />
        </div>
      </section>

      {/* Next layer */}
      <section aria-label="Next division" className="border-t border-steel/70">
        <Link href={`/${next.slug}`} className="group container-x flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between lg:py-20">
          <div>
            <p className="tech-label text-dim">Next layer · {next.code}</p>
            <p className="display mt-4 text-[clamp(2rem,5vw,4.4rem)] transition-colors group-hover:text-cyan">{next.fullName}</p>
            <p className="mt-3 max-w-xl text-[15px] text-mute">{next.summary}</p>
          </div>
          <span className="flex size-16 shrink-0 items-center justify-center border border-steel-2 transition-colors duration-500 group-hover:border-cyan group-hover:bg-cyan group-hover:text-ink sm:size-20" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-6 transition-transform duration-500 group-hover:translate-x-1">
              <path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </Link>
      </section>

      <CtaBand label={division.hero.cta} cta={division.hero.cta} />
    </>
  );
}
