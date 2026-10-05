import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ABOUT, LEADERSHIP } from "@/content/company";
import { PHILOSOPHY_COPY } from "@/content/home";
import { DIVISIONS } from "@/content/divisions";
import { TechLabel } from "@/components/ui/TechLabel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Brackets } from "@/components/ui/Brackets";
import { StatusDot } from "@/components/ui/StatusDot";
import { GlobalPresence } from "@/components/sections/home/GlobalPresence";
import { CtaBand } from "@/components/layout/CtaBand";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT.intro,
  alternates: { canonical: "/about" },
};

function GroupStructure() {
  return (
    <div className="relative border border-steel bg-graphite/50 p-6 sm:p-8">
      <Brackets className="m-2" />
      <p className="tech-label text-[10px] text-dim">Fig. 01 – Group structure</p>
      <div className="relative mt-8 flex justify-center">
        <div className="relative z-10 border border-cyan/70 bg-ink px-6 py-4 text-center">
          <p className="font-mono text-[10px] tracking-[0.16em] text-cyan">ARMTRONIX GROUP</p>
          <p className="mt-1 text-[14px] text-white">Centralized governance</p>
        </div>
      </div>
      <div aria-hidden className="relative mx-auto h-10 w-px bg-steel-2" />
      <div aria-hidden className="relative mx-[12.5%] h-px bg-steel-2" />
      <ul className="grid grid-cols-2 gap-3 pt-0 sm:grid-cols-4">
        {DIVISIONS.map((d) => (
          <li key={d.slug} className="flex flex-col items-center">
            <span aria-hidden className="h-6 w-px bg-steel-2" />
            <Link href={`/${d.slug}`} className="group w-full border border-steel-2/80 bg-ink px-3 py-3 text-center transition-colors hover:border-cyan">
              <span className="block font-mono text-[10px] tracking-[0.14em] text-cyan">{d.code}</span>
              <span className="mt-1 block text-[13.5px] text-white">{d.name}</span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.1em] text-dim group-hover:text-mute">{d.pillar}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-steel/70 pt-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mute">
        <span className="flex items-center gap-2">
          <StatusDot tone="green" pulse={false} /> Mission-critical
        </span>
        <span className="flex items-center gap-2">
          <StatusDot tone="cyan" pulse={false} /> Integrated digital
        </span>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section aria-labelledby="about-title" className="relative overflow-hidden pt-[calc(var(--header-h)+48px)] pb-20 lg:pb-28">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 mask-fade-b" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <TechLabel dot tone="cyan">
              {ABOUT.eyebrow}
            </TechLabel>
            <h1 id="about-title" className="display mt-7 text-[clamp(2.2rem,4.5vw,4.3rem)] text-balance">
              {ABOUT.title[0]}
              <span className="block text-mute">{ABOUT.title[1]}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[16.5px] leading-relaxed text-mute">{ABOUT.intro}</p>
          </div>
          <div className="lg:col-span-5">
            <GroupStructure />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-title" className="relative border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <TechLabel index="01">{PHILOSOPHY_COPY.eyebrow}</TechLabel>
            <Reveal as="h2" className="display mt-6 text-[clamp(2.1rem,4.4vw,4rem)]">
              <span id="philosophy-title">
                {PHILOSOPHY_COPY.title[0]}
                <span className="block text-mute">{PHILOSOPHY_COPY.title[1]}</span>
              </span>
            </Reveal>
            <p className="mt-8 text-[16px] leading-relaxed text-white/85">
              {PHILOSOPHY_COPY.body} This approach enables real-time visibility, operational resilience, advanced cybersecurity, and intelligent automation across every infrastructure layer.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-mute">{PHILOSOPHY_COPY.closing}</p>
          </div>
          <Reveal variant="clip" className="photo-grade relative aspect-[4/3] border border-steel lg:col-span-6 lg:aspect-auto lg:min-h-[480px]">
            <Image src="/images/infrastructure1.webp" alt="Engineers reviewing plans on site above an urban transport corridor" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <Brackets className="z-[4] m-3" tone="border-white/40" />
            <span className="absolute bottom-5 left-5 z-[4] font-mono text-[10px] tracking-[0.14em] text-white/75">PHYSICAL × DIGITAL · ONE OPERATIONAL FRAMEWORK</span>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section aria-label="Mission and vision" className="border-t border-steel/70">
        <div className="container-x grid gap-px bg-steel/70 py-px md:grid-cols-2">
          {[
            { label: "Our mission", body: ABOUT.mission, tone: "text-cyan" },
            { label: "Our vision", body: ABOUT.vision, tone: "text-green" },
          ].map((m, i) => (
            <Reveal key={m.label} delay={i * 100} className="relative bg-ink px-2 py-16 sm:px-8 lg:px-12 lg:py-24">
              <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${m.tone}`}>
                0{i + 1} · {m.label}
              </p>
              <p className="mt-8 text-[clamp(1.35rem,2.3vw,2rem)] leading-snug tracking-[-0.01em] text-white/90 font-wide">{m.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Divisions */}
      <section aria-labelledby="divisions-title" className="border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeader index="02" label="Core divisions" title={<span id="divisions-title">Four divisions. One ecosystem.</span>} body={ABOUT.short} />
          <ul className="mt-14 border-t border-steel/70 lg:mt-20">
            {DIVISIONS.map((d, i) => (
              <Reveal as="li" key={d.slug} delay={i * 60}>
                <Link href={`/${d.slug}`} className="group grid gap-4 border-b border-steel/70 py-8 transition-colors hover:bg-graphite/40 sm:grid-cols-[5rem_1fr_auto] sm:items-center lg:grid-cols-[6rem_22rem_1fr_auto] lg:px-4">
                  <span className="font-mono text-[12px] text-cyan">{d.code}</span>
                  <span className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium tracking-[-0.01em] font-wide transition-colors group-hover:text-cyan">{d.fullName}</span>
                  <span className="text-[15px] leading-relaxed text-mute sm:col-start-2 lg:col-start-auto">{d.about}</span>
                  <svg viewBox="0 0 24 24" className="hidden size-5 text-dim transition-all duration-500 group-hover:translate-x-1 group-hover:text-cyan sm:col-start-3 sm:row-start-1 sm:block lg:col-start-auto" aria-hidden>
                    <path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Governance */}
      <section aria-labelledby="gov-title" className="border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal variant="clip" className="photo-grade relative order-2 aspect-[4/3] border border-steel lg:order-1 lg:col-span-5 lg:aspect-auto lg:min-h-[460px]">
            <Image src="/images/engineering1.webp" alt="Engineering team reviewing plans together" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <Brackets className="z-[4] m-3" tone="border-white/40" />
          </Reveal>
          <div className="order-1 lg:order-2 lg:col-span-7 lg:pl-6">
            <TechLabel index="03">{ABOUT.governance.eyebrow}</TechLabel>
            <Reveal as="h2" className="display mt-6 text-[clamp(2.1rem,4.4vw,4rem)]">
              <span id="gov-title">
                {ABOUT.governance.title[0]}
                <span className="block text-mute">{ABOUT.governance.title[1]}</span>
              </span>
            </Reveal>
            {ABOUT.governance.body.map((p) => (
              <p key={p} className="mt-6 max-w-2xl text-[16px] leading-relaxed text-mute">
                {p}
              </p>
            ))}
            <ul className="mt-10 grid grid-cols-2 gap-px border border-steel/70 bg-steel/70">
              {ABOUT.governance.principles.map((p, i) => (
                <li key={p} className="bg-ink px-4 py-4">
                  <span className="font-mono text-[10px] text-cyan">0{i + 1}</span>
                  <span className="mt-1 block text-[14.5px] text-white/85">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <GlobalPresence index="04" />

      {/* Leadership */}
      <section aria-labelledby="leadership-title" className="border-t border-steel/70 py-24 lg:py-32">
        <div className="container-x">
          <SectionHeader index="05" label="Leadership team" title={<span id="leadership-title">The people behind the system.</span>} body={ABOUT.governance.body[0]} />
          <ul className="mt-14 grid grid-cols-1 gap-px border border-steel bg-steel xs:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {LEADERSHIP.map((p, i) => (
              <Reveal as="li" key={p.name} delay={(i % 3) * 80} className="group relative bg-ink">
                <div className="relative aspect-[347/300] overflow-hidden bg-graphite">
                  <Image
                    src={p.image}
                    alt={`${p.name}, ${p.role}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 416px) 50vw, 100vw"
                    className="object-cover object-top grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.14em] text-white/70">ID.{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[18px] font-medium tracking-[-0.01em] font-wide">{p.name}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cyan">{p.role}</p>
                  <p className="mt-3 text-[14px] text-mute">{p.focus}</p>
                </div>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan transition-transform duration-700 group-hover:scale-x-100" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
