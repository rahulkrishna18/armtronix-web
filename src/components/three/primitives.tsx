"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Line } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, type ComponentProps } from "react";
import { MotionCtx, useMotion } from "./motion";
import type { LabelRegistry } from "./labelRegistry";
import * as THREE from "three";
import { pointer } from "@/lib/pointer";

export const C = {
  ink: "#080B0D",
  graphite: "#11161A",
  steel: "#28343C",
  steel2: "#3A4851",
  edge: "#3F5561",
  cyan: "#00C8E8",
  blue: "#168BFF",
  green: "#4DFF9A",
  white: "#E9F0F2",
  amber: "#FFB547",
  ice: "#7FDBFF",
  mute: "#8D9DA6",
  dim: "#5F6F78",
} as const;

export type V3 = [number, number, number];

export { MotionCtx, useMotion };

/** A value that can be static or read lazily every frame. */
export type Live = number | (() => number);
export const read = (v: Live) => (typeof v === "function" ? v() : v);

/** Deterministic hash in [0, 1) — keeps renders pure (no Math.random during render). */
export const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Frame-rate independent exponential smoothing. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.damp(current, target, lambda, dt);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Remaps `v` from [a, b] into [0, 1] (clamped). */
export const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

/**
 * Orbits the camera gently around `target` in response to the shared window
 * pointer, plus an optional slow idle drift. Feels like adjusting a
 * surveyor's instrument rather than free-flying.
 */
export function CameraRig({
  position,
  target = [0, 0, 0],
  yaw = 0.18,
  pitch = 0.08,
  drift = 0.04,
}: {
  position: V3;
  target?: V3;
  yaw?: number;
  pitch?: number;
  drift?: number;
}) {
  const { camera } = useThree();
  const { reduced } = useMotion();
  const base = useMemo(() => {
    const t = new THREE.Vector3(...target);
    const offset = new THREE.Vector3(...position).sub(t);
    const sph = new THREE.Spherical().setFromVector3(offset);
    return { t, sph };
  }, [position, target]);
  const cur = useRef({ yaw: 0, pitch: 0 });
  const tmp = useMemo(() => new THREE.Spherical(), []);

  useLayoutEffect(() => {
    camera.position.set(...position);
    camera.lookAt(base.t);
  }, [camera, position, base]);

  useFrame((state, dt) => {
    if (reduced) return;
    const time = state.clock.elapsedTime;
    const ty = pointer.x * yaw + Math.sin(time * 0.12) * drift;
    const tp = pointer.y * pitch + Math.sin(time * 0.09 + 1) * drift * 0.35;
    cur.current.yaw = damp(cur.current.yaw, ty, 2.2, dt);
    cur.current.pitch = damp(cur.current.pitch, tp, 2.2, dt);
    tmp.copy(base.sph);
    tmp.theta += cur.current.yaw;
    tmp.phi = THREE.MathUtils.clamp(tmp.phi - cur.current.pitch, 0.2, Math.PI / 2 - 0.05);
    camera.position.setFromSpherical(tmp).add(base.t);
    camera.lookAt(base.t);
  });
  return null;
}

/**
 * Shifts the rendered image horizontally without changing perspective
 * (an architectural "lens shift"), so the subject can sit beside text.
 */
export function LensShift({ x = 0, y = 0 }: { x?: number; y?: number }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (!x && !y) {
      cam.clearViewOffset();
      return;
    }
    cam.setViewOffset(size.width, size.height, -x * size.width, -y * size.height, size.width, size.height);
    cam.updateProjectionMatrix();
    return () => {
      cam.clearViewOffset();
    };
  }, [camera, size, x, y]);
  return null;
}

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

export type BoxSpec = { p: V3; s: V3 };

/** One merged line-segment geometry containing the 12 edges of every box. */
export function boxEdgesGeometry(boxes: BoxSpec[]) {
  const pos: number[] = [];
  for (const { p, s } of boxes) {
    const [x, y, z] = p;
    const [hx, hy, hz] = [s[0] / 2, s[1] / 2, s[2] / 2];
    const v = [
      [x - hx, y - hy, z - hz],
      [x + hx, y - hy, z - hz],
      [x + hx, y + hy, z - hz],
      [x - hx, y + hy, z - hz],
      [x - hx, y - hy, z + hz],
      [x + hx, y - hy, z + hz],
      [x + hx, y + hy, z + hz],
      [x - hx, y + hy, z + hz],
    ];
    const e = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
    for (const i of e) pos.push(...v[i]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/** Merged line segments from explicit point pairs. */
export function segmentsGeometry(pairs: [V3, V3][]) {
  const pos: number[] = [];
  for (const [a, b] of pairs) pos.push(...a, ...b);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/** Lattice transmission tower as line segments, base centred on origin. */
export function pylonSegments(height = 6, base = 1.4, top = 0.35, arms: number[] = [0.78, 0.9]): [V3, V3][] {
  const segs: [V3, V3][] = [];
  const levels = 6;
  const corner = (h: number) => {
    const t = h / height;
    const w = base + (top - base) * Math.pow(t, 0.8);
    return w / 2;
  };
  const ring = (h: number): V3[] => {
    const w = corner(h);
    return [
      [-w, h, -w],
      [w, h, -w],
      [w, h, w],
      [-w, h, w],
    ];
  };
  for (let i = 0; i < levels; i++) {
    const h0 = (i / levels) * height;
    const h1 = ((i + 1) / levels) * height;
    const r0 = ring(h0);
    const r1 = ring(h1);
    for (let k = 0; k < 4; k++) {
      segs.push([r0[k], r1[k]]); // legs
      segs.push([r1[k], r1[(k + 1) % 4]]); // horizontal
      segs.push([r0[k], r1[(k + 1) % 4]]); // lacing
    }
  }
  for (const a of arms) {
    const h = a * height;
    const w = corner(h);
    const reach = 1.25;
    segs.push([[-w, h, 0], [-reach, h, 0]], [[w, h, 0], [reach, h, 0]]);
    segs.push([[-w, h + 0.25, 0], [-reach, h, 0]], [[w, h + 0.25, 0], [reach, h, 0]]);
  }
  segs.push([[0, height, 0], [0, height + 0.5, 0]]);
  return segs;
}

/**
 * A finished lattice transmission tower in the X = 0 plane: tapered body, one
 * braced crossarm carrying three phases along Z, a shield-wire peak, and
 * insulator strings. Returns line segments plus the three conductor attachment
 * points (bottom of each insulator) in local coordinates.
 */
export function transmissionTower(height = 6.5, base = 1.4, top = 0.4, reach = 1.9) {
  const segs = pylonSegments(height, base, top, []);
  const half = (h: number) => (base + (top - base) * Math.pow(h / height, 0.8)) / 2;
  const armY = height * 0.82;
  const w = half(armY);
  const tipZ = reach;
  // Crossarm: bottom chord across both faces, sloped top chords, lacing.
  for (const x of [-w, w]) {
    segs.push([[x, armY, -tipZ], [x, armY, tipZ]]);
    segs.push([[x, armY + 0.42, -w], [x, armY, -tipZ]], [[x, armY + 0.42, w], [x, armY, tipZ]]);
    for (let k = 1; k <= 3; k++) {
      const z = w + ((tipZ - w) * k) / 4;
      const y = armY + 0.42 * (1 - (z - w) / (tipZ - w));
      segs.push([[x, armY, z], [x, y, z]], [[x, armY, -z], [x, y, -z]]);
    }
  }
  segs.push([[-w, armY, -tipZ], [w, armY, -tipZ]], [[-w, armY, tipZ], [w, armY, tipZ]]);
  // Shield-wire peak.
  const peakW = half(height);
  segs.push([[0, height + 0.5, 0], [0, height + 0.15, -0.7]], [[0, height + 0.5, 0], [0, height + 0.15, 0.7]]);
  segs.push([[-peakW, height, -peakW], [0, height + 0.15, -0.7]], [[peakW, height, peakW], [0, height + 0.15, 0.7]]);
  // Insulator strings hang from the arm at three phase positions.
  const phaseZ = [-tipZ + 0.12, 0, tipZ - 0.12];
  const insulator = 0.5;
  const attach: V3[] = phaseZ.map((z) => [0, armY - insulator, z]);
  const insulators: [V3, V3][] = phaseZ.map((z) => [[0, armY, z], [0, armY - insulator, z]]);
  return { segs, attach, insulators, armY };
}

/** Catenary sag between two points. */
export function catenary(a: V3, b: V3, sag = 0.6, steps = 24): V3[] {
  const pts: V3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(Math.PI * t) * sag, a[2] + (b[2] - a[2]) * t]);
  }
  return pts;
}

/* ------------------------------------------------------------------ */
/* Animated primitives                                                 */
/* ------------------------------------------------------------------ */

type LineProps = Omit<ComponentProps<typeof Line>, "points"> & {
  points: V3[] | THREE.Vector3[];
  speed?: number;
  active?: Live;
};

/** A fat line with travelling dashes — energy or data moving through a conductor. */
export function FlowLine({ points, speed = 1, active = 1, opacity = 1, ...rest }: LineProps & { opacity?: number }) {
  // drei's Line forwards a Line2 ref whose material is a LineMaterial.
  const ref = useRef<{ material: { dashOffset: number; opacity: number }; visible: boolean } | null>(null);
  const { reduced } = useMotion();
  useFrame((_, dt) => {
    const l = ref.current;
    if (!l) return;
    const m = l.material;
    if (!reduced) m.dashOffset -= dt * speed;
    const target = opacity * read(active);
    m.opacity = reduced ? target : damp(m.opacity, target, 4, dt);
    l.visible = m.opacity > 0.005;
  });
  return (
    <Line
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      points={points}
      transparent
      opacity={0}
      depthWrite={false}
      toneMapped={false}
      {...rest}
    />
  );
}

/**
 * Instanced packets travelling along a set of curves. Each curve carries
 * `perCurve` packets evenly phased; `active` (0..1) fades them in.
 */
export function Packets({
  curves,
  perCurve = 3,
  speed = 0.12,
  size = 0.05,
  color = C.cyan,
  active = 1,
  reverse = false,
}: {
  curves: THREE.Curve<THREE.Vector3>[];
  perCurve?: number;
  speed?: number;
  size?: number;
  color?: string;
  active?: Live;
  reverse?: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = curves.length * perCurve;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const pt = useMemo(() => new THREE.Vector3(), []);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => (i % perCurve) / perCurve + rand(i) * 0.08), [count, perCurve]);
  const vis = useRef(0);
  const { reduced } = useMotion();

  useFrame((state, dt) => {
    const m = mesh.current;
    if (!m) return;
    const a = read(active);
    vis.current = reduced ? a : damp(vis.current, a, 3, dt);
    m.visible = vis.current > 0.005;
    if (!m.visible) return;
    const t = state.clock.elapsedTime * speed;
    for (let i = 0; i < count; i++) {
      const curve = curves[Math.floor(i / perCurve)];
      let u = (seeds[i] + t) % 1;
      if (reverse) u = 1 - u;
      curve.getPointAt(u, pt);
      // Packets swell in the middle of their journey and vanish at the ends.
      const s = size * Math.sin(Math.PI * u) * vis.current;
      dummy.position.copy(pt);
      dummy.scale.setScalar(Math.max(s, 0.0001));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} toneMapped={false} transparent depthWrite={false} />
    </instancedMesh>
  );
}

/** A sensor: solid core plus a periodically expanding detection ring. */
export function SensorNode({
  position,
  color = C.green,
  size = 0.07,
  active = 1,
  phase = 0,
}: {
  position: V3;
  color?: string;
  size?: number;
  active?: Live;
  phase?: number;
}) {
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const v = useRef(0);
  const { reduced } = useMotion();
  useFrame((state, dt) => {
    const a = read(active);
    v.current = reduced ? a : damp(v.current, a, 5, dt);
    const t = reduced ? 0.35 : (state.clock.elapsedTime * 0.6 + phase) % 1;
    if (core.current) core.current.scale.setScalar(Math.max(v.current, 0.0001));
    if (ring.current) {
      ring.current.scale.setScalar(Math.max(0.001, (0.6 + t * 2.6) * v.current));
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.7 * v.current;
    }
  });
  return (
    <group position={position}>
      <mesh ref={core}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <Billboard>
        <mesh ref={ring}>
          <ringGeometry args={[size * 1.3, size * 1.55, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

/** Flat engineering grid made of line segments (cheaper and crisper than a texture). */
export function GridPlane({
  size = 40,
  step = 1,
  major = 5,
  color = C.steel,
  majorColor = "#1E3440",
  y = 0,
  opacity = 0.6,
}: {
  size?: number;
  step?: number;
  major?: number;
  color?: string;
  majorColor?: string;
  y?: number;
  opacity?: number;
}) {
  const { minor, majorG } = useMemo(() => {
    const a: [V3, V3][] = [];
    const b: [V3, V3][] = [];
    const half = size / 2;
    let i = 0;
    for (let v = -half; v <= half + 1e-6; v += step, i++) {
      const target = i % major === 0 ? b : a;
      target.push([[v, 0, -half], [v, 0, half]]);
      target.push([[-half, 0, v], [half, 0, v]]);
    }
    return { minor: segmentsGeometry(a), majorG: segmentsGeometry(b) };
  }, [size, step, major]);
  return (
    <group position={[0, y, 0]}>
      <lineSegments geometry={minor}>
        <lineBasicMaterial color={color} transparent opacity={opacity * 0.55} depthWrite={false} />
      </lineSegments>
      <lineSegments geometry={majorG}>
        <lineBasicMaterial color={majorColor} transparent opacity={opacity} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/**
 * Projects its world position to canvas pixels every frame and positions the
 * DOM label registered under `id`. `opacity` / `on` are optional per-frame reads.
 */
export function LabelAnchor({
  registry,
  id,
  position = [0, 0, 0],
  opacity,
  on,
}: {
  registry?: LabelRegistry;
  id: string;
  position?: V3;
  opacity?: () => number;
  on?: () => boolean;
}) {
  const g = useRef<THREE.Group>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    const node = registry?.nodes.get(id);
    if (!node || !g.current) return;
    g.current.getWorldPosition(v).project(camera);
    const x = (v.x * 0.5 + 0.5) * size.width;
    const y = (-v.y * 0.5 + 0.5) * size.height;
    node.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    node.style.opacity = String(v.z > 1 ? 0 : opacity ? opacity() : 1);
    if (on) node.dataset.on = on() ? "true" : "false";
  });
  return <group ref={g} position={position} />;
}
