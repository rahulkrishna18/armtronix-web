"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { C, CameraRig, FlowLine, GridPlane, LabelAnchor, Packets, SensorNode, catenary, damp, pylonSegments, segmentsGeometry, transmissionTower, useMotion, type V3 } from "./primitives";

import { TRANSMISSION_LABELS } from "./sceneLabels";
import type { LabelRegistry } from "./labelRegistry";

export type FlowId = "energy" | "data" | "sensors";

const steel = new THREE.MeshStandardMaterial({ color: "#2D3B44", roughness: 0.5, metalness: 0.6 });
const dark = new THREE.MeshStandardMaterial({ color: "#121A1F", roughness: 0.7, metalness: 0.4 });

const PYLONS = [-9.2, -4.6];
const TOWER = transmissionTower(6.5, 1.4, 0.4, 1.9);
/** Phase positions (Z) shared by gantries and towers so the three conductors run parallel. */
const PHASE_Z = TOWER.attach.map((a) => a[2]);
const TELECOM: V3 = [8, 0, 0];
const RING: V3 = [1.5, 7.4, 0];

const polyCurve = (pts: V3[]) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i]), new THREE.Vector3(...pts[i + 1])));
  return path;
};

export default function TransmissionScene({ focus, compact = false, labels }: { focus: FlowId | null; compact?: boolean; labels?: LabelRegistry }) {
  const { reduced } = useMotion();
  const levels = useRef({ energy: 1, data: 1, sensors: 1 });
  useFrame((_, dt) => {
    (Object.keys(levels.current) as FlowId[]).forEach((k) => {
      const target = focus === null || focus === k ? 1 : 0.12;
      levels.current[k] = reduced ? target : damp(levels.current[k], target, 5, dt);
    });
  });
  const lv = useMemo(
    () => ({
      energy: () => levels.current.energy,
      data: () => levels.current.data,
      sensors: () => levels.current.sensors,
    }),
    [],
  );

  const geo = useMemo(() => {
    const pylon = segmentsGeometry(TOWER.segs);
    const insulators = segmentsGeometry(TOWER.insulators);
    // Telecom lattice + equipment platform + mast extension.
    const telecomSegs = pylonSegments(7.5, 1.1, 0.3, []);
    const pw = 0.6;
    const py = 6.85;
    telecomSegs.push(
      [[-pw, py, -pw], [pw, py, -pw]],
      [[pw, py, -pw], [pw, py, pw]],
      [[pw, py, pw], [-pw, py, pw]],
      [[-pw, py, pw], [-pw, py, -pw]],
      [[0, 8.0, 0], [0, 8.55, 0]],
    );
    const tower = segmentsGeometry(telecomSegs);
    // Gantries: posts + crossbar with short insulator drops at each phase.
    const gantry = (x: number, h: number): [V3, V3][] => [
      [[x, 0, -2.0], [x, h + 0.2, -2.0]],
      [[x, 0, 2.0], [x, h + 0.2, 2.0]],
      [[x, h, -2.1], [x, h, 2.1]],
      ...PHASE_Z.map((z) => [[x, h, z], [x, h - 0.32, z]] as [V3, V3]),
    ];
    const gantries = segmentsGeometry([...gantry(-11.6, 3.6), ...gantry(-1.6, 3.3)]);
    // Three-phase conductors: substation → towers → facility gantry, attached at insulator tips.
    const conductors: V3[][] = PHASE_Z.map((z, i) => {
      const pts: V3[] = [];
      const towerY = TOWER.attach[i][1];
      const anchors: V3[] = [[-11.6, 3.28, z], [PYLONS[0], towerY, z], [PYLONS[1], towerY, z], [-1.6, 2.98, z]];
      for (let i = 0; i < anchors.length - 1; i++) {
        const seg = catenary(anchors[i], anchors[i + 1], 0.55, 16);
        pts.push(...(i === 0 ? seg : seg.slice(1)));
      }
      return pts;
    });
    const feed: V3[] = [
      [-1.6, 2.98, 0],
      [-1.0, 2.2, 0],
      [-1.0, 0.5, 0],
      [1.5, 0.5, 0],
    ];
    // Underground fibre (section view): facility → telecom → carrier exchange
    const fiber: V3[] = [
      [3.6, 0.4, 0.9],
      [4.4, -0.5, 0.9],
      [8, -0.5, 0.9],
      [12.4, -0.5, 0.9],
      [13, 0.3, 0.9],
    ];
    const fiberB: V3[] = [
      [3.6, 0.4, 0.5],
      [4.4, -0.65, 0.5],
      [8, -0.65, 0.5],
      [8, 0.1, 0.5],
    ];
    const sensors: V3[] = [
      [-12.6, 1.6, 0],
      [PYLONS[0], 6.7, 0],
      [PYLONS[1], 6.7, 0],
      [0.2, 2.75, 1.0],
      [2.8, 2.75, -1.0],
      [6.2, 0.15, 0.9],
      [10.4, 0.15, 0.9],
      [8, 8.6, 0],
      [13, 1.9, 0],
    ];
    const uplinks = sensors.map((s) => new THREE.QuadraticBezierCurve3(new THREE.Vector3(...s), new THREE.Vector3((s[0] + RING[0]) / 2, Math.max(s[1], 5) + 2.2, 0), new THREE.Vector3(...RING)));
    const section = segmentsGeometry([[[-30, -0.9, 2.5], [30, -0.9, 2.5]]]);
    return {
      section,
      pylon,
      insulators,
      tower,
      gantries,
      conductors,
      feed,
      fiber,
      fiberB,
      sensors,
      uplinks,
      uplinkPts: uplinks.map((u) => u.getPoints(24)),
      energyCurves: [...conductors.map(polyCurve), polyCurve(feed)],
      fiberCurves: [polyCurve(fiber), polyCurve(fiberB)],
    };
  }, []);

  const arcs = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (arcs.current) {
      arcs.current.children.forEach((c, i) => {
        const k = reduced ? 0.5 : (t * 0.5 + (i % 3) / 3) % 1;
        c.scale.setScalar(0.5 + k * 1.5);
        ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.8 * levels.current.data;
      });
    }
    if (ring.current && !reduced) ring.current.rotation.y += dt * 0.3;
  });

  return (
    <>
      <CameraRig position={compact ? [15, 12, 19] : [3, 9.5, 24]} target={compact ? [1.5, 2.2, 0] : [0.8, 2.6, 0]} yaw={0.12} pitch={0.05} drift={0.03} />
      <fog attach="fog" args={[C.ink, compact ? 24 : 26, compact ? 50 : 52]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 14, 10]} intensity={1.2} />
      <directionalLight position={[-10, 5, -8]} intensity={0.4} color={C.blue} />

      {/* Ground in section: translucent so buried fibre reads through */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial color={C.ink} transparent opacity={0.72} depthWrite={false} />
      </mesh>
      <GridPlane size={60} step={1} major={5} opacity={0.5} />
      <lineSegments geometry={geo.section}>
        <lineBasicMaterial color={C.steel2} transparent opacity={0.5} />
      </lineSegments>

      {/* Substation */}
      <mesh position={[-13, 0.05, 0]} material={dark}>
        <boxGeometry args={[3.2, 0.1, 3.6]} />
        <Edges color={C.edge} />
      </mesh>
      {[-0.8, 0.8].map((z) => (
        <mesh key={z} position={[-13, 0.65, z]} material={dark}>
          <boxGeometry args={[1.1, 1.1, 0.9]} />
          <Edges color={C.edge} />
        </mesh>
      ))}
      <lineSegments geometry={geo.gantries}>
        <lineBasicMaterial color={C.steel2} />
      </lineSegments>

      {/* Transmission towers: crossarm along Z carries the three phases */}
      {PYLONS.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <lineSegments geometry={geo.pylon}>
            <lineBasicMaterial color={C.steel2} />
          </lineSegments>
          <lineSegments geometry={geo.insulators}>
            <lineBasicMaterial color={C.mute} />
          </lineSegments>
          {TOWER.attach.map((a) => (
            <mesh key={a[2]} position={[a[0], a[1] + 0.25, a[2]]}>
              <cylinderGeometry args={[0.07, 0.07, 0.36, 10]} />
              <meshStandardMaterial color="#5B6B74" roughness={0.4} metalness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Facility */}
      <mesh position={[1.5, 1.3, 0]} material={dark}>
        <boxGeometry args={[5, 2.6, 3.6]} />
        <Edges color={C.edge} />
      </mesh>
      {[0.2, 2.8].map((x) => (
        <mesh key={x} position={[x, 2.85, x < 1 ? 1 : -1]} material={steel}>
          <boxGeometry args={[1.2, 0.5, 0.9]} />
        </mesh>
      ))}

      {/* Telecom tower: lattice, platform, sector antennas, microwave dish, mast */}
      <group position={TELECOM}>
        <lineSegments geometry={geo.tower}>
          <lineBasicMaterial color={C.steel2} />
        </lineSegments>
        {[Math.PI / 6, (Math.PI * 5) / 6, (Math.PI * 3) / 2].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.46, 7.2, Math.sin(a) * 0.46]} rotation={[0, -a, 0]} material={dark}>
            <boxGeometry args={[0.07, 0.72, 0.26]} />
            <Edges color={C.mute} />
          </mesh>
        ))}
        <mesh position={[0.5, 6.35, 0]} rotation={[0, 0, Math.PI / 2]} material={dark}>
          <cylinderGeometry args={[0.24, 0.24, 0.08, 20]} />
          <Edges color={C.mute} />
        </mesh>
        {/* Wireless signal: vertical arcs radiating to both sides of the mast */}
        <group ref={arcs} position={[0, 7.2, 0]}>
          {[1, -1].flatMap((side) =>
            [0, 1, 2].map((i) => (
              <mesh key={`${side}-${i}`} rotation={[0, 0, side > 0 ? -Math.PI * 0.2 : Math.PI * 0.8]}>
                <torusGeometry args={[0.7, 0.014, 6, 40, Math.PI * 0.4]} />
                <meshBasicMaterial color={C.cyan} transparent opacity={0} toneMapped={false} />
              </mesh>
            )),
          )}
        </group>
      </group>
      <mesh position={[13, 0.8, 0]} material={dark}>
        <boxGeometry args={[2.6, 1.6, 2.2]} />
        <Edges color={C.edge} />
      </mesh>

      {/* ENERGY → FACILITY */}
      {/* Continuous conductor with energy pulses travelling along it */}
      {geo.conductors.map((c, i) => (
        <group key={i}>
          <FlowLine points={c} color={C.blue} lineWidth={1} opacity={0.45} active={() => 0.5 + 0.5 * levels.current.energy} />
          <FlowLine points={c} color={C.blue} lineWidth={1.6} dashed dashSize={0.35} gapSize={0.9} speed={1.6} active={lv.energy} />
        </group>
      ))}
      <FlowLine points={geo.feed} color={C.blue} lineWidth={2.2} dashed dashSize={0.3} gapSize={0.15} speed={1.6} active={lv.energy} />
      <Packets curves={geo.energyCurves} perCurve={compact ? 2 : 4} speed={0.07} size={0.08} color={C.blue} active={lv.energy} />

      {/* DATA → NETWORK */}
      <FlowLine points={geo.fiber} color={C.cyan} lineWidth={2} dashed dashSize={0.25} gapSize={0.14} speed={2.2} active={lv.data} />
      <FlowLine points={geo.fiberB} color={C.cyan} lineWidth={1.4} dashed dashSize={0.25} gapSize={0.14} speed={2.2} active={lv.data} />
      <Packets curves={geo.fiberCurves} perCurve={compact ? 3 : 6} speed={0.09} size={0.06} color={C.cyan} active={lv.data} />
      <Packets curves={geo.fiberCurves} perCurve={compact ? 2 : 3} speed={0.07} size={0.05} color={C.white} active={lv.data} reverse />

      {/* SENSORS → INTELLIGENCE */}
      {geo.sensors.map((s, i) => (
        <SensorNode key={i} position={s} phase={i * 0.19} active={lv.sensors} />
      ))}
      {geo.uplinkPts.map((pts, i) => (
        <FlowLine key={i} points={pts} color={C.green} lineWidth={0.8} dashed dashSize={0.14} gapSize={0.22} speed={0.9} active={lv.sensors} opacity={0.45} />
      ))}
      <Packets curves={geo.uplinks} perCurve={compact ? 1 : 2} speed={0.14} size={0.05} color={C.green} active={lv.sensors} />
      <group ref={ring} position={RING}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.3, 0.012, 6, 96]} />
          <meshBasicMaterial color={C.cyan} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.008, 6, 96]} />
          <meshBasicMaterial color={C.green} toneMapped={false} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.32, 0]} />
          <meshBasicMaterial color={C.cyan} wireframe toneMapped={false} />
        </mesh>
      </group>

      {!compact && TRANSMISSION_LABELS.map((l) => <LabelAnchor key={l.id} registry={labels} id={l.id} position={l.p} />)}
    </>
  );
}
