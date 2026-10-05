"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";
import { useInView, useInterval, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { StatusDot } from "@/components/ui/StatusDot";
import { FloorPlan, heat, type Selection } from "./FloorPlan";
import { useTelemetry, type Sim, type Status } from "./useTelemetry";

function Sparkline({ values, color, className }: { values: number[]; color: string; className?: string }) {
  const id = useId();
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 0.001);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / range) * 24 - 2}`);
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn("h-8 w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,30 ${pts.join(" ")} 100,30`} fill={`url(#${id})`} />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const tone: Record<Status, "green" | "amber" | "red"> = { ok: "green", warn: "amber", fault: "red" };

function Metric({
  label,
  value,
  unit,
  status = "ok",
  children,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  status?: Status;
  children?: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="bg-panel/60 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="tech-label text-[9.5px] text-dim">{label}</span>
        <StatusDot tone={tone[status]} pulse={status !== "ok"} />
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className={cn("font-mono text-[22px] tabular-nums tracking-tight transition-colors", status === "ok" ? "text-white" : status === "warn" ? "text-amber" : "text-red")}>
          {value}
        </span>
        <span className="font-mono text-[11px] text-mute">{unit}</span>
      </div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-dim">{sub}</div>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

const subscribeClock = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};
const clockSnapshot = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

function Clock() {
  const time = useSyncExternalStore(subscribeClock, clockSnapshot, () => "--:--:--");
  return <span className="tabular-nums">{time}</span>;
}

function summary(sim: Sim) {
  const racks = sim.racks;
  const avgT = racks.reduce((a, r) => a + r.temp, 0) / racks.length;
  const maxT = Math.max(...racks.map((r) => r.temp));
  const kw = racks.reduce((a, r) => a + r.kw, 0);
  const tempStatus: Status = maxT >= 28 ? "fault" : maxT >= 26.2 ? "warn" : "ok";
  const coolingStatus: Status = sim.crah.some((c) => c.status === "fault") ? "fault" : "ok";
  const alert = tempStatus !== "ok" || coolingStatus !== "ok" || sim.scenario === "surge";
  return { avgT, maxT, kw, tempStatus, coolingStatus, alert };
}

export function TelemetryConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { rootMargin: "100px 0px" });
  const reduced = useReducedMotion();
  const { sim, run, reset } = useTelemetry(visible);
  const [selected, setSelected] = useState<Selection>({ kind: "rack", id: "A-04" });
  const s = summary(sim);
  const rack = selected.kind === "rack" ? sim.racks.find((r) => r.id === selected.id) : undefined;
  const crah = selected.kind === "crah" ? sim.crah.find((c) => c.id === selected.id) : undefined;
  const busy = sim.scenario !== "normal";

  // Gentle auto-inspection: cycle the selected rack while the user hasn't interacted.
  const [touched, setTouched] = useState(false);
  useInterval(
    () => {
      const ids = sim.racks.map((r) => r.id);
      const i = ids.indexOf(selected.kind === "rack" ? selected.id : "");
      setSelected({ kind: "rack", id: ids[(i + 5) % ids.length] });
    },
    4200,
    visible && !touched && !reduced,
  );
  const select = (sel: Selection) => {
    setTouched(true);
    setSelected(sel);
  };

  return (
    <div ref={ref} className="relative overflow-hidden border border-steel bg-graphite/70 shadow-[0_40px_120px_-40px_rgba(0,200,232,0.18)]">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-steel px-4 py-3 sm:px-5">
        <span className="font-mono text-[11px] tracking-[0.14em] text-white">ATX·OPS</span>
        <span className="tech-label text-[10px] text-mute">Data hall 01 · Digital twin</span>
        <span className="tech-label border border-amber/40 bg-amber/10 px-2 py-0.5 text-[9.5px] text-amber">Simulated telemetry · UI demonstration</span>
        <span className="ml-auto flex items-center gap-4">
          <span className={cn("tech-label flex items-center gap-2 text-[10px]", s.alert ? "text-amber" : "text-green")} aria-live="polite">
            <StatusDot tone={s.alert ? "amber" : "green"} />
            {s.alert ? (sim.scenario === "surge" ? "Load event · automation active" : "Alert · automation responding") : "All systems nominal"}
          </span>
          <span className="hidden font-mono text-[11px] text-dim sm:inline">
            <Clock /> MYT
          </span>
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-px border-b border-steel bg-steel/60 sm:grid-cols-3 xl:grid-cols-6">
          <Metric label="Temperature · avg inlet" value={s.avgT.toFixed(1)} unit="°C" status={s.tempStatus} sub={`max ${s.maxT.toFixed(1)} °C`}>
            <Sparkline values={sim.history.temp} color={s.tempStatus === "ok" ? "#00C8E8" : "#FFB547"} />
          </Metric>
          <Metric label="Power · IT load" value={s.kw.toFixed(1)} unit="kW" status={sim.scenario === "surge" ? "warn" : "ok"}>
            <Sparkline values={sim.history.power} color="#168BFF" />
          </Metric>
          <Metric label="Voltage · L-L" value={sim.voltage.toFixed(1)} unit="V" sub={`${sim.frequency.toFixed(2)} Hz`}>
            <Sparkline values={sim.history.voltage} color="#168BFF" />
          </Metric>
          <Metric
            label="Cooling · CRAH"
            value={`${sim.crah.filter((c) => c.status === "ok").length}/${sim.crah.length}`}
            unit="units"
            status={s.coolingStatus}
            sub={`supply ${sim.crah[0].supply.toFixed(1)} °C`}
          />
          <Metric label="Network" value={`${sim.linksUp}/${sim.linksTotal}`} unit="links" sub={`latency ${sim.latency.toFixed(2)} ms`} />
          <Metric label="Equipment health" value={sim.health.toFixed(1)} unit="%" status={sim.health < 95 ? "warn" : "ok"} sub={`sensors ${sim.sensorsOnline}/${sim.sensorsTotal} online`} />
      </div>

      <div className="grid lg:grid-cols-12">
        {/* Floor plan */}
        <div className="relative border-b border-steel p-3 sm:p-5 lg:col-span-8 lg:border-b-0">
          <div className="mb-2 flex items-center justify-between">
            <span className="tech-label text-[9.5px] text-dim">Plan view · level 01</span>
            <span className="tech-label hidden text-[9.5px] text-dim sm:inline">Select an asset to inspect</span>
          </div>
          <FloorPlan racks={sim.racks} crah={sim.crah} selected={selected} onSelect={select} animate={visible && !reduced} />
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] text-mute">
            <span className="flex items-center gap-2">
              <span className="h-px w-4 bg-blue" /> Power
            </span>
            <span className="flex items-center gap-2">
              <span className="h-px w-4 border-t border-dashed border-cyan" /> Data / airflow
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-green" /> Sensor
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <span>21°</span>
              <span className="h-1.5 w-16" style={{ background: `linear-gradient(90deg, ${heat(21)}, ${heat(24)}, ${heat(26.5)}, ${heat(29)})` }} />
              <span>29°C</span>
            </span>
          </div>
        </div>

        {/* Inspector + scenarios + log */}
        <div className="flex flex-col lg:col-span-4 lg:border-l lg:border-steel">
          <div className="border-b border-steel p-4">
            <span className="tech-label text-[9.5px] text-dim">Inspector</span>
            {rack && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[15px] text-white">Rack {rack.id}</span>
                  <span className={cn("tech-label text-[9.5px]", rack.status === "ok" ? "text-green" : rack.status === "warn" ? "text-amber" : "text-red")}>
                    {rack.status === "ok" ? "Nominal" : rack.status === "warn" ? "Elevated" : "Critical"}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]">
                  <dt className="text-dim">Inlet</dt>
                  <dd className="text-right tabular-nums text-white">{rack.temp.toFixed(1)} °C</dd>
                  <dt className="text-dim">Power</dt>
                  <dd className="text-right tabular-nums text-white">{rack.kw.toFixed(1)} kW</dd>
                  <dt className="text-dim">Feed</dt>
                  <dd className="text-right text-white">PDU-{rack.row === 0 ? "A" : "B"}</dd>
                  <dt className="text-dim">Cooling</dt>
                  <dd className="text-right text-white">{[2, 3, 4].includes(rack.idx) ? "CRAH-02" : rack.idx < 2 ? "CRAH-01" : "CRAH-03"}</dd>
                </dl>
              </div>
            )}
            {crah && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[15px] text-white">{crah.id}</span>
                  <span className={cn("tech-label text-[9.5px]", crah.status === "ok" ? "text-green" : "text-red")}>{crah.status === "ok" ? "Running" : "Fault"}</span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]">
                  <dt className="text-dim">Fan speed</dt>
                  <dd className="text-right tabular-nums text-white">{crah.fan}%</dd>
                  <dt className="text-dim">Supply air</dt>
                  <dd className="text-right tabular-nums text-white">{crah.supply.toFixed(1)} °C</dd>
                </dl>
                <div className="mt-3 h-1 w-full bg-steel">
                  <div className="h-1 bg-cyan transition-[width] duration-700" style={{ width: `${crah.fan}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="border-b border-steel p-4">
            <span className="tech-label text-[9.5px] text-dim">Run a scenario</span>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  run("cooling");
                  select({ kind: "rack", id: "A-04" });
                }}
                className="border border-steel-2 px-3 py-2 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-white transition-colors hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cooling fault
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  run("surge");
                  select({ kind: "rack", id: "B-06" });
                }}
                className="border border-steel-2 px-3 py-2 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-white transition-colors hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-40"
              >
                Load surge
              </button>
            </div>
            <button type="button" onClick={reset} className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-dim transition-colors hover:text-cyan">
              ↻ Reset simulation
            </button>
          </div>

          <div className="flex-1 p-4">
            <span className="tech-label text-[9.5px] text-dim">Event log</span>
            <ol className="mt-3 grid gap-2" aria-live="polite" aria-relevant="additions">
              {sim.events.slice(0, 6).map((e, i) => (
                <li key={e.id} className={cn("grid grid-cols-[auto_1fr] gap-x-2 font-mono text-[10.5px] leading-snug transition-opacity", i > 3 && "opacity-50")}>
                  <span className="text-dim">{e.time}</span>
                  <span className={cn(e.level === "warn" && "text-amber", e.level === "auto" && "text-cyan", e.level === "ok" && "text-green", e.level === "info" && "text-mute")}>{e.msg}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
