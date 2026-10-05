"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import {
  C,
  CameraRig,
  FlowLine,
  GridPlane,
  LabelAnchor,
  LensShift,
  Packets,
  SensorNode,
  boxEdgesGeometry,
  catenary,
  transmissionTower,
  segmentsGeometry,
  smooth,
  span,
  useMotion,
  type BoxSpec,
  type V3,
} from "./primitives";
import { BOOT_DURATION, stageAt, useBoot } from "./bootStore";
import { HERO_LABELS } from "./sceneLabels";
import type { LabelRegistry } from "./labelRegistry";

/* ------------------------------------------------------------------ */
/* Boot progress (0 → 1) shared with every element via context         */
/* ------------------------------------------------------------------ */

const BootCtx = createContext<{ current: number }>({ current: 1 });
const useProgress = () => useContext(BootCtx);

/** Returns a per-frame getter for the eased progress of a boot window. */
function useWindow(a: number, b: number) {
  const p = useProgress();
  return useMemo(() => () => smooth(span(p.current, a, b)), [p, a, b]);
}

const W = {
  ground: [0.0, 0.06],
  slab: [0.02, 0.09],
  frame: [0.07, 0.17],
  fitout: [0.13, 0.2],
  power: [0.2, 0.34],
  network: [0.36, 0.5],
  sensors: [0.5, 0.62],
  data: [0.64, 0.78],
  scan: [0.8, 0.93],
  intel: [0.86, 1.0],
} as const;

function BootDriver() {
  const progress = useProgress();
  const { reduced } = useMotion();
  const run = useBoot((s) => s.run);
  const setStage = useBoot((s) => s.setStage);
  const last = useRef({ run, stage: -2, delay: 0.35 });

  useFrame((_, dt) => {
    const l = last.current;
    if (l.run !== run) {
      l.run = run;
      progress.current = 0;
      l.delay = 0.25;
    }
    if (reduced) progress.current = 1;
    else if (l.delay > 0) l.delay -= dt;
    else if (progress.current < 1) progress.current = Math.min(1, progress.current + Math.min(dt, 1 / 30) / BOOT_DURATION);
    const s = stageAt(progress.current);
    if (s !== l.stage) {
      l.stage = s;
      setStage(s);
    }
  });
  return null;
}

/** Grows its children up from the ground plane over a boot window. */
function Rise({ win, children, position }: { win: readonly [number, number]; children: ReactNode; position?: V3 }) {
  const g = useRef<THREE.Group>(null);
  const f = useWindow(win[0], win[1]);
  useFrame(() => {
    if (!g.current) return;
    const v = f();
    g.current.scale.y = Math.max(v, 0.0001);
    g.current.visible = v > 0.001;
  });
  return (
    <group ref={g} position={position}>
      {children}
    </group>
  );
}

/** Creates a material whose opacity follows a boot window. */
function useFadingMaterial<T extends THREE.Material>(make: () => T, win: readonly [number, number], max = 1) {
  const [mat] = useState(make);
  const f = useWindow(win[0], win[1]);
  useFrame(() => {
    mat.opacity = f() * max;
    mat.visible = mat.opacity > 0.003;
  });
  return mat;
}

const fadingStandard = (color: string) => () =>
  new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0, depthWrite: false, roughness: 0.9 });
const fadingLine = (color: string) => () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });

/* ------------------------------------------------------------------ */
/* Facility definition                                                 */
/* ------------------------------------------------------------------ */

const TOP = 0.35;
const COL_H = 3.3;
const BEAM_Y = TOP + COL_H + 0.1;
const COL_X = [-5, -2.5, 0, 2.5, 5];
const COL_Z = [-3.2, 3.2];
const BUS_Y = 2.55;
const TRAY_Y = 2.85;
const ROW_Z = [-1.05, 1.05];
const CORE: V3 = [-0.8, 7.1, -0.6];
// Grid feed: a transmission tower in line with the yard gantry, phases along Z.
const GANTRY_X = -9.2;
const LINE_Z = -4.8;
const HERO_TOWER = transmissionTower(5.4, 1.15, 0.34, 1.0);
const HERO_TOWER_X = -13.4;
const HERO_PHASES = HERO_TOWER.attach.map((a) => a[2]);

const concrete = new THREE.MeshStandardMaterial({ color: "#1A2228", roughness: 0.95, metalness: 0.05 });
const steel = new THREE.MeshStandardMaterial({ color: "#33434D", roughness: 0.45, metalness: 0.65 });
const darkSteel = new THREE.MeshStandardMaterial({ color: "#151C21", roughness: 0.6, metalness: 0.5 });

function rackLayout(perRow: number) {
  const racks: { p: V3; row: number; i: number }[] = [];
  const spacing = 0.66;
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i < perRow; i++) {
      const x = (i - (perRow - 1) / 2) * spacing + 0.2;
      racks.push({ p: [x, TOP + 1.0, ROW_Z[r]], row: r, i });
    }
  }
  return racks;
}

/** Specs reused by both the physical meshes and the cyan digital-twin overlay. */
function useFacilitySpecs(perRow: number) {
  return useMemo(() => {
    const slab: BoxSpec = { p: [0, TOP / 2, 0], s: [11, TOP, 7] };
    const columns: BoxSpec[] = COL_X.flatMap((x) => COL_Z.map((z) => ({ p: [x, TOP + COL_H / 2, z] as V3, s: [0.18, COL_H, 0.18] as V3 })));
    const beams: BoxSpec[] = [
      { p: [0, BEAM_Y, -3.2], s: [10.18, 0.2, 0.16] },
      { p: [0, BEAM_Y, 3.2], s: [10.18, 0.2, 0.16] },
      ...COL_X.map((x) => ({ p: [x, BEAM_Y, 0] as V3, s: [0.16, 0.2, 6.56] as V3 })),
    ];
    const deck: BoxSpec = { p: [0, BEAM_Y + 0.14, -1.6], s: [10.2, 0.08, 3.3] };
    const units: BoxSpec[] = [-3, 0, 3].map((x) => ({ p: [x, BEAM_Y + 0.5, -1.6] as V3, s: [1.8, 0.62, 1.4] as V3 }));
    const racks = rackLayout(perRow);
    const rackBoxes: BoxSpec[] = racks.map((r) => ({ p: r.p, s: [0.6, 2.0, 1.0] }));
    const pdus: BoxSpec[] = ROW_Z.map((z) => ({ p: [-4.4, TOP + 0.9, z] as V3, s: [0.5, 1.8, 1.0] as V3 }));
    const ups: BoxSpec = { p: [-4.4, TOP + 0.7, -2.3], s: [0.7, 1.4, 0.8] };
    const trays: BoxSpec[] = ROW_Z.map((z) => ({ p: [0.3, TRAY_Y, z] as V3, s: [9.0, 0.05, 0.34] as V3 }));
    const transformer: BoxSpec = { p: [-7.6, 0.12 + 0.55, -4.8], s: [1.3, 1.1, 1.0] };
    const pad: BoxSpec = { p: [-7.6, 0.06, -4.8], s: [3, 0.12, 2.4] };
    const twin = boxEdgesGeometry([slab, ...columns, ...beams, deck, ...units, ...rackBoxes, ...pdus, ups, transformer, pad]);
    return { slab, columns, beams, deck, units, racks, rackBoxes, pdus, ups, trays, transformer, pad, twin };
  }, [perRow]);
}

/* ------------------------------------------------------------------ */
/* Physical layer                                                      */
/* ------------------------------------------------------------------ */

function Facility({ specs }: { specs: ReturnType<typeof useFacilitySpecs> }) {
  const wallMat = useFadingMaterial(fadingStandard("#0F161B"), W.frame, 0.5);
  const deckMat = useFadingMaterial(fadingStandard("#141B20"), W.fitout, 0.55);
  const hatch = useMemo(() => hatchGeometry(11, TOP), []);
  return (
    <group>
      {/* Foundation slab */}
      <Rise win={W.slab}>
        <mesh position={specs.slab.p} material={concrete}>
          <boxGeometry args={specs.slab.s} />
          <Edges color={C.edge} threshold={15} />
        </mesh>
        {/* Slab section hatch (front face) */}
        <lineSegments geometry={hatch} position={[0, 0, 3.502]}>
          <lineBasicMaterial color={C.steel2} transparent opacity={0.7} />
        </lineSegments>
      </Rise>

      {/* Steel frame — columns rise in sequence, then beams */}
      {specs.columns.map((c, i) => (
        <Rise key={i} win={[W.frame[0] + i * 0.004, W.frame[0] + 0.05 + i * 0.004]} position={[c.p[0], TOP, c.p[2]]}>
          <mesh position={[0, COL_H / 2, 0]} material={steel}>
            <boxGeometry args={c.s} />
          </mesh>
        </Rise>
      ))}
      <Rise win={[W.frame[0] + 0.05, W.frame[1]]} position={[0, BEAM_Y - 0.1, 0]}>
        {specs.beams.map((b, i) => (
          <mesh key={i} position={[b.p[0], 0.1, b.p[2]]} material={steel}>
            <boxGeometry args={b.s} />
          </mesh>
        ))}
      </Rise>

      {/* Cut-away envelope: back + side wall panels */}
      <mesh position={[0, TOP + COL_H / 2, -3.28]} material={wallMat}>
        <boxGeometry args={[10.2, COL_H, 0.05]} />
      </mesh>
      <mesh position={[-5.08, TOP + COL_H / 2, 0]} material={wallMat}>
        <boxGeometry args={[0.05, COL_H, 6.4]} />
      </mesh>

      {/* Roof deck (rear half) carrying cooling plant */}
      <mesh position={specs.deck.p} material={deckMat}>
        <boxGeometry args={specs.deck.s} />
      </mesh>

      <Rise win={W.fitout}>
        <Racks specs={specs} />
        {specs.pdus.map((b, i) => (
          <mesh key={i} position={b.p} material={darkSteel}>
            <boxGeometry args={b.s} />
            <Edges color={C.edge} />
          </mesh>
        ))}
        <mesh position={specs.ups.p} material={darkSteel}>
          <boxGeometry args={specs.ups.s} />
          <Edges color={C.edge} />
        </mesh>
        {specs.trays.map((b, i) => (
          <mesh key={i} position={b.p} material={steel}>
            <boxGeometry args={b.s} />
          </mesh>
        ))}
        {specs.units.map((b, i) => (
          <CoolingUnit key={i} spec={b} index={i} />
        ))}
      </Rise>

      <PowerYard specs={specs} />
      <FiberEntry />
    </group>
  );
}

/** Diagonal section hatching (ANSI31-style) for concrete in elevation. */
function hatchGeometry(width: number, height: number, step = 0.22) {
  const pairs: [V3, V3][] = [];
  for (let x = -width / 2 - height; x < width / 2; x += step) {
    const x0 = Math.max(x, -width / 2);
    const y0 = x0 - x;
    const x1 = Math.min(x + height, width / 2);
    const y1 = x1 - x;
    if (y0 <= height && y1 >= 0) pairs.push([[x0, y0, 0], [x1, Math.min(y1, height), 0]]);
  }
  return segmentsGeometry(pairs);
}

function Racks({ specs }: { specs: ReturnType<typeof useFacilitySpecs> }) {
  const body = useRef<THREE.InstancedMesh>(null);
  const leds = useRef<THREE.InstancedMesh>(null);
  const { reduced } = useMotion();
  const data = useWindow(W.data[0], W.data[1]);
  const power = useWindow(W.power[0], W.power[1]);
  const perRack = 5;
  const n = specs.racks.length;
  const edges = useMemo(() => boxEdgesGeometry(specs.rackBoxes), [specs.rackBoxes]);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const col = useMemo(() => new THREE.Color(), []);
  const ledSeeds = useMemo(() => Array.from({ length: n * perRack }, (_, i) => ((i * 7919) % 101) / 101), [n]);
  const timer = useRef(0);

  // Static instance transforms are written once on first frame.
  const placed = useRef(false);
  useFrame((state, dt) => {
    const b = body.current;
    const l = leds.current;
    if (!b || !l) return;
    if (!placed.current) {
      specs.racks.forEach((r, i) => {
        tmp.position.set(...r.p);
        tmp.scale.set(1, 1, 1);
        tmp.rotation.set(0, 0, 0);
        tmp.updateMatrix();
        b.setMatrixAt(i, tmp.matrix);
        const face = r.row === 0 ? -0.503 : 0.503;
        for (let k = 0; k < perRack; k++) {
          tmp.position.set(r.p[0] - 0.17, TOP + 0.45 + k * 0.32, r.p[2] + face);
          tmp.rotation.set(0, r.row === 0 ? Math.PI : 0, 0);
          tmp.updateMatrix();
          l.setMatrixAt(i * perRack + k, tmp.matrix);
        }
      });
      b.instanceMatrix.needsUpdate = true;
      l.instanceMatrix.needsUpdate = true;
      placed.current = true;
    }
    timer.current += dt;
    if (timer.current < 0.11 && placed.current && !reduced) return;
    timer.current = 0;
    const d = data();
    const pw = power();
    const t = state.clock.elapsedTime;
    for (let i = 0; i < n * perRack; i++) {
      const rack = Math.floor(i / perRack);
      const isCore = specs.racks[rack].i === Math.floor(specs.racks.length / 2) - 1;
      const blink = reduced ? 1 : Math.sin(t * (3 + ledSeeds[i] * 9) + ledSeeds[i] * 40) > -0.2 ? 1 : 0.25;
      if (d > 0.02) {
        col.set(isCore ? C.cyan : ledSeeds[i] > 0.82 ? C.cyan : C.green).multiplyScalar(0.25 + 0.75 * d * blink);
      } else {
        col.set(C.blue).multiplyScalar(0.12 + 0.35 * pw);
      }
      l.setColorAt(i, col);
    }
    if (l.instanceColor) l.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={body} args={[undefined, undefined, n]} material={darkSteel} frustumCulled={false}>
        <boxGeometry args={[0.6, 2.0, 1.0]} />
      </instancedMesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={C.edge} transparent opacity={0.85} />
      </lineSegments>
      <instancedMesh ref={leds} args={[undefined, undefined, n * perRack]} frustumCulled={false}>
        <planeGeometry args={[0.16, 0.035]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function CoolingUnit({ spec, index }: { spec: BoxSpec; index: number }) {
  const fans = useRef<THREE.Group>(null);
  const power = useWindow(W.power[0], W.power[1]);
  const speed = useRef(0);
  const { reduced } = useMotion();
  useFrame((_, dt) => {
    speed.current = THREE.MathUtils.damp(speed.current, power() * 6, 1.5, dt);
    if (fans.current && !reduced) fans.current.children.forEach((f) => (f.rotation.y += speed.current * dt * (1 + index * 0.1)));
  });
  const [x, y, z] = spec.p;
  const top = y + spec.s[1] / 2;
  return (
    <group>
      <mesh position={spec.p} material={darkSteel}>
        <boxGeometry args={spec.s} />
        <Edges color={C.edge} />
      </mesh>
      <group ref={fans}>
        {[-0.45, 0.45].map((dx) => (
          <group key={dx} position={[x + dx, top + 0.02, z]}>
            <mesh>
              <cylinderGeometry args={[0.36, 0.36, 0.03, 24]} />
              <meshStandardMaterial color="#0C1115" metalness={0.4} roughness={0.5} />
            </mesh>
            {[0, 1, 2, 3].map((k) => (
              <mesh key={k} rotation={[0, (k * Math.PI) / 2, 0]} position={[0, 0.025, 0]}>
                <boxGeometry args={[0.62, 0.01, 0.07]} />
                <meshBasicMaterial color={C.steel2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

function PowerYard({ specs }: { specs: ReturnType<typeof useFacilitySpecs> }) {
  const pylon = useMemo(() => segmentsGeometry([...HERO_TOWER.segs, ...HERO_TOWER.insulators]), []);
  const gantry = useMemo(
    () =>
      segmentsGeometry([
        [[GANTRY_X, 0, LINE_Z - 1.15], [GANTRY_X, 3.2, LINE_Z - 1.15]],
        [[GANTRY_X, 0, LINE_Z + 1.15], [GANTRY_X, 3.2, LINE_Z + 1.15]],
        [[GANTRY_X, 3.0, LINE_Z - 1.25], [GANTRY_X, 3.0, LINE_Z + 1.25]],
        ...HERO_PHASES.map((z) => [[GANTRY_X, 3.0, LINE_Z + z], [GANTRY_X, 2.72, LINE_Z + z]] as [V3, V3]),
      ]),
    [],
  );
  const lineMat = useFadingMaterial(fadingLine(C.steel2), W.ground, 0.9);
  const gantryMat = useFadingMaterial(fadingLine(C.steel2), W.fitout, 0.9);
  return (
    <group>
      <lineSegments geometry={pylon} position={[HERO_TOWER_X, 0, LINE_Z]} material={lineMat} />
      <lineSegments geometry={gantry} material={gantryMat} />
      <Rise win={W.fitout}>
        <mesh position={specs.pad.p} material={concrete}>
          <boxGeometry args={specs.pad.s} />
          <Edges color={C.edge} />
        </mesh>
        <mesh position={specs.transformer.p} material={darkSteel}>
          <boxGeometry args={specs.transformer.s} />
          <Edges color={C.edge} />
        </mesh>
        {[-0.45, -0.22, 0, 0.22, 0.45].map((dz) => (
          <mesh key={dz} position={[-6.88, 0.67, -4.8 + dz]} material={steel}>
            <boxGeometry args={[0.14, 0.9, 0.04]} />
          </mesh>
        ))}
        {[-0.35, 0, 0.35].map((dz) => (
          <mesh key={dz} position={[-7.6, 1.42, -4.8 + dz]}>
            <cylinderGeometry args={[0.045, 0.06, 0.42, 10]} />
            <meshStandardMaterial color="#5B6B74" roughness={0.4} />
          </mesh>
        ))}
      </Rise>
    </group>
  );
}

function FiberEntry() {
  return (
    <Rise win={W.fitout}>
      <mesh position={[9, 1.4, -2.2]} material={steel}>
        <cylinderGeometry args={[0.06, 0.08, 2.8, 10]} />
      </mesh>
      <mesh position={[9, 2.65, -2.2]} material={darkSteel}>
        <boxGeometry args={[0.36, 0.5, 0.24]} />
        <Edges color={C.edge} />
      </mesh>
      <mesh position={[9, 0.12, -2.2]} material={concrete}>
        <boxGeometry args={[0.8, 0.24, 0.8]} />
        <Edges color={C.edge} />
      </mesh>
    </Rise>
  );
}

/* ------------------------------------------------------------------ */
/* Energised systems                                                   */
/* ------------------------------------------------------------------ */

const polyCurve = (pts: V3[]) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
  return path;
};

function Systems({ compact }: { compact: boolean }) {
  const power = useWindow(W.power[0], W.power[1]);
  const network = useWindow(W.network[0], W.network[1]);
  const data = useWindow(W.data[0], W.data[1]);
  const cooling = useWindow(W.power[0] + 0.06, W.power[1] + 0.04);

  const paths = useMemo(() => {
    // Three parallel phases from the tower's insulator tips to the gantry drops.
    const conductors: V3[][] = HERO_TOWER.attach.map((a) =>
      catenary([HERO_TOWER_X, a[1], LINE_Z + a[2]], [GANTRY_X, 2.72, LINE_Z + a[2]], 0.35),
    );
    const feed: V3[] = [
      [GANTRY_X, 2.72, LINE_Z],
      [-7.6, 1.65, -4.8],
      [-7.6, 0.5, -4.8],
      [-5.6, 0.5, -4.8],
      [-5.6, 0.5, -2.3],
      [-4.4, 0.5, -2.3],
      [-4.4, BUS_Y, -2.3],
      [-4.4, BUS_Y, ROW_Z[0]],
      [4.4, BUS_Y, ROW_Z[0]],
    ];
    const busA: V3[] = [
      [-4.4, BUS_Y, ROW_Z[0]],
      [-4.4, BUS_Y, ROW_Z[1]],
      [4.4, BUS_Y, ROW_Z[1]],
    ];
    const fiber: V3[] = [
      [20, 0.06, -2.2],
      [9, 0.06, -2.2],
      [5.6, 0.06, -2.2],
      [5.6, 0.5, -2.2],
      [4.7, 0.5, -2.2],
      [4.7, TRAY_Y + 0.05, -2.2],
      [4.7, TRAY_Y + 0.05, ROW_Z[0]],
      [-4.1, TRAY_Y + 0.05, ROW_Z[0]],
    ];
    const fiberB: V3[] = [
      [4.7, TRAY_Y + 0.05, ROW_Z[0]],
      [4.7, TRAY_Y + 0.05, ROW_Z[1]],
      [-4.1, TRAY_Y + 0.05, ROW_Z[1]],
    ];
    const chw: V3[] = [
      [-4.75, BEAM_Y + 0.26, -2.95],
      [4.75, BEAM_Y + 0.26, -2.95],
      [4.75, TOP + 0.3, -2.95],
      [-4.75, TOP + 0.3, -2.95],
      [-4.75, BEAM_Y + 0.26, -2.95],
    ];
    return {
      conductors,
      feed,
      busA,
      fiber,
      fiberB,
      chw,
      powerCurves: [polyCurve(feed), polyCurve(busA), ...conductors.map((c) => polyCurve(c))],
      fiberCurves: [polyCurve(fiber), polyCurve(fiberB)],
    };
  }, []);

  return (
    <group>
      {/* Power: grid → transformer → UPS → busways */}
      {paths.conductors.map((c, i) => (
        <group key={i}>
          <FlowLine points={c} color={C.blue} lineWidth={1} opacity={0.45} active={power} />
          <FlowLine points={c} color={C.blue} lineWidth={1.5} dashed dashSize={0.3} gapSize={0.7} speed={1.2} active={power} />
        </group>
      ))}
      <FlowLine points={paths.feed} color={C.blue} lineWidth={2} dashed dashSize={0.35} gapSize={0.18} speed={1.4} active={power} />
      <FlowLine points={paths.busA} color={C.blue} lineWidth={2} dashed dashSize={0.35} gapSize={0.18} speed={1.4} active={power} />
      <Packets curves={paths.powerCurves} perCurve={compact ? 2 : 4} speed={0.09} size={0.06} color={C.blue} active={power} />

      {/* Cooling: chilled-water loop */}
      <FlowLine points={paths.chw} color={C.ice} lineWidth={1.4} dashed dashSize={0.18} gapSize={0.22} speed={0.6} active={cooling} opacity={0.75} />

      {/* Network: carrier fibre → entry → overhead trays */}
      <FlowLine points={paths.fiber} color={C.cyan} lineWidth={1.6} dashed dashSize={0.22} gapSize={0.14} speed={2} active={network} />
      <FlowLine points={paths.fiberB} color={C.cyan} lineWidth={1.6} dashed dashSize={0.22} gapSize={0.14} speed={2} active={network} />
      <Packets curves={paths.fiberCurves} perCurve={compact ? 4 : 7} speed={0.07} size={0.05} color={C.cyan} active={data} />
    </group>
  );
}

const SENSORS: V3[] = [
  [-7.6, 1.78, -4.8],
  [-9.2, 3.25, -4.8],
  [-4.4, 1.92, -2.3],
  [-4.4, TOP + 1.95, ROW_Z[0]],
  [-4.4, TOP + 1.95, ROW_Z[1]],
  [-2.4, TOP + 2.12, ROW_Z[1]],
  [0.9, TOP + 2.12, ROW_Z[1]],
  [3.5, TOP + 2.12, ROW_Z[1]],
  [-1.1, TOP + 2.12, ROW_Z[0]],
  [2.2, TOP + 2.12, ROW_Z[0]],
  [-3, BEAM_Y + 0.92, -1.6],
  [0, BEAM_Y + 0.92, -1.6],
  [3, BEAM_Y + 0.92, -1.6],
  [9, 3.05, -2.2],
  [5.5, TOP + 0.12, 3.5],
  [-5.5, TOP + 0.12, 3.5],
];

function SensorsAndData({ compact }: { compact: boolean }) {
  const p = useProgress();
  const data = useWindow(W.data[0], W.data[1]);
  const intel = useWindow(W.intel[0], W.intel[1]);
  const sensors = compact ? SENSORS.filter((_, i) => i % 2 === 0) : SENSORS;

  const beams = useMemo(
    () =>
      sensors.map((s) => {
        const ctrl = new THREE.Vector3(s[0] * 0.55, Math.max(s[1] + 2.2, 5.6), s[2] * 0.4);
        return new THREE.QuadraticBezierCurve3(new THREE.Vector3(...s), ctrl, new THREE.Vector3(...CORE));
      }),
    [sensors],
  );
  const beamPts = useMemo(() => beams.map((b) => b.getPoints(28)), [beams]);

  return (
    <group>
      {sensors.map((s, i) => (
        <SensorNode
          key={i}
          position={s}
          phase={i * 0.137}
          active={() => smooth(span(p.current, W.sensors[0] + (i / sensors.length) * 0.08, W.sensors[0] + 0.04 + (i / sensors.length) * 0.08))}
        />
      ))}
      {beamPts.map((pts, i) => (
        <FlowLine key={i} points={pts} color={C.cyan} lineWidth={0.8} dashed dashSize={0.12} gapSize={0.2} speed={0.8} active={data} opacity={0.35} />
      ))}
      <Packets curves={beams} perCurve={compact ? 1 : 2} speed={0.16} size={0.045} color={C.green} active={data} />
      <IntelligenceCore active={intel} />
    </group>
  );
}

function IntelligenceCore({ active }: { active: () => number }) {
  const g = useRef<THREE.Group>(null);
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const { reduced } = useMotion();
  const disc = useMemo(() => {
    const pairs: [V3, V3][] = [];
    const seg = 48;
    for (const R of [1.1, 1.6, 2.1]) {
      for (let i = 0; i < seg; i++) {
        const a0 = (i / seg) * Math.PI * 2;
        const a1 = ((i + 1) / seg) * Math.PI * 2;
        if (R === 2.1 && i % 2) continue;
        pairs.push([[Math.cos(a0) * R, 0, Math.sin(a0) * R], [Math.cos(a1) * R, 0, Math.sin(a1) * R]]);
      }
    }
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      pairs.push([[Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1], [Math.cos(a) * 2.1, 0, Math.sin(a) * 2.1]]);
    }
    return segmentsGeometry(pairs);
  }, []);
  const discMat = useRef<THREE.LineBasicMaterial>(null);
  const icoMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, dt) => {
    const a = active();
    if (!g.current) return;
    g.current.visible = a > 0.01;
    g.current.scale.setScalar(0.6 + 0.4 * a);
    if (discMat.current) discMat.current.opacity = a * 0.55;
    if (icoMat.current) icoMat.current.opacity = a * 0.9;
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (r1.current) r1.current.rotation.z += dt * 0.4;
    if (r2.current) r2.current.rotation.x = Math.sin(t * 0.3) * 0.3 + Math.PI / 2;
    g.current.children[0].rotation.y += dt * 0.25;
  });

  return (
    <group ref={g} position={CORE} visible={false}>
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial ref={icoMat} color={C.cyan} wireframe transparent opacity={0} toneMapped={false} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color={C.white} toneMapped={false} />
      </mesh>
      <mesh ref={r1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.008, 6, 96]} />
        <meshBasicMaterial color={C.cyan} toneMapped={false} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[1.0, 0.006, 6, 96]} />
        <meshBasicMaterial color={C.green} toneMapped={false} />
      </mesh>
      <lineSegments geometry={disc} position={[0, -0.75, 0]}>
        <lineBasicMaterial ref={discMat} color={C.cyan} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

/** Scan plane converting the physical model into its cyan digital twin. */
function DigitalTwin({ geometry }: { geometry: THREE.BufferGeometry }) {
  const p = useProgress();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), -1), []);
  const scanRef = useRef<THREE.Group>(null);
  const scanMat = useRef<THREE.MeshBasicMaterial>(null);
  const twinMat = useRef<THREE.LineBasicMaterial>(null);
  const outline = useMemo(() => boxEdgesGeometry([{ p: [0, 0, 0], s: [12.6, 0.001, 8.6] }]), []);
  useFrame(() => {
    const s = span(p.current, W.scan[0], W.scan[1]);
    const h = -0.5 + smooth(s) * 5.4;
    plane.constant = s >= 1 ? 100 : h;
    if (scanRef.current) {
      scanRef.current.position.y = h;
      scanRef.current.visible = s > 0 && s < 1;
    }
    if (scanMat.current) scanMat.current.opacity = Math.sin(Math.PI * s) * 0.14;
    if (twinMat.current) twinMat.current.opacity = s > 0 ? 0.55 : 0;
  });
  return (
    <group>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial ref={twinMat} color={C.cyan} transparent opacity={0} clippingPlanes={[plane]} depthWrite={false} toneMapped={false} />
      </lineSegments>
      <group ref={scanRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12.6, 8.6]} />
          <meshBasicMaterial ref={scanMat} color={C.cyan} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <lineSegments geometry={outline}>
          <lineBasicMaterial color={C.cyan} toneMapped={false} />
        </lineSegments>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export default function HeroScene({ compact = false, shift = 0, labels }: { compact?: boolean; shift?: number; labels?: LabelRegistry }) {
  const { reduced } = useMotion();
  const progress = useRef(reduced ? 1 : 0);
  const specs = useFacilitySpecs(compact ? 8 : 12);

  return (
    <BootCtx.Provider value={progress}>
      <BootDriver />
      <CameraRig
        position={compact ? [16.5, 11.5, 18.5] : [19.6, 11.2, 16.2]}
        target={compact ? [-1.5, 2.8, -1] : [-1.2, 2.7, -0.8]}
        yaw={0.16}
        pitch={0.06}
      />
      <LensShift x={shift} y={compact ? 0.1 : 0} />
      <fog attach="fog" args={[C.ink, 24, compact ? 56 : 54]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#9fc6ff", "#080B0D", 0.45]} />
      <directionalLight position={[8, 14, 10]} intensity={1.4} color="#e3f1ff" />
      <directionalLight position={[-10, 6, -8]} intensity={0.5} color={C.cyan} />

      <GridPlane size={64} step={1} major={5} opacity={0.55} />
      <Facility specs={specs} />
      <Systems compact={compact} />
      <SensorsAndData compact={compact} />
      <DigitalTwin geometry={specs.twin} />
      {!compact &&
        HERO_LABELS.map((l) => (
          <LabelAnchor key={l.id} registry={labels} id={l.id} position={l.p} opacity={() => span(progress.current, l.at, l.at + 0.04)} />
        ))}
    </BootCtx.Provider>
  );
}
