"use client";

import type { KeyboardEvent } from "react";
import type { Crah, Rack, Status } from "./useTelemetry";
import { RACKS_PER_ROW } from "./useTelemetry";

const STOPS: [number, [number, number, number]][] = [
  [21, [14, 59, 70]],
  [24, [22, 112, 128]],
  [26.5, [255, 181, 71]],
  [29, [255, 92, 92]],
];

/** Maps a simulated inlet temperature to the heat-map fill colour. */
export function heat(t: number) {
  if (t <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(",")})`;
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(",")})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(",")})`;
}

const statusStroke: Record<Status, string> = {
  ok: "var(--color-steel-2)",
  warn: "var(--color-amber)",
  fault: "var(--color-red)",
};

const RACK_W = 44;
const RACK_H = 44;
const RX = (i: number) => 150 + i * 50;
const RY = [118, 258];
const CRAH_Y = [80, 178, 276];

export type Selection = { kind: "rack" | "crah"; id: string };

export function FloorPlan({
  racks,
  crah,
  selected,
  onSelect,
  animate,
}: {
  racks: Rack[];
  crah: Crah[];
  selected: Selection;
  onSelect: (s: Selection) => void;
  animate: boolean;
}) {
  const key = (s: Selection) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(s);
    }
  };
  const flow = animate ? "motion-safe:animate-[dash_1.2s_linear_infinite]" : "";
  const fault = crah.some((c) => c.status === "fault");
  const sel = selected.kind === "rack" ? racks.find((r) => r.id === selected.id) : undefined;

  return (
    <svg viewBox="0 0 660 420" className="h-auto w-full select-none" role="group" aria-label="Simulated data hall floor plan — select a rack or cooling unit to inspect it">
      <defs>
        <pattern id="fp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--color-steel)" strokeWidth="0.5" opacity="0.5" />
        </pattern>
        <marker id="fp-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 1 L8 5 L0 9" fill="none" stroke="var(--color-cyan)" strokeWidth="1.5" />
        </marker>
      </defs>

      {/* structural grid bubbles */}
      {["A", "B", "C", "D", "E", "F"].map((l, i) => (
        <g key={l} className="font-mono" fontSize="9" fill="var(--color-dim)">
          <circle cx={90 + i * 100} cy={10} r={7} fill="none" stroke="var(--color-steel-2)" strokeWidth="0.8" />
          <text x={90 + i * 100} y={13} textAnchor="middle">
            {l}
          </text>
          <line x1={90 + i * 100} y1={17} x2={90 + i * 100} y2={24} stroke="var(--color-steel-2)" strokeWidth="0.6" strokeDasharray="2 2" />
        </g>
      ))}

      {/* room */}
      <rect x="16" y="24" width="628" height="380" fill="url(#fp-grid)" stroke="var(--color-steel-2)" strokeWidth="1.4" />
      <rect x="22" y="30" width="616" height="368" fill="none" stroke="var(--color-steel)" strokeWidth="0.8" />

      {/* aisles */}
      <rect x="140" y="166" width="414" height="88" fill="var(--color-cyan)" opacity="0.05" />
      <rect x="140" y="74" width="414" height="40" fill="var(--color-amber)" opacity="0.035" />
      <rect x="140" y="306" width="414" height="40" fill="var(--color-amber)" opacity="0.035" />
      <text x="347" y="200" textAnchor="middle" className="font-mono" fontSize="9" letterSpacing="2" fill="var(--color-cyan)" opacity="0.6">
        COLD AISLE
      </text>
      <text x="347" y="88" textAnchor="middle" className="font-mono" fontSize="8.5" letterSpacing="2" fill="var(--color-amber)" opacity="0.5">
        HOT AISLE
      </text>
      <text x="347" y="340" textAnchor="middle" className="font-mono" fontSize="8.5" letterSpacing="2" fill="var(--color-amber)" opacity="0.5">
        HOT AISLE
      </text>

      {/* power busway (blue) */}
      <path d="M150 112 H601 V118 M150 308 H601 V302 M601 90 V112" fill="none" stroke="var(--color-blue)" strokeWidth="1.4" opacity="0.8" />
      <path d="M150 112 H601 M150 308 H601" fill="none" stroke="var(--color-blue)" strokeWidth="1.4" strokeDasharray="4 6" className={flow} />
      {/* fibre trays (cyan) */}
      <path d="M150 104 H620 V340 M150 316 H620" fill="none" stroke="var(--color-cyan)" strokeWidth="1" strokeDasharray="2 4" className={flow} opacity="0.85" />

      {/* airflow: CRAH → cold aisle */}
      {CRAH_Y.map((y, i) => (
        <path
          key={i}
          d={`M72 ${y + 32} C 110 ${y + 32}, 110 228, 150 228 H540`}
          fill="none"
          stroke={crah[i].status === "fault" ? "var(--color-red)" : "var(--color-cyan)"}
          strokeWidth={crah[i].fan > 80 ? 1.8 : 1}
          strokeDasharray="5 6"
          opacity={crah[i].status === "fault" ? 0.25 : 0.5}
          className={crah[i].status === "fault" ? "" : flow}
          markerEnd={i === 1 ? "url(#fp-arrow)" : undefined}
        />
      ))}

      {/* CRAH units */}
      {crah.map((c, i) => {
        const y = CRAH_Y[i];
        const isSel = selected.kind === "crah" && selected.id === c.id;
        const s = { kind: "crah" as const, id: c.id };
        return (
          <g
            key={c.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`${c.id}, fan ${c.fan} percent, status ${c.status}`}
            onClick={() => onSelect(s)}
            onKeyDown={key(s)}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-cyan"
          >
            <rect
              x="30"
              y={y}
              width="42"
              height="64"
              fill={c.status === "fault" ? "rgba(255,92,92,0.14)" : "var(--color-graphite)"}
              stroke={isSel ? "var(--color-cyan)" : c.status === "fault" ? "var(--color-red)" : "var(--color-steel-2)"}
              strokeWidth={isSel ? 1.6 : 1}
              className={c.status === "fault" ? "motion-safe:animate-pulse" : ""}
            />
            <circle cx="51" cy={y + 24} r="11" fill="none" stroke="var(--color-mute)" strokeWidth="0.8" />
            <g style={{ transformOrigin: `51px ${y + 24}px` }} className={c.status !== "fault" && animate ? "motion-safe:animate-spin motion-safe:[animation-duration:1.6s]" : ""}>
              <path d={`M43 ${y + 24} H59 M51 ${y + 16} V${y + 32}`} stroke="var(--color-mute)" strokeWidth="1" />
            </g>
            <text x="51" y={y + 52} textAnchor="middle" className="font-mono" fontSize="7.5" fill="var(--color-mute)">
              {c.id.replace("CRAH-", "CR-")}
            </text>
            <circle cx="72" cy={y + 6} r="3" fill={c.status === "fault" ? "var(--color-red)" : "var(--color-green)"} />
          </g>
        );
      })}

      {/* racks */}
      {racks.map((r) => {
        const x = RX(r.idx);
        const y = RY[r.row];
        const isSel = selected.kind === "rack" && selected.id === r.id;
        const isCore = r.idx === RACKS_PER_ROW - 1;
        const s = { kind: "rack" as const, id: r.id };
        return (
          <g
            key={r.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={`Rack ${r.id}, ${r.temp} degrees, ${r.kw} kilowatts, status ${r.status}`}
            onClick={() => onSelect(s)}
            onKeyDown={key(s)}
            className="cursor-pointer outline-none [&:focus-visible>rect]:stroke-cyan"
          >
            <rect x={x} y={y} width={RACK_W} height={RACK_H} fill={heat(r.temp)} fillOpacity={0.55} stroke={isSel ? "var(--color-cyan)" : statusStroke[r.status]} strokeWidth={isSel || r.status !== "ok" ? 1.5 : 0.9} style={{ transition: "fill 0.8s ease" }} />
            {[0, 1, 2, 3].map((k) => (
              <line key={k} x1={x + 6} x2={x + RACK_W - 6} y1={y + 9 + k * 9} y2={y + 9 + k * 9} stroke="rgba(233,240,242,0.18)" strokeWidth="0.7" />
            ))}
            {isCore && <rect x={x + 2} y={y + 2} width={RACK_W - 4} height={RACK_H - 4} fill="none" stroke="var(--color-cyan)" strokeWidth="0.8" strokeDasharray="2 2" />}
            <text x={x + RACK_W / 2} y={r.row === 0 ? y - 4 : y + RACK_H + 11} textAnchor="middle" className="font-mono" fontSize="7.5" fill={isSel ? "var(--color-cyan)" : "var(--color-dim)"}>
              {r.id}
            </text>
            {/* inlet sensor */}
            <circle cx={x + RACK_W / 2} cy={r.row === 0 ? y + RACK_H + 5 : y - 5} r="2.6" fill={r.status === "ok" ? "var(--color-green)" : r.status === "warn" ? "var(--color-amber)" : "var(--color-red)"} />
          </g>
        );
      })}

      {/* electrical + network rooms */}
      <g className="font-mono" fontSize="8" fill="var(--color-mute)">
        <rect x="572" y="40" width="58" height="50" fill="var(--color-graphite)" stroke="var(--color-blue)" strokeWidth="1" />
        <text x="601" y="69" textAnchor="middle">UPS</text>
        {RY.map((y, i) => (
          <g key={y}>
            <rect x="588" y={y} width="26" height={RACK_H} fill="var(--color-graphite)" stroke="var(--color-blue)" strokeWidth="1" />
            <text x="601" y={y + RACK_H / 2 + 3} textAnchor="middle" fontSize="7">
              {i === 0 ? "PDU-A" : "PDU-B"}
            </text>
          </g>
        ))}
        <rect x="572" y="340" width="58" height="50" fill="var(--color-graphite)" stroke="var(--color-cyan)" strokeWidth="1" />
        <text x="601" y="369" textAnchor="middle" fill="var(--color-cyan)">NET</text>
      </g>

      {/* environmental sensors */}
      {[
        [30, 38],
        [630, 100],
        [30, 392],
        [540, 392],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="var(--color-green)" />
      ))}

      {/* selected rack callout */}
      {sel && (
        <g pointerEvents="none">
          <line x1={RX(sel.idx) + RACK_W / 2} x2={RX(sel.idx) + RACK_W / 2} y1={sel.row === 0 ? RY[0] - 14 : RY[1] + RACK_H + 16} y2={sel.row === 0 ? 50 : 370} stroke="var(--color-cyan)" strokeWidth="0.8" />
          <rect x={RX(sel.idx) + RACK_W / 2 - 52} y={sel.row === 0 ? 34 : 362} width="104" height="18" fill="var(--color-ink)" stroke="var(--color-cyan)" strokeWidth="0.8" />
          <text x={RX(sel.idx) + RACK_W / 2} y={sel.row === 0 ? 46 : 374} textAnchor="middle" className="font-mono" fontSize="8.5" fill="var(--color-cyan)">
            {sel.id} · {sel.temp.toFixed(1)}°C · {sel.kw.toFixed(1)}kW
          </text>
        </g>
      )}

      {fault && (
        <text x="30" y="72" className="font-mono" fontSize="8" fill="var(--color-red)" letterSpacing="1">
          ▲ AIRFLOW LOSS
        </text>
      )}
    </svg>
  );
}
