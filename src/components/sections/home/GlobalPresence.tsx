import { PRESENCE } from "@/content/company";
import { MAP_DOTS, MAP_GRID } from "@/content/map-dots";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PresenceInteractive } from "./PresenceInteractive";

const project = (lon: number, lat: number) => ({ x: (lon - MAP_GRID.lonMin) / MAP_GRID.step, y: (MAP_GRID.latMax - lat) / MAP_GRID.step });

function dotsPath(arr: readonly number[]) {
  let d = "";
  for (let i = 0; i < arr.length; i += 2) d += `M${arr[i]} ${arr[i + 1]}h0`;
  return d;
}

/** Quadratic arc between two projected points, bowed to one side. */
function arc(a: { x: number; y: number }, b: { x: number; y: number }, bow = 0.25) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return `M${a.x} ${a.y} Q${mx - dy * bow} ${my + dx * bow} ${b.x} ${b.y}`;
}

export function GlobalPresence({ index = "11" }: { index?: string }) {
  const W = MAP_GRID.cols;
  const H = MAP_GRID.rows;
  const hq = project(PRESENCE.sites[0].lon, PRESENCE.sites[0].lat);
  const north = project(PRESENCE.sites[1].lon, PRESENCE.sites[1].lat);
  const au = project(PRESENCE.regions[1].anchor.lon, PRESENCE.regions[1].anchor.lat);
  const ind = project(PRESENCE.regions[2].anchor.lon, PRESENCE.regions[2].anchor.lat);

  const markers = [
    { id: "hq", region: "my", p: hq, label: "HQ · Kuala Lumpur", short: "HQ · KL", side: "right" as const },
    { id: "northops", region: "my", p: north, label: "NorthOps · Penang", short: "Penang", side: "left" as const },
    { id: "au", region: "au", p: au, label: "Armtronix Pty Ltd · Australia", short: "Australia", side: "right" as const },
    { id: "in", region: "in", p: ind, label: "Armtronix Pvt Ltd · India", short: "India", side: "right" as const },
  ];

  const map = (
    <div className="relative mx-auto aspect-[121/109] w-full max-w-[720px]">
      <svg viewBox={`-2 -2 ${W + 4} ${H + 4}`} className="absolute inset-0 size-full" aria-hidden>
        <path d={dotsPath(MAP_DOTS.land)} stroke="var(--color-steel-2)" strokeWidth="0.42" strokeLinecap="round" />
        <path className="region region-my" d={dotsPath(MAP_DOTS.my)} strokeWidth="0.55" strokeLinecap="round" />
        <path className="region region-au" d={dotsPath(MAP_DOTS.au)} strokeWidth="0.5" strokeLinecap="round" />
        <path className="region region-in" d={dotsPath(MAP_DOTS.in)} strokeWidth="0.5" strokeLinecap="round" />
        <g fill="none" strokeWidth="0.35" strokeLinecap="round">
          <path d={arc(hq, ind, -0.22)} stroke="var(--color-cyan)" strokeDasharray="1.2 1.6" className="motion-safe:animate-[dash_2.4s_linear_infinite]" />
          <path d={arc(hq, au, 0.2)} stroke="var(--color-cyan)" strokeDasharray="1.2 1.6" className="motion-safe:animate-[dash_2.4s_linear_infinite]" />
          <path d={arc(hq, north, 0.6)} stroke="var(--color-green)" />
        </g>
        {markers.map((m) => (
          <g key={m.id}>
            <circle cx={m.p.x} cy={m.p.y} r={m.id === "hq" ? 1.6 : 1.1} fill={m.id === "hq" || m.id === "northops" ? "var(--color-green)" : "var(--color-cyan)"} />
            <circle cx={m.p.x} cy={m.p.y} r="3" fill="none" stroke="var(--color-cyan)" strokeWidth="0.25" opacity="0.6" />
          </g>
        ))}
      </svg>
      {markers.map((m) => (
        <span
          key={m.id}
          className={`pointer-events-none absolute flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-white/80 sm:text-[10px] ${m.side === "left" ? "-translate-x-full flex-row-reverse pr-2" : "pl-2"}`}
          style={{ left: `${((m.p.x + 2) / (W + 4)) * 100}%`, top: `${((m.p.y + 2) / (H + 4)) * 100}%` }}
        >
          <span className="h-px w-3 bg-white/40" />
          <span className="hidden sm:inline">{m.label}</span>
          <span className="sm:hidden">{m.short}</span>
        </span>
      ))}
    </div>
  );

  return (
    <section id="presence" data-section={index} aria-labelledby="presence-title" className="relative overflow-hidden border-t border-steel/70 py-24 lg:py-36">
      <div className="container-x">
        <SectionHeader
          index={index}
          label={PRESENCE.eyebrow}
          title={<span id="presence-title">{PRESENCE.title}</span>}
          body={PRESENCE.body}
        />
        <PresenceInteractive regions={PRESENCE.regions} map={map} />
      </div>
    </section>
  );
}
