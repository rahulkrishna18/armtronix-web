"use client";

import { useRef, useState } from "react";
import { PHILOSOPHY_COPY, PHILOSOPHY_STAGES } from "@/content/home";
import { TechLabel } from "@/components/ui/TechLabel";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

const STAGE_COLORS = ["#E9F0F2", "#00C8E8", "#4DFF9A"];

export function EngineeredIntelligence() {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.set("[data-draw]", { strokeDashoffset: 0 });
            gsap.set("[data-fade]", { opacity: 1 });
            setStage(2);
            if (bar.current) bar.current.style.width = "100%";
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
              onUpdate: (self) => {
                const p = self.progress;
                if (bar.current) bar.current.style.width = `${p * 100}%`;
                setStage(p < 0.34 ? 0 : p < 0.66 ? 1 : 2);
              },
            },
          });
          tl.fromTo("[data-draw='phys']", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.22, stagger: 0.006 }, 0.02)
            .fromTo("[data-fade='phys']", { opacity: 0 }, { opacity: 1, duration: 0.08, stagger: 0.012 }, 0.12)
            .to("[data-dim='phys']", { opacity: 0.38, duration: 0.08 }, 0.36)
            .fromTo("[data-draw='conn']", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2, stagger: 0.01 }, 0.36)
            .fromTo("[data-fade='conn']", { opacity: 0 }, { opacity: 1, duration: 0.08, stagger: 0.01 }, 0.42)
            .to("[data-dim='conn']", { opacity: 0.55, duration: 0.08 }, 0.68)
            .fromTo("[data-draw='intel']", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2, stagger: 0.01 }, 0.68)
            .fromTo("[data-fade='intel']", { opacity: 0 }, { opacity: 1, duration: 0.08, stagger: 0.01 }, 0.74)
            .to({}, { duration: 0.06 }, 0.94);
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="engineered-intelligence"
      data-section="02"
      aria-labelledby="ei-title"
      className="relative border-t border-steel/70 motion-safe:h-[340svh]"
    >
      <div className="sticky top-0 flex min-h-[100svh] flex-col overflow-hidden pt-[calc(var(--header-h)+20px)] motion-safe:h-[100svh]">
        <div className="grid-lines-fine pointer-events-none absolute inset-0 opacity-40 mask-fade-y" />
        <div className="container-x relative grid flex-1 gap-6 pb-6 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-10">
          <div className="lg:col-span-4">
            <TechLabel index="02">{PHILOSOPHY_COPY.eyebrow}</TechLabel>
            <h2 id="ei-title" className="display mt-5 text-[clamp(1.9rem,4vw,3.6rem)]">
              Physical becomes
              <span className="block text-mute">intelligent.</span>
            </h2>
            <p className="mt-5 hidden max-w-md text-[15px] leading-relaxed text-mute sm:block">{PHILOSOPHY_COPY.body}</p>

            <ol className="mt-6 grid grid-cols-3 gap-px border border-steel/70 bg-steel/70 lg:mt-10 lg:grid-cols-1">
              {PHILOSOPHY_STAGES.map((s, i) => (
                <li key={s.id} className={cn("bg-ink px-3 py-3 transition-colors duration-500 sm:px-4 lg:py-4", stage === i && "bg-graphite")}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span className="hidden font-mono text-[10.5px] sm:inline" style={{ color: stage >= i ? STAGE_COLORS[i] : "var(--color-dim)" }}>
                        0{i + 1}
                      </span>
                      <span className={cn("text-[11px] font-medium uppercase tracking-[0.08em] transition-colors sm:text-[14px] sm:tracking-[0.12em]", stage >= i ? "text-white" : "text-dim")}>
                        {s.label}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="hidden size-1.5 rounded-full transition-colors lg:block"
                      style={{ background: stage >= i ? STAGE_COLORS[i] : "var(--color-steel-2)" }}
                    />
                  </div>
                  <ul className={cn("mt-2.5 hidden flex-wrap gap-x-3 gap-y-1 transition-opacity duration-500 lg:flex", stage === i ? "opacity-100" : "opacity-40")}>
                    {s.items.map((item) => (
                      <li key={item} className="font-mono text-[11px] tracking-[0.04em] text-mute">
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <div className="mt-4 hidden h-px w-full bg-steel lg:block" aria-hidden>
              <div ref={bar} className="h-px w-0 bg-gradient-to-r from-white via-cyan to-green" />
            </div>
          </div>

          <div className="relative min-h-0 lg:col-span-8">
            <CrossSection stage={stage} />
            {/* Mobile: current stage vocabulary */}
            <ul className="mt-3 flex flex-wrap gap-2 lg:hidden">
              {PHILOSOPHY_STAGES[stage].items.map((item) => (
                <li key={item} className="border px-2 py-1 font-mono text-[10.5px] tracking-[0.06em]" style={{ borderColor: STAGE_COLORS[stage] + "55", color: STAGE_COLORS[stage] }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="container-x relative hidden pb-8 lg:block">
          <p className="max-w-3xl border-l border-cyan/60 pl-5 text-[15px] leading-relaxed text-mute">
            <span className="text-white">Outcome — </span>
            {PHILOSOPHY_COPY.outcome}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Facility cross-section drawing                                      */
/* ------------------------------------------------------------------ */

const W = "var(--color-white)";
const CY = "var(--color-cyan)";
const GR = "var(--color-green)";

function Tag({ x, y, children, color = "var(--color-mute)", anchor = "start", g }: { x: number; y: number; children: string; color?: string; anchor?: "start" | "middle" | "end"; g: string }) {
  return (
    <text data-fade={g} x={x} y={y} fill={color} textAnchor={anchor} className="hidden font-mono sm:block" fontSize="12.5" letterSpacing="1.6" opacity={0}>
      {children}
    </text>
  );
}

function CrossSection({ stage }: { stage: number }) {
  const truss: string[] = [];
  for (let x = 140; x < 860; x += 40) truss.push(`L${x + 20} 228 L${x + 40} 250`);
  const groundTicks: string[] = [];
  for (let x = 30; x < 980; x += 18) groundTicks.push(`M${x} 500 l-10 12`);
  const sensors = [
    { x: 70, y: 418 },
    { x: 205, y: 408 },
    { x: 380, y: 400 },
    { x: 482, y: 368 },
    { x: 500, y: 530 },
    { x: 676, y: 392 },
    { x: 722, y: 186 },
    { x: 770, y: 470 },
  ];

  return (
    <svg viewBox="0 0 1000 660" className="h-auto w-full lg:max-h-[calc(100svh-var(--header-h)-120px)]" role="img" aria-labelledby="xs-title xs-desc">
      <title id="xs-title">Facility cross-section</title>
      <desc id="xs-desc">
        A technical section drawing of a facility: concrete foundation, steel frame, power, cooling and mechanical plant; then fibre, networks, sensors and
        controllers; then an intelligence layer providing IIoT, automation, analytics, AI and operational visibility.
      </desc>
      <defs>
        <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="var(--color-steel-2)" strokeWidth="1.2" />
        </pattern>
        <marker id="arrow-g" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={GR} />
        </marker>
      </defs>

      {/* ============================ PHYSICAL ============================ */}
      <g data-dim="phys" fill="none" stroke={W} strokeWidth="1.3" strokeLinejoin="round">
        {/* ground */}
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M20 500 H980" strokeOpacity="0.7" />
        <path data-fade="phys" opacity={0} d={groundTicks.join(" ")} stroke="var(--color-steel-2)" strokeWidth="1" />
        {/* foundation + piles (concrete) */}
        <g data-fade="phys" opacity={0}>
          <rect x="130" y="500" width="740" height="54" fill="url(#hatch)" stroke="none" />
          {[170, 330, 500, 670, 830].map((x) => (
            <rect key={x} x={x - 12} y="554" width="24" height="88" fill="url(#hatch)" stroke="none" />
          ))}
        </g>
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M130 500 V554 H870 V500" />
        {[170, 330, 500, 670, 830].map((x) => (
          <path key={x} data-draw="phys" pathLength={1} strokeDasharray="1" d={`M${x - 12} 554 V642 H${x + 12} V554`} />
        ))}
        {/* steel columns (I-sections) */}
        {[160, 380, 620, 840].map((x) => (
          <path key={x} data-draw="phys" pathLength={1} strokeDasharray="1" d={`M${x - 6} 500 V250 M${x + 6} 500 V250 M${x - 12} 250 H${x + 12} M${x - 12} 500 H${x + 12}`} />
        ))}
        {/* roof truss */}
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d={`M140 228 H860 M140 250 H860 M140 250 ${truss.join(" ")}`} strokeWidth="1.1" />
        {/* cladding */}
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M140 250 V500 M860 250 V500" strokeOpacity="0.5" />
        {/* racks */}
        {[420, 466, 512].map((x) => (
          <g key={x}>
            <path data-draw="phys" pathLength={1} strokeDasharray="1" d={`M${x} 500 V380 H${x + 40} V500`} />
            <path data-fade="phys" opacity={0} d={`M${x + 6} 395 H${x + 34} M${x + 6} 410 H${x + 34} M${x + 6} 425 H${x + 34} M${x + 6} 440 H${x + 34} M${x + 6} 455 H${x + 34} M${x + 6} 470 H${x + 34}`} strokeWidth="0.8" strokeOpacity="0.6" />
          </g>
        ))}
        {/* power: transformer + switchgear */}
        <circle data-draw="phys" pathLength={1} strokeDasharray="1" cx="70" cy="430" r="15" />
        <circle data-draw="phys" pathLength={1} strokeDasharray="1" cx="70" cy="452" r="15" />
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M70 415 V300 M58 300 H82 M45 467 H95 V500 H45 Z M95 484 H140 M180 500 V420 H232 V500" />
        {/* duct */}
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M240 262 H600 M240 276 H600 M280 276 v10 M360 276 v10 M440 276 v10 M520 276 v10" strokeWidth="1" />
        {/* cooling: chiller + pipes + CRAH */}
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M640 228 V172 H800 V228" />
        <circle data-draw="phys" pathLength={1} strokeDasharray="1" cx="682" cy="160" r="13" />
        <circle data-draw="phys" pathLength={1} strokeDasharray="1" cx="758" cy="160" r="13" />
        <path data-fade="phys" opacity={0} d="M673 151 l18 18 M691 151 l-18 18 M749 151 l18 18 M767 151 l-18 18" strokeWidth="0.8" />
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M700 228 V400 M712 228 V486 H756" />
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M652 500 V400 H700 V500" />
        {/* mechanical: pump + valve */}
        <circle data-draw="phys" pathLength={1} strokeDasharray="1" cx="770" cy="486" r="13" />
        <path data-draw="phys" pathLength={1} strokeDasharray="1" d="M764 478 L779 486 L764 494 Z M783 486 H794 L816 476 V496 L794 486 M816 486 H832" />
      </g>
      <g>
        <Tag g="phys" x={882} y={532}>CONCRETE</Tag>
        <Tag g="phys" x={392} y={330}>STEEL</Tag>
        <Tag g="phys" x={70} y={290} anchor="middle">POWER</Tag>
        <Tag g="phys" x={812} y={204}>COOLING</Tag>
        <Tag g="phys" x={874} y={474}>MECHANICAL</Tag>
      </g>

      {/* ============================ CONNECTED =========================== */}
      <g data-dim="conn" fill="none" stroke={CY} strokeWidth="1.5">
        <path data-draw="conn" pathLength={1} strokeDasharray="1" d="M1000 516 H852 V292 H150" />
        {[852, 500, 180].map((x) => (
          <rect key={x} data-fade="conn" opacity={0} x={x - 6} y={286} width="12" height="12" fill="var(--color-ink)" />
        ))}
        {/* controllers */}
        {[196, 744].map((x) => (
          <g key={x} data-fade="conn" opacity={0}>
            <rect x={x - 24} y={318} width="48" height="26" fill="var(--color-ink)" />
            <text x={x} y={335} textAnchor="middle" fill={CY} stroke="none" fontSize="11" className="font-mono" letterSpacing="1.5">
              PLC
            </text>
            <path d={`M${x} 298 V318`} />
          </g>
        ))}
        {/* sensor wiring to controllers */}
        <path data-draw="conn" pathLength={1} strokeDasharray="1" strokeWidth="0.9" strokeOpacity="0.7" d="M70 418 V331 H172 M205 408 V344 M380 400 V331 H220 M482 368 V331 H720 M676 392 V344 H720 M722 186 V318 M770 470 V331 H768" />
        {sensors.map((s, i) => (
          <g key={i} data-fade="conn" opacity={0}>
            <circle cx={s.x} cy={s.y} r="5" fill={CY} stroke="none" />
            <circle cx={s.x} cy={s.y} r="10" strokeWidth="1" className={stage >= 1 ? "motion-safe:animate-pulse" : ""} />
          </g>
        ))}
      </g>
      <g>
        <Tag g="conn" x={990} y={506} anchor="end" color={CY}>FIBER</Tag>
        <Tag g="conn" x={515} y={284} color={CY}>NETWORKS</Tag>
        <Tag g="conn" x={392} y={415} color={CY}>SENSORS</Tag>
        <Tag g="conn" x={744} y={362} anchor="middle" color={CY}>CONTROLLERS</Tag>
      </g>

      {/* ============================ INTELLIGENT ========================= */}
      <g fill="none" stroke={GR} strokeWidth="1.3">
        <rect data-draw="intel" pathLength={1} strokeDasharray="1" x="150" y="22" width="700" height="104" stroke={CY} strokeOpacity="0.8" />
        <g data-fade="intel" opacity={0}>
          <text x="164" y="42" fill={CY} stroke="none" fontSize="11" className="font-mono" letterSpacing="1.6">
            INTELLIGENCE LAYER
          </text>
          {/* sparkline */}
          <polyline points="168,104 196,96 222,100 248,82 274,88 300,70 326,76 352,60" stroke={CY} strokeWidth="1.6" />
          {/* analytics bars */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={392 + i * 22} y={110 - [24, 38, 30, 50, 44][i]} width="12" height={[24, 38, 30, 50, 44][i]} fill={GR} fillOpacity="0.25" stroke={GR} strokeWidth="1" />
          ))}
          {/* AI node */}
          <path d="M586 52 L608 64 V88 L586 100 L564 88 V64 Z" stroke={CY} />
          <text x="586" y="81" textAnchor="middle" fill={W} stroke="none" fontSize="13" className="font-mono">
            AI
          </text>
          {/* gauge */}
          <path d="M650 100 A28 28 0 0 1 706 100" stroke="var(--color-steel-2)" strokeWidth="4" />
          <path d="M650 100 A28 28 0 0 1 696 80" stroke={GR} strokeWidth="4" />
          {/* automation loop */}
          <path d="M770 62 A18 18 0 1 1 752 80" stroke={GR} markerEnd="url(#arrow-g)" />
        </g>
        {/* data uplinks */}
        <path
          data-fade="intel"
          opacity={0}
          d="M70 410 V76 H150 M196 318 V126 M482 368 V126 M722 172 V126 M744 318 V126 M380 400 V126"
          stroke={CY}
          strokeWidth="1"
          strokeDasharray="3 7"
          className={stage === 2 ? "motion-safe:animate-[dash_1.4s_linear_infinite]" : ""}
        />
        {/* automation feedback loop down to plant */}
        <path data-draw="intel" pathLength={1} strokeDasharray="1" d="M820 126 V462" />
        <path data-draw="intel" pathLength={1} strokeDasharray="1" d="M640 126 V150 H600 V380" />
        <g data-fade="intel" opacity={0}>
          <path d="M820 452 V462" markerEnd="url(#arrow-g)" />
          <path d="M600 370 V380" markerEnd="url(#arrow-g)" />
        </g>
      </g>
      <g>
        <Tag g="intel" x={258} y={120} anchor="middle" color={CY}>IIOT</Tag>
        <Tag g="intel" x={440} y={52} anchor="middle" color={GR}>ANALYTICS</Tag>
        <Tag g="intel" x={828} y={300} color={GR}>AUTOMATION</Tag>
        <Tag g="intel" x={678} y={52} anchor="middle" color={GR}>VISIBILITY</Tag>
      </g>
    </svg>
  );
}
