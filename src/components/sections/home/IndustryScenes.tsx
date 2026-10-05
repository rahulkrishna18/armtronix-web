import type { IndustryId } from "@/content/home";

/*
 * Procedural line-art environments for each industry (viewBox 400 × 500).
 * Elements with `ind-anim` only animate while their panel is active.
 */

const S = "var(--color-steel-2)";
const S2 = "var(--color-mute)";
const CY = "var(--color-cyan)";
const GR = "var(--color-green)";
const BL = "var(--color-blue)";

function Datacenters() {
  const vp = { x: 200, y: 235 };
  const f = (k: number) => 1 / (1 + k * 0.42);
  const cols = Array.from({ length: 9 }, (_, k) => f(k));
  const side = (dir: -1 | 1) =>
    cols.map((c, k) => {
      const x = vp.x + dir * 175 * c;
      const top = vp.y - 190 * c;
      const bot = vp.y + 230 * c;
      const next = cols[k + 1];
      return (
        <g key={`${dir}-${k}`}>
          <line x1={x} y1={top} x2={x} y2={bot} stroke={S} />
          {next && (
            <>
              <line x1={x} y1={top} x2={vp.x + dir * 175 * next} y2={vp.y - 190 * next} stroke={S} />
              <line x1={x} y1={bot} x2={vp.x + dir * 175 * next} y2={vp.y + 230 * next} stroke={S} />
              {[0.25, 0.4, 0.55, 0.7].map((t, j) => (
                <circle
                  key={j}
                  cx={x + dir * -6 * c}
                  cy={top + (bot - top) * t}
                  r={Math.max(0.8, 2.2 * c)}
                  fill={(k + j) % 3 === 0 ? CY : GR}
                  className="ind-anim ind-blink"
                  style={{ animationDelay: `${((k * 7 + j * 3) % 10) / 10}s` }}
                />
              ))}
            </>
          )}
        </g>
      );
    });
  return (
    <g fill="none" strokeWidth="1">
      {side(-1)}
      {side(1)}
      {/* floor tiles */}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={vp.x} y1={vp.y} x2={-60 + i * 87} y2={500} stroke={S} strokeOpacity="0.5" />
      ))}
      {/* overhead fibre trays */}
      <path d={`M${vp.x} ${vp.y - 6} L-20 20 M${vp.x} ${vp.y - 6} L420 20`} stroke={CY} strokeDasharray="4 6" className="ind-anim ind-dash" />
      <circle cx={vp.x} cy={vp.y} r="3" fill={CY} />
    </g>
  );
}

function Industrial() {
  const roof = Array.from({ length: 6 }, (_, i) => `L${20 + i * 64 + 40} 70 L${20 + i * 64 + 64} 110`).join(" ");
  const gear = (cx: number, cy: number, r: number, teeth = 10) => {
    const pts: string[] = [];
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2;
      const rr = i % 2 ? r : r + 7;
      pts.push(`${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`);
    }
    return pts.join(" ");
  };
  return (
    <g fill="none" strokeWidth="1">
      <path d={`M20 110 ${roof}`} stroke={S} />
      <line x1="20" y1="110" x2="20" y2="460" stroke={S} />
      <line x1="404" y1="110" x2="404" y2="460" stroke={S} />
      <line x1="0" y1="460" x2="400" y2="460" stroke={S2} />
      {/* robot arm */}
      <g stroke={S2} strokeWidth="1.4">
        <rect x="80" y="420" width="60" height="40" />
        <line x1="110" y1="420" x2="150" y2="320" />
        <line x1="150" y1="320" x2="240" y2="290" />
        <line x1="240" y1="290" x2="262" y2="345" />
        <circle cx="110" cy="420" r="9" />
        <circle cx="150" cy="320" r="8" />
        <circle cx="240" cy="290" r="7" />
      </g>
      <circle cx="262" cy="350" r="5" fill={GR} className="ind-anim ind-blink" />
      {/* conveyor */}
      <line x1="40" y1="395" x2="400" y2="395" stroke={S} />
      <line x1="40" y1="405" x2="400" y2="405" stroke={S} />
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={i} cx={52 + i * 36} cy="400" r="4" stroke={S} />
      ))}
      <g className="ind-anim ind-move">
        {[200, 300, 400].map((x) => (
          <rect key={x} x={x} y="372" width="30" height="22" stroke={CY} />
        ))}
      </g>
      <polygon points={gear(330, 190, 30)} stroke={S2} className="ind-anim ind-spin" style={{ transformOrigin: "330px 190px" }} />
      <circle cx="330" cy="190" r="10" stroke={S2} />
      <polygon points={gear(282, 232, 18, 8)} stroke={S} className="ind-anim ind-spin-rev" style={{ transformOrigin: "282px 232px" }} />
    </g>
  );
}

function SmartBuildings() {
  const floors = Array.from({ length: 16 }, (_, i) => 90 + i * 23);
  return (
    <g fill="none" strokeWidth="1">
      <path d="M120 460 V80 L200 50 L280 80 V460" stroke={S2} />
      <line x1="200" y1="50" x2="200" y2="14" stroke={S2} />
      <circle cx="200" cy="14" r="4" fill={CY} className="ind-anim ind-blink" />
      {floors.map((y, i) => (
        <g key={y}>
          <line x1="120" y1={y} x2="280" y2={y} stroke={S} />
          {[0, 1, 2, 3, 4, 5].map((c) => (
            <rect
              key={c}
              x={128 + c * 25}
              y={y + 5}
              width="18"
              height="13"
              stroke={S}
              fill={(i * 7 + c * 3) % 5 === 0 ? CY : "none"}
              fillOpacity={0.35}
              className={(i * 7 + c * 3) % 5 === 0 ? "ind-anim ind-blink-slow" : ""}
              style={{ animationDelay: `${((i + c) % 6) * 0.4}s` }}
            />
          ))}
          <circle cx="300" cy={y + 11} r="2.6" fill={GR} />
          <line x1="280" y1={y + 11} x2="297" y2={y + 11} stroke={GR} strokeOpacity="0.5" />
        </g>
      ))}
      <line x1="300" y1="80" x2="300" y2="460" stroke={GR} strokeDasharray="3 5" className="ind-anim ind-dash-up" />
      <line x1="40" y1="460" x2="360" y2="460" stroke={S2} />
    </g>
  );
}

function Telecom() {
  const lattice: string[] = [];
  for (let i = 0; i < 9; i++) {
    const y0 = 460 - i * 42;
    const y1 = y0 - 42;
    const w0 = 50 - i * 4.8;
    const w1 = 50 - (i + 1) * 4.8;
    lattice.push(`M${200 - w0} ${y0} L${200 - w1} ${y1} M${200 + w0} ${y0} L${200 + w1} ${y1} M${200 - w0} ${y0} L${200 + w1} ${y1} M${200 + w0} ${y0} L${200 - w1} ${y1} M${200 - w1} ${y1} H${200 + w1}`);
  }
  return (
    <g fill="none" strokeWidth="1">
      <path d={lattice.join(" ")} stroke={S2} />
      {[-1, 1].map((d) => (
        <rect key={d} x={200 + d * 14 - 5} y="70" width="10" height="34" stroke={S2} />
      ))}
      {[1, 2, 3].map((i) => (
        <g key={i} className="ind-anim ind-ping" style={{ animationDelay: `${i * 0.5}s`, transformOrigin: "200px 88px" }}>
          <path d={`M${200 - 40 * i} ${88 - 26 * i} A ${48 * i} ${48 * i} 0 0 0 ${200 - 40 * i} ${88 + 26 * i}`} stroke={CY} />
          <path d={`M${200 + 40 * i} ${88 - 26 * i} A ${48 * i} ${48 * i} 0 0 1 ${200 + 40 * i} ${88 + 26 * i}`} stroke={CY} />
        </g>
      ))}
      <line x1="0" y1="460" x2="400" y2="460" stroke={S2} />
      <path d="M200 470 H360 V440 H390" stroke={CY} strokeDasharray="4 5" className="ind-anim ind-dash" />
      <rect x="340" y="420" width="44" height="40" stroke={S2} />
    </g>
  );
}

function Government() {
  return (
    <g fill="none" strokeWidth="1">
      <circle cx="200" cy="270" r="170" stroke={CY} strokeDasharray="3 7" strokeOpacity="0.7" className="ind-anim ind-spin-slow" style={{ transformOrigin: "200px 270px" }} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={200 + Math.cos(a) * 170} cy={270 + Math.sin(a) * 170} r="3.2" fill={CY} />;
      })}
      <path d="M90 200 L200 140 L310 200 Z" stroke={S2} />
      <rect x="90" y="200" width="220" height="14" stroke={S2} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} stroke={S2}>
          <line x1={108 + i * 37} y1="214" x2={108 + i * 37} y2="350" />
          <line x1={120 + i * 37} y1="214" x2={120 + i * 37} y2="350" />
        </g>
      ))}
      <path d="M80 350 H320 M70 362 H330 M60 374 H340" stroke={S2} />
      <path d="M200 160 c 0 0 12 6 22 6 v 14 c 0 12 -10 20 -22 24 c -12 -4 -22 -12 -22 -24 v -14 c 10 0 22 -6 22 -6 z" stroke={GR} transform="translate(0 -6) scale(1)" className="ind-anim ind-blink-slow" />
    </g>
  );
}

function Cloud() {
  const slab = (y: number) => `M120 ${y} L200 ${y - 40} L280 ${y} L200 ${y + 40} Z`;
  return (
    <g fill="none" strokeWidth="1">
      {[380, 330, 280].map((y, i) => (
        <g key={y}>
          <path d={slab(y)} stroke={S2} />
          <path d={`M120 ${y} V${y + 14} L200 ${y + 54} L280 ${y + 14} V${y}`} stroke={S} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={150 + k * 16} cy={y + 18 + k * 8} r="1.8" fill={i === 1 ? CY : GR} className="ind-anim ind-blink" style={{ animationDelay: `${(i + k) * 0.3}s` }} />
          ))}
        </g>
      ))}
      <path d="M110 140 a 40 40 0 0 1 60 -44 a 50 50 0 0 1 92 14 a 34 34 0 0 1 28 60 H120 a 30 30 0 0 1 -10 -30 z" stroke={CY} />
      {[
        [150, 170],
        [200, 170],
        [250, 170],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={200} y2={240} stroke={CY} strokeDasharray="3 5" className="ind-anim ind-dash" />
          <circle cx={x} cy={y} r="3.5" fill={CY} />
        </g>
      ))}
      {[
        [60, 260],
        [340, 250],
        [70, 420],
        [330, 430],
      ].map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={200} y2={330} stroke={S} />
          <circle cx={x} cy={y} r="3" fill={GR} />
        </g>
      ))}
    </g>
  );
}

function Energy() {
  const tower = (x: number, h: number) => `M${x - 26} 460 L${x - 6} ${460 - h} L${x + 6} ${460 - h} L${x + 26} 460 M${x - 20} ${460 - h * 0.3} H${x + 20} M${x - 14} ${460 - h * 0.6} H${x + 14} M${x - 40} ${460 - h * 0.82} H${x + 40} M${x - 30} ${460 - h * 0.95} H${x + 30} M${x - 26} 460 L${x + 14} ${460 - h * 0.6} M${x + 26} 460 L${x - 14} ${460 - h * 0.6}`;
  const cat = (x0: number, y0: number, x1: number, y1: number, sag = 30) => `M${x0} ${y0} Q ${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag} ${x1} ${y1}`;
  return (
    <g fill="none" strokeWidth="1">
      <path d={tower(110, 300)} stroke={S2} />
      <path d={tower(310, 260)} stroke={S2} />
      {[
        [-40, 0],
        [40, 0],
        [-30, 0.13],
        [30, 0.13],
      ].map(([dx, k], i) => {
        const y0 = 460 - 300 * (0.82 + k);
        const y1 = 460 - 260 * (0.82 + k);
        return (
          <g key={i}>
            <path d={cat(-10, y0 + 20, 110 + dx, y0)} stroke={S} />
            <path d={cat(110 + dx, y0, 310 + dx * 0.9, y1)} stroke={BL} strokeDasharray="8 8" className="ind-anim ind-dash" />
            <path d={cat(310 + dx * 0.9, y1, 420, y1 + 30)} stroke={S} />
          </g>
        );
      })}
      <line x1="0" y1="460" x2="400" y2="460" stroke={S2} />
      {[150, 210, 270].map((x) => (
        <g key={x}>
          <rect x={x - 22} y="410" width="44" height="50" stroke={S2} />
          <circle cx={x} cy="430" r="8" stroke={BL} />
          <circle cx={x} cy="442" r="8" stroke={BL} />
        </g>
      ))}
    </g>
  );
}

function Security() {
  return (
    <g fill="none" strokeWidth="1">
      <rect x="30" y="60" width="340" height="400" stroke={S} strokeDasharray="6 6" />
      <rect x="70" y="110" width="260" height="300" stroke={S2} />
      <rect x="120" y="170" width="160" height="180" stroke={S2} />
      <circle cx="200" cy="260" r="46" stroke={CY} />
      <circle cx="200" cy="260" r="34" stroke={S2} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={200 + Math.cos(a) * 10} y1={260 + Math.sin(a) * 10} x2={200 + Math.cos(a) * 34} y2={260 + Math.sin(a) * 34} stroke={S2} />;
      })}
      <circle cx="200" cy="260" r="6" fill={GR} className="ind-anim ind-blink-slow" />
      {[
        [70, 110, 1, 1],
        [330, 110, -1, 1],
        [70, 410, 1, -1],
        [330, 410, -1, -1],
      ].map(([x, y, dx, dy], i) => (
        <g key={i}>
          <path d={`M${x} ${y} L${x + dx * 120} ${y + dy * 40} L${x + dx * 40} ${y + dy * 120} Z`} fill={CY} fillOpacity="0.06" stroke={CY} strokeOpacity="0.4" className="ind-anim ind-sweep" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.6}s` }} />
          <rect x={x - 6} y={y - 6} width="12" height="12" fill="var(--color-ink)" stroke={S2} />
        </g>
      ))}
      {[200].map((x) => (
        <g key={x}>
          <rect x={x - 14} y="404" width="28" height="12" fill="var(--color-ink)" stroke={GR} />
          <rect x={x - 14} y="344" width="28" height="12" fill="var(--color-ink)" stroke={GR} />
        </g>
      ))}
    </g>
  );
}

const SCENES: Record<IndustryId, () => React.JSX.Element> = {
  datacenters: Datacenters,
  industrial: Industrial,
  "smart-buildings": SmartBuildings,
  telecom: Telecom,
  government: Government,
  cloud: Cloud,
  energy: Energy,
  security: Security,
};

export function IndustryScene({ id, className }: { id: IndustryId; className?: string }) {
  const Scene = SCENES[id];
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <Scene />
    </svg>
  );
}
