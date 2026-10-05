"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import type { TechCapabilityId } from "@/content/home";
import { NETWORK_NODES } from "./sceneLabels";
import type { LabelRegistry } from "./labelRegistry";
import { C, CameraRig, GridPlane, LabelAnchor, Packets, SensorNode, damp, segmentsGeometry, useMotion, type V3 } from "./primitives";

const R0 = 4.3;
const Y1 = 1.7;
const Y2 = 3.4;
const Y3 = 5.5;
const ASSETS = ["Rack", "Chiller", "PDU", "UPS", "AHU", "Meter", "Camera", "Valve"] as const;
type AssetKind = (typeof ASSETS)[number];
const ASSET_DIMS: Record<AssetKind, V3> = { Rack: [0.5, 1.1, 0.6], Chiller: [1, 0.5, 0.7], PDU: [0.35, 0.9, 0.35], UPS: [0.8, 0.7, 0.5], AHU: [1, 0.5, 0.6], Meter: [0.4, 0.5, 0.25], Camera: [0.32, 0.22, 0.22], Valve: [0.5, 0.3, 0.3] };
const CAMERA_Y = 1.1;
/** Height of an asset's top surface, where its sensor stem attaches. */
const assetTop = (kind: AssetKind) => (kind === "Camera" ? CAMERA_Y + ASSET_DIMS.Camera[1] / 2 : kind === "Chiller" ? 0.54 : ASSET_DIMS[kind][1]);
const NODES = NETWORK_NODES;

type Channel = "assets" | "sensors" | "low" | "mid" | "high" | "up" | "down" | "cage" | "core" | (typeof NODES)[number]["id"];

/** How strongly each part of the graph is emphasised for a selected capability. */
function emphasis(focus: TechCapabilityId | null): Record<Channel, number> {
  const base: Record<Channel, number> = { assets: 0.7, sensors: 0.8, low: 0.6, mid: 0.6, high: 0.6, up: 0.8, down: 0.5, cage: 0.18, core: 0.8, monitoring: 0.6, analytics: 0.6, automation: 0.6, cloud: 0.6, security: 0.6 };
  if (!focus) return base;
  const dim = Object.fromEntries(Object.keys(base).map((k) => [k, 0.12])) as Record<Channel, number>;
  const on = (...keys: Channel[]) => keys.forEach((k) => (dim[k] = 1));
  switch (focus) {
    case "iiot":
      on("assets", "sensors", "low", "mid", "up");
      break;
    case "automation":
      on("automation", "down", "mid", "low", "assets", "core");
      break;
    case "monitoring":
      on("monitoring", "up", "sensors", "mid", "high", "core");
      break;
    case "analytics":
      on("analytics", "core", "high", "up");
      break;
    case "cloud":
      on("cloud", "high", "mid", "core");
      break;
    case "security":
      on("security", "cage", "core", "high");
      break;
    case "intelligent":
      on("core", "monitoring", "analytics", "automation", "cloud", "security", "high", "up", "down");
      break;
  }
  return dim;
}

const ring = (r: number, n: number, y: number, offset = 0): V3[] =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + offset;
    return [Math.cos(a) * r, y, Math.sin(a) * r];
  });

function Asset({ kind, position }: { kind: (typeof ASSETS)[number]; position: V3 }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#121A1F", roughness: 0.6, metalness: 0.4 }), []);
  const d = ASSET_DIMS[kind];
  const y = kind === "Camera" ? CAMERA_Y : d[1] / 2;
  return (
    <group position={position}>
      {kind === "Camera" && (
        <mesh position={[0, 0.5, 0]} material={mat}>
          <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
        </mesh>
      )}
      <mesh position={[0, y, 0]} material={mat}>
        <boxGeometry args={d} />
        <Edges color={C.edge} />
      </mesh>
      {kind === "Chiller" && (
        <mesh position={[0, 0.52, 0]} material={mat}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
          <Edges color={C.edge} />
        </mesh>
      )}
    </group>
  );
}

export default function NetworkScene({ focus, compact = false, labels }: { focus: TechCapabilityId | null; compact?: boolean; labels?: LabelRegistry }) {
  const { reduced } = useMotion();
  const group = useRef<THREE.Group>(null);
  const cage = useRef<THREE.LineSegments>(null);
  const core = useRef<THREE.Mesh>(null);

  const g = useMemo(() => {
    const assets = ring(R0, 8, 0, Math.PI / 8);
    const sensors = assets.map(([x, , z]) => [x, Y1, z] as V3);
    const gateways = ring(2.5, 3, Y2, Math.PI / 6);
    const nodes = ring(2.2, 5, Y3, -Math.PI / 2);
    const coreP: V3 = [0, Y3 + 0.35, 0];
    const nearest = (p: V3) => gateways.reduce((best, gw) => (Math.hypot(gw[0] - p[0], gw[2] - p[2]) < Math.hypot(best[0] - p[0], best[2] - p[2]) ? gw : best));
    const tops = assets.map((a, i) => [a[0], assetTop(ASSETS[i]), a[2]] as V3);
    const low = assets.map((_, i) => [tops[i], sensors[i]] as [V3, V3]);
    const mid = sensors.map((s) => [s, nearest(s)] as [V3, V3]);
    const high = gateways.map((gw) => [gw, coreP] as [V3, V3]);
    const hex = ring(2.2, 6, Y3, -Math.PI / 2);
    const hexPairs = hex.map((p, i) => [p, hex[(i + 1) % 6]] as [V3, V3]);
    const spokes = nodes.map((n) => [n, coreP] as [V3, V3]);
    // Security cage: hexagonal prism around the platform
    const cTop = ring(3, 6, Y3 + 0.9, -Math.PI / 2);
    const cBot = ring(3, 6, Y3 - 0.6, -Math.PI / 2);
    const cagePairs: [V3, V3][] = [];
    for (let i = 0; i < 6; i++) cagePairs.push([cTop[i], cTop[(i + 1) % 6]], [cBot[i], cBot[(i + 1) % 6]], [cTop[i], cBot[i]]);
    const paths = assets.map((a, i) => {
      const s = sensors[i];
      const gw = nearest(s);
      const p = new THREE.CurvePath<THREE.Vector3>();
      const v = (q: V3) => new THREE.Vector3(...q);
      p.add(new THREE.LineCurve3(v(tops[i]), v(s)));
      p.add(new THREE.LineCurve3(v(s), v(gw)));
      p.add(new THREE.LineCurve3(v(gw), v(coreP)));
      return p;
    });
    return {
      assets,
      sensors,
      gateways,
      nodes,
      coreP,
      low: segmentsGeometry(low),
      mid: segmentsGeometry(mid),
      high: segmentsGeometry(high),
      platform: segmentsGeometry([...hexPairs, ...spokes]),
      cage: segmentsGeometry(cagePairs),
      paths,
    };
  }, []);

  const target = emphasis(focus);
  const levels = useRef<Record<Channel, number>>({ ...target });
  const [mats] = useState(() => ({
    low: new THREE.LineBasicMaterial({ color: C.green, transparent: true }),
    mid: new THREE.LineBasicMaterial({ color: C.cyan, transparent: true }),
    high: new THREE.LineBasicMaterial({ color: C.cyan, transparent: true }),
    platform: new THREE.LineBasicMaterial({ color: C.cyan, transparent: true }),
    cage: new THREE.LineBasicMaterial({ color: C.cyan, transparent: true }),
    gateway: new THREE.MeshStandardMaterial({ color: "#0F171C", roughness: 0.5, metalness: 0.5, emissive: new THREE.Color(C.cyan), emissiveIntensity: 0.1 }),
  }));
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, dt) => {
    const L = levels.current;
    (Object.keys(target) as Channel[]).forEach((k) => (L[k] = reduced ? target[k] : damp(L[k], target[k], 5, dt)));
    mats.low.opacity = 0.15 + 0.6 * L.low;
    mats.mid.opacity = 0.12 + 0.6 * L.mid;
    mats.high.opacity = 0.15 + 0.75 * L.high;
    mats.platform.opacity = 0.25 + 0.6 * L.core;
    mats.cage.opacity = 0.05 + 0.7 * L.cage;
    mats.gateway.emissiveIntensity = 0.05 + 0.4 * L.mid;
    NODES.forEach((n, i) => {
      const m = nodeRefs.current[i];
      if (m) m.scale.setScalar(0.7 + 0.6 * L[n.id]);
    });
    if (reduced) return;
    if (group.current) group.current.rotation.y += dt * 0.06;
    if (core.current) {
      core.current.rotation.y += dt * 0.4;
      core.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    if (cage.current) cage.current.rotation.y -= dt * 0.1;
  });

  const lv = (k: Channel) => () => levels.current[k];

  return (
    <>
      <CameraRig position={compact ? [10.5, 9.5, 14] : [10.6, 8.6, 13.4]} target={[0, 2.6, 0]} yaw={0.2} pitch={0.07} drift={0.02} />
      <fog attach="fog" args={[C.ink, 17, 38]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 12, 7]} intensity={1.2} />
      <GridPlane size={30} step={0.5} major={4} y={-0.01} opacity={0.4} />
      <group ref={group}>
        {g.assets.map((p, i) => (
          <Asset key={ASSETS[i]} kind={ASSETS[i]} position={p} />
        ))}
        {g.sensors.map((p, i) => (
          <SensorNode key={i} position={p} phase={i * 0.17} active={lv("sensors")} />
        ))}
        {g.gateways.map((p, i) => (
          <mesh key={i} position={p} material={mats.gateway}>
            <boxGeometry args={[0.5, 0.28, 0.5]} />
            <Edges color={C.cyan} />
          </mesh>
        ))}
        <lineSegments geometry={g.low} material={mats.low} />
        <lineSegments geometry={g.mid} material={mats.mid} />
        <lineSegments geometry={g.high} material={mats.high} />
        <lineSegments geometry={g.platform} material={mats.platform} />
        <lineSegments ref={cage} geometry={g.cage} material={mats.cage} />
        <mesh ref={core} position={g.coreP}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshBasicMaterial color={C.cyan} wireframe toneMapped={false} />
        </mesh>
        {g.nodes.map((p, i) => (
          <group key={NODES[i].id} position={p}>
            <mesh ref={(m) => void (nodeRefs.current[i] = m)}>
              <octahedronGeometry args={[0.16, 0]} />
              <meshBasicMaterial color={NODES[i].id === "automation" ? C.green : NODES[i].id === "security" ? C.white : C.cyan} toneMapped={false} />
            </mesh>
            {!compact && <LabelAnchor registry={labels} id={NODES[i].id} position={[0, 0.42, 0]} opacity={() => 0.35 + 0.65 * levels.current[NODES[i].id]} />}
          </group>
        ))}
        <Packets curves={g.paths} perCurve={compact ? 1 : 2} speed={0.09} size={0.06} color={C.cyan} active={lv("up")} />
        <Packets curves={g.paths} perCurve={1} speed={0.06} size={0.055} color={C.green} active={lv("down")} reverse />
      </group>
    </>
  );
}
