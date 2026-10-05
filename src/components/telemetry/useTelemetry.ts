"use client";

import { useCallback, useReducer } from "react";
import { useInterval } from "@/lib/hooks";

/*
 * SIMULATED TELEMETRY.
 * Every value produced here is synthetic and exists purely to demonstrate the
 * interface. Nothing represents a real Armtronix facility or measured data.
 */

export type Status = "ok" | "warn" | "fault";
export type Scenario = "normal" | "cooling" | "surge";

export type Rack = { id: string; row: 0 | 1; idx: number; temp: number; kw: number; status: Status; base: number };
export type Crah = { id: string; fan: number; supply: number; status: Status };
export type LogEvent = { id: number; time: string; level: "info" | "warn" | "auto" | "ok"; msg: string };

export type Sim = {
  tick: number;
  racks: Rack[];
  crah: Crah[];
  voltage: number;
  frequency: number;
  latency: number;
  linksUp: number;
  linksTotal: number;
  sensorsOnline: number;
  sensorsTotal: number;
  health: number;
  history: { temp: number[]; power: number[]; voltage: number[] };
  scenario: Scenario;
  scenarioT: number;
  events: LogEvent[];
  eventSeq: number;
};

const HISTORY = 48;
export const RACKS_PER_ROW = 8;
const HOT_ZONE = [2, 3, 4]; // rack indices served primarily by CRAH-02

const hash = (i: number) => {
  const x = Math.sin(i * 91.17 + 3.3) * 10000;
  return x - Math.floor(x);
};
const jitter = (amp: number) => (Math.random() - 0.5) * 2 * amp;
const r1 = (v: number) => Math.round(v * 10) / 10;

function initial(): Sim {
  const racks: Rack[] = [];
  for (const row of [0, 1] as const) {
    for (let i = 0; i < RACKS_PER_ROW; i++) {
      const k = row * RACKS_PER_ROW + i;
      const base = 4.2 + hash(k) * 3.2;
      racks.push({
        id: `${row === 0 ? "A" : "B"}-${String(i + 1).padStart(2, "0")}`,
        row,
        idx: i,
        base,
        kw: r1(base),
        temp: r1(22.4 + hash(k + 40) * 2.4),
        status: "ok",
      });
    }
  }
  const totalKw = racks.reduce((a, r) => a + r.kw, 0);
  const avgT = racks.reduce((a, r) => a + r.temp, 0) / racks.length;
  return {
    tick: 0,
    racks,
    crah: [
      { id: "CRAH-01", fan: 62, supply: 18.4, status: "ok" },
      { id: "CRAH-02", fan: 60, supply: 18.6, status: "ok" },
      { id: "CRAH-03", fan: 61, supply: 18.5, status: "ok" },
    ],
    voltage: 415,
    frequency: 50,
    latency: 0.42,
    linksUp: 24,
    linksTotal: 24,
    sensorsOnline: 128,
    sensorsTotal: 128,
    health: 98.6,
    history: {
      temp: Array.from({ length: HISTORY }, (_, i) => avgT + Math.sin(i / 5) * 0.15),
      power: Array.from({ length: HISTORY }, (_, i) => totalKw + Math.sin(i / 4) * 1.2),
      voltage: Array.from({ length: HISTORY }, (_, i) => 415 + Math.sin(i / 3) * 0.6),
    },
    scenario: "normal",
    scenarioT: 0,
    events: [
      { id: 2, time: "SYNC", level: "ok", msg: "All systems nominal · digital twin synchronised" },
      { id: 1, time: "SYNC", level: "info", msg: "Sensor array online · 128/128" },
    ],
    eventSeq: 2,
  };
}

const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

function push(s: Sim, level: LogEvent["level"], msg: string): Sim {
  const id = s.eventSeq + 1;
  return { ...s, eventSeq: id, events: [{ id, time: stamp(), level, msg }, ...s.events].slice(0, 8) };
}

type Action = { type: "tick" } | { type: "scenario"; scenario: Scenario } | { type: "reset" };

function step(prev: Sim): Sim {
  let s: Sim = { ...prev, tick: prev.tick + 1, scenarioT: prev.scenario === "normal" ? 0 : prev.scenarioT + 1 };
  const T = s.scenarioT;
  const crah = s.crah.map((c) => ({ ...c }));

  // --- Scenario scripts -------------------------------------------------------
  if (s.scenario === "cooling") {
    if (T === 1) {
      crah[1].status = "fault";
      crah[1].fan = 0;
      s = push(s, "warn", "CRAH-02 · fan failure detected · zone B airflow lost");
    }
    if (T === 4) s = push(s, "warn", "Rack inlet temperature rising · A-03 / B-04");
    if (T === 5) {
      s = push(s, "auto", "AUTOMATION · CRAH-01 / CRAH-03 fan speed → 88%");
    }
    if (T === 9) s = push(s, "auto", "AUTOMATION · Airflow rebalanced across cold aisle");
    if (T === 13) s = push(s, "info", "CRAH-02 isolated · maintenance work order raised");
    if (T === 18) {
      crah[1].status = "ok";
      crah[1].fan = 60;
      s = push(s, "ok", "CRAH-02 restored · returning to nominal");
    }
    if (T >= 5 && T < 18) {
      crah[0].fan = Math.min(88, crah[0].fan + 6);
      crah[2].fan = Math.min(88, crah[2].fan + 6);
    }
    if (T >= 22) {
      s = push({ ...s, scenario: "normal" }, "ok", "All systems nominal");
    }
  }
  if (s.scenario === "surge") {
    if (T === 1) s = push(s, "warn", "Row B · IT load step detected (+18%)");
    if (T === 3) s = push(s, "auto", "AUTOMATION · Load balanced across PDU-A / PDU-B");
    if (T === 6) s = push(s, "auto", "AUTOMATION · CRAH setpoint pre-cooled for row B");
    if (T === 12) s = push({ ...s, scenario: "normal" }, "ok", "Load normalised · all systems nominal");
  }
  if (s.scenario === "normal") {
    crah.forEach((c) => {
      if (c.status === "ok") c.fan = Math.round(c.fan + (61 - c.fan) * 0.25 + jitter(0.6));
    });
  }

  // --- Physics-ish update -----------------------------------------------------
  const coolingLost = s.scenario === "cooling" && T >= 1 && T < 18;
  const compensating = s.scenario === "cooling" && T >= 5;
  const surge = s.scenario === "surge" && T >= 1 && T < 10;

  const racks = s.racks.map((r) => {
    let targetKw = r.base * (surge && r.row === 1 ? 1.18 : 1);
    targetKw += Math.sin((s.tick + r.idx * 3) / 6) * 0.15;
    const kw = r1(r.kw + (targetKw - r.kw) * 0.35 + jitter(0.05));

    let targetT = 22.6 + (r.base - 4.2) * 0.55;
    if (coolingLost && HOT_ZONE.includes(r.idx)) targetT += compensating ? 1.6 : 5.2;
    if (surge && r.row === 1) targetT += 0.9;
    const temp = r1(r.temp + (targetT - r.temp) * (coolingLost ? 0.22 : 0.3) + jitter(0.06));
    const status: Status = temp >= 28 ? "fault" : temp >= 26.2 ? "warn" : "ok";
    return { ...r, kw, temp, status };
  });

  const totalKw = racks.reduce((a, r) => a + r.kw, 0);
  const avgT = racks.reduce((a, r) => a + r.temp, 0) / racks.length;
  const voltage = r1(415 + jitter(0.8) - (surge ? 2.6 : 0));
  crah.forEach((c) => (c.supply = r1(c.status === "fault" ? c.supply + 0.4 : 18.4 + jitter(0.1) + (surge ? -0.4 : 0))));
  const warnCount = racks.filter((r) => r.status !== "ok").length + crah.filter((c) => c.status !== "ok").length;

  return {
    ...s,
    racks,
    crah,
    voltage,
    frequency: Math.round((50 + jitter(0.02)) * 100) / 100,
    latency: Math.round((0.42 + jitter(0.04) + (surge ? 0.08 : 0)) * 100) / 100,
    health: r1(Math.max(91, 98.6 - warnCount * 1.1 + jitter(0.1))),
    history: {
      temp: [...s.history.temp.slice(1), avgT],
      power: [...s.history.power.slice(1), totalKw],
      voltage: [...s.history.voltage.slice(1), voltage],
    },
  };
}

function reducer(s: Sim, a: Action): Sim {
  switch (a.type) {
    case "tick":
      return step(s);
    case "scenario":
      if (s.scenario !== "normal") return s;
      return push({ ...s, scenario: a.scenario, scenarioT: 0 }, "info", a.scenario === "cooling" ? "Scenario · cooling unit failure (simulated)" : "Scenario · load surge (simulated)");
    case "reset":
      return push({ ...initial(), events: s.events, eventSeq: s.eventSeq }, "ok", "Simulation reset · all systems nominal");
  }
}

export function useTelemetry(active: boolean) {
  const [sim, dispatch] = useReducer(reducer, undefined, initial);
  useInterval(() => dispatch({ type: "tick" }), 900, active);
  const run = useCallback((scenario: Scenario) => dispatch({ type: "scenario", scenario }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  return { sim, run, reset };
}
