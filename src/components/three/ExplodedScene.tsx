"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ENGINEERING_LAYERS } from "@/content/home";
import type { LabelRegistry } from "./labelRegistry";
import { C, CameraRig, FlowLine, GridPlane, LabelAnchor, SensorNode, boxEdgesGeometry, damp, segmentsGeometry, smooth, span, useMotion, type BoxSpec, type V3 } from "./primitives";

const SPACING = 1.12;
const N = ENGINEERING_LAYERS.length;

export const explodeAt = (p: number) => smooth(span(p, 0.04, 0.2)) * (1 - smooth(span(p, 0.86, 0.97)));
export const activeAt = (p: number) => (p < 0.2 ? -1 : p >= 0.86 ? N : Math.min(N - 1, Math.floor(span(p, 0.2, 0.86) * N)));

type Mats = { line: THREE.LineBasicMaterial; solid: THREE.MeshStandardMaterial; level: { current: number } };

function Layer({ index, progress, children }: { index: number; progress: { current: number }; children: (m: Mats) => ReactNode }) {
  const { reduced } = useMotion();
  const g = useRef<THREE.Group>(null);
  const level = useRef(0);
  const lift = useRef(0);
  const color = useMemo(() => new THREE.Color(ENGINEERING_LAYERS[index].color), [index]);
  const dim = useMemo(() => new THREE.Color(C.edge), []);
  const [mats] = useState(() => ({
    line: new THREE.LineBasicMaterial({ color: C.edge, transparent: true }),
    solid: new THREE.MeshStandardMaterial({ color: "#10171C", roughness: 0.6, metalness: 0.45, transparent: true }),
  }));
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  useFrame((_, dt) => {
    const p = progress.current;
    const a = activeAt(p);
    const target = a === N ? 0.85 : a === index ? 1 : a < 0 ? 0.35 : 0.12;
    level.current = reduced ? target : damp(level.current, target, 6, dt);
    const e = explodeAt(p);
    const targetLift = index * SPACING * e + (a === index ? 0.18 : 0);
    lift.current = reduced ? targetLift : damp(lift.current, targetLift, 7, dt);
    if (g.current) g.current.position.y = lift.current;
    const l = level.current;
    mats.line.color.copy(dim).lerp(color, Math.min(1, l * 1.2));
    mats.line.opacity = 0.3 + 0.7 * l;
    mats.solid.opacity = 0.45 + 0.5 * l;
  });

  return <group ref={g}>{children({ ...mats, level })}</group>;
}

/* --------------------------------- Layers --------------------------------- */

const RACKS: BoxSpec[] = Array.from({ length: 6 }, (_, i) => ({ p: [-1.75 + i * 0.7, 0.95, 0.05] as V3, s: [0.5, 1.6, 0.8] as V3 }));

function Structure({ line, solid }: Mats) {
  const edges = useMemo(() => {
    const cols: BoxSpec[] = [-2.5, 0, 2.5].flatMap((x) => [-1.6, 1.6].map((z) => ({ p: [x, 1.45, z] as V3, s: [0.1, 2.6, 0.1] as V3 })));
    return boxEdgesGeometry([{ p: [0, 0.075, 0], s: [5.2, 0.15, 3.4] }, ...cols, { p: [0, 2.78, 0], s: [5.1, 0.08, 3.3] }, ...RACKS]);
  }, []);
  return (
    <group>
      <mesh position={[0, 0.075, 0]} material={solid}>
        <boxGeometry args={[5.2, 0.15, 3.4]} />
      </mesh>
      {RACKS.map((r, i) => (
        <mesh key={i} position={r.p} material={solid}>
          <boxGeometry args={r.s} />
        </mesh>
      ))}
      <lineSegments geometry={edges} material={line} />
    </group>
  );
}

function Power({ line, solid, level }: Mats) {
  const edges = useMemo(
    () =>
      boxEdgesGeometry([
        { p: [0, 1.95, -0.55], s: [4.6, 0.08, 0.14] },
        { p: [-2.25, 0.62, -0.8], s: [0.45, 0.95, 0.5] },
        { p: [2.1, 0.6, -1.2], s: [0.6, 0.9, 0.5] },
      ]),
    [],
  );
  const drops = useMemo(() => segmentsGeometry(RACKS.map((r) => [[r.p[0], 1.95, -0.55], [r.p[0], 1.76, -0.3]] as [V3, V3])), []);
  return (
    <group>
      <mesh position={[-2.25, 0.62, -0.8]} material={solid}>
        <boxGeometry args={[0.45, 0.95, 0.5]} />
      </mesh>
      <mesh position={[2.1, 0.6, -1.2]} material={solid}>
        <boxGeometry args={[0.6, 0.9, 0.5]} />
      </mesh>
      <lineSegments geometry={edges} material={line} />
      <lineSegments geometry={drops} material={line} />
      <FlowLine points={[[2.1, 1.05, -1.2], [2.1, 1.95, -0.55], [-2.3, 1.95, -0.55], [-2.25, 1.1, -0.8]]} color={C.blue} lineWidth={2} dashed dashSize={0.25} gapSize={0.12} speed={1.4} active={() => level.current} />
    </group>
  );
}

function Cooling({ line, solid, level }: Mats) {
  const edges = useMemo(() => boxEdgesGeometry([-1.2, 1.2].map((x) => ({ p: [x, 0.8, -1.35] as V3, s: [0.9, 1.3, 0.4] as V3 }))), []);
  return (
    <group>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.8, -1.35]} material={solid}>
          <boxGeometry args={[0.9, 1.3, 0.4]} />
        </mesh>
      ))}
      <lineSegments geometry={edges} material={line} />
      <FlowLine
        points={[[-2.4, 2.35, -1.45], [2.4, 2.35, -1.45], [2.4, 2.35, -1.25], [-2.4, 2.35, -1.25]]}
        color={C.ice}
        lineWidth={1.8}
        dashed
        dashSize={0.18}
        gapSize={0.14}
        speed={0.8}
        active={() => level.current}
      />
      {[-1.2, 1.2].map((x) => (
        <FlowLine key={x} points={[[x, 2.35, -1.35], [x, 1.45, -1.35]]} color={C.ice} lineWidth={1.4} dashed dashSize={0.12} gapSize={0.1} speed={0.8} active={() => level.current} />
      ))}
    </group>
  );
}

function Mechanical({ line, solid, level }: Mats) {
  const { reduced } = useMotion();
  const fans = useRef<THREE.Group>(null);
  const edges = useMemo(
    () => boxEdgesGeometry([{ p: [-0.6, 3.1, 0.6], s: [1.5, 0.5, 0.9] }, { p: [2.15, 1.45, 1.2], s: [0.7, 2.7, 0.7] }, { p: [2.15, 1.9, 1.2], s: [0.55, 0.6, 0.55] }]),
    [],
  );
  const sprinklers = useMemo(() => segmentsGeometry([[[-2.4, 2.55, 0.9], [1.6, 2.55, 0.9]], ...[-2, -1, 0, 1].map((x) => [[x, 2.55, 0.9], [x, 2.45, 0.9]] as [V3, V3])]), []);
  useFrame((_, dt) => {
    if (fans.current && !reduced) fans.current.children.forEach((f) => (f.rotation.y += dt * (1 + level.current * 6)));
  });
  return (
    <group>
      <mesh position={[-0.6, 3.1, 0.6]} material={solid}>
        <boxGeometry args={[1.5, 0.5, 0.9]} />
      </mesh>
      <lineSegments geometry={edges} material={line} />
      <lineSegments geometry={sprinklers} material={line} />
      <group ref={fans}>
        {[-0.95, -0.25].map((x) => (
          <group key={x} position={[x, 3.37, 0.6]}>
            {[0, 1].map((k) => (
              <mesh key={k} rotation={[0, (k * Math.PI) / 2, 0]} material={solid}>
                <boxGeometry args={[0.55, 0.02, 0.07]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

function Automation({ line, solid, level }: Mats) {
  const edges = useMemo(() => boxEdgesGeometry([0.5, 1.15].map((z) => ({ p: [-2.3, 0.6, z] as V3, s: [0.35, 0.9, 0.25] as V3 }))), []);
  const leds = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!leds.current) return;
    leds.current.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.2 + 0.8 * level.current * (Math.sin(state.clock.elapsedTime * 3 + i * 1.7) > 0 ? 1 : 0.35);
    });
  });
  return (
    <group>
      {[0.5, 1.15].map((z) => (
        <mesh key={z} position={[-2.3, 0.6, z]} material={solid}>
          <boxGeometry args={[0.35, 0.9, 0.25]} />
        </mesh>
      ))}
      <lineSegments geometry={edges} material={line} />
      <group ref={leds}>
        {[0.5, 1.15].flatMap((z) =>
          [0.75, 0.85, 0.95].map((y) => (
            <mesh key={`${z}-${y}`} position={[-2.12, y, z]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.08, 0.03]} />
              <meshBasicMaterial color={C.green} transparent toneMapped={false} />
            </mesh>
          )),
        )}
      </group>
      <FlowLine points={[[-2.3, 1.05, 0.8], [-2.3, 2.2, 0.8], [-1.2, 2.2, -1.1], [-1.2, 1.45, -1.35]]} color={C.green} lineWidth={1.2} dashed dashSize={0.1} gapSize={0.08} speed={0.6} active={() => level.current} />
      <FlowLine points={[[-2.3, 2.2, 0.8], [-0.6, 2.2, 0.8], [-0.6, 2.85, 0.6]]} color={C.green} lineWidth={1.2} dashed dashSize={0.1} gapSize={0.08} speed={0.6} active={() => level.current} />
    </group>
  );
}

function Connectivity({ line, solid, level }: Mats) {
  const edges = useMemo(() => boxEdgesGeometry([{ p: [0, 2.12, 0.45], s: [4.6, 0.05, 0.3] }, { p: [1.95, 1.25, 1.25], s: [0.45, 0.22, 0.4] }]), []);
  return (
    <group>
      <mesh position={[1.95, 1.25, 1.25]} material={solid}>
        <boxGeometry args={[0.45, 0.22, 0.4]} />
      </mesh>
      <lineSegments geometry={edges} material={line} />
      <FlowLine points={[[-2.3, 2.17, 0.4], [2.3, 2.17, 0.4], [2.3, 1.4, 1.25], [2.15, 1.36, 1.25]]} color={C.cyan} lineWidth={1.6} dashed dashSize={0.16} gapSize={0.1} speed={2} active={() => level.current} />
      <FlowLine points={[[-2.3, 2.17, 0.5], [2.3, 2.17, 0.5]]} color={C.cyan} lineWidth={1.2} dashed dashSize={0.16} gapSize={0.1} speed={-2} active={() => level.current} />
    </group>
  );
}

function Monitoring({ line, level }: Mats) {
  const envelope = useMemo(() => boxEdgesGeometry([{ p: [0, 1.65, 0], s: [5.6, 3.3, 3.8] }]), []);
  const pts: V3[] = [
    [-1.75, 1.85, 0.5],
    [0.35, 1.85, 0.5],
    [1.75, 1.85, 0.5],
    [-1.2, 1.55, -1.1],
    [1.2, 1.55, -1.1],
    [2.1, 1.15, -0.9],
    [-2.25, 1.2, -0.5],
    [-0.6, 3.45, 0.6],
    [2.15, 2.9, 1.2],
    [0, 0.25, 1.6],
  ];
  return (
    <group>
      <lineSegments geometry={envelope} material={line} />
      {pts.map((p, i) => (
        <SensorNode key={i} position={p} phase={i * 0.21} size={0.055} active={() => 0.3 + 0.7 * level.current} />
      ))}
    </group>
  );
}

const CONTENT = [Structure, Power, Cooling, Mechanical, Automation, Connectivity, Monitoring];

/* --------------------------------- Scene ---------------------------------- */

function ActiveLabel({ active, progress, labels }: { active: number; progress: { current: number }; labels?: LabelRegistry }) {
  const ref = useRef<THREE.Group>(null);
  const { reduced } = useMotion();
  useFrame((_, dt) => {
    if (!ref.current) return;
    const e = explodeAt(progress.current);
    const y = Math.max(0, active) * SPACING * e + 1.2;
    ref.current.position.y = reduced ? y : damp(ref.current.position.y, y, 6, dt);
  });
  const visible = active >= 0 && active < N;
  return (
    <group ref={ref} position={[3.1, 1.2, 0]}>
      <LabelAnchor registry={labels} id="active-layer" opacity={() => (visible ? 1 : 0)} />
    </group>
  );
}

export default function ExplodedScene({ progress, active, compact = false, labels }: { progress: { current: number }; active: number; compact?: boolean; labels?: LabelRegistry }) {
  const rig = useRef<THREE.Group>(null);
  const { reduced } = useMotion();
  const lowered = useRef(0);
  useFrame((state, dt) => {
    if (!rig.current) return;
    // Keep the model centred: lower it as the layers separate.
    const target = -explodeAt(progress.current) * 3.3;
    lowered.current = reduced ? target : damp(lowered.current, target, 6, dt);
    rig.current.position.y = lowered.current;
    if (!reduced) rig.current.rotation.y = -0.35 + Math.sin(state.clock.elapsedTime * 0.1) * 0.08 + progress.current * 0.5;
  });
  return (
    <>
      <CameraRig position={compact ? [10, 8, 13.6] : [11.4, 8.4, 15]} target={[0, 1.9, 0]} yaw={0.15} pitch={0.06} drift={0.02} />
      <fog attach="fog" args={[C.ink, 17, 38]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 12, 8]} intensity={1.2} />
      <directionalLight position={[-6, 3, -6]} intensity={0.35} color={C.cyan} />
      <group ref={rig}>
        <GridPlane size={30} step={0.5} major={4} y={-0.02} opacity={0.4} />
        {CONTENT.map((Content, i) => (
          <Layer key={i} index={i} progress={progress}>
            {(m) => <Content {...m} />}
          </Layer>
        ))}
        {!compact && <ActiveLabel active={active} progress={progress} labels={labels} />}
      </group>
    </>
  );
}
