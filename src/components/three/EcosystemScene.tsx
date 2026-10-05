"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  C,
  CameraRig,
  FlowLine,
  LabelAnchor,
  Packets,
  boxEdgesGeometry,
  damp,
  segmentsGeometry,
  useMotion,
  type V3,
} from "./primitives";
import type { LabelRegistry } from "./labelRegistry";

const GAP = 1.38;
const PW = 6;
const PD = 4;
const LAYERS = [
  { label: "Foundation", color: "#C9D6DC" },
  { label: "Facility", color: C.white },
  { label: "Engineering Systems", color: C.green },
  { label: "Power + Network", color: C.blue },
  { label: "Digital Intelligence", color: C.cyan },
];

type LayerCtx = { lineMat: THREE.LineBasicMaterial; solidMat: THREE.MeshStandardMaterial; level: { current: number } };

/** One plate of the stack. Handles lift/brightness easing and pointer interaction. */
function Plate({
  index,
  active,
  emphasis,
  onHover,
  onSelect,
  showLabel,
  labels,
  children,
}: {
  index: number;
  active: boolean;
  emphasis: boolean;
  onHover?: (i: number | null) => void;
  onSelect?: (i: number) => void;
  showLabel: boolean;
  labels?: LabelRegistry;
  children: (ctx: LayerCtx) => ReactNode;
}) {
  const { reduced } = useMotion();
  const group = useRef<THREE.Group>(null);
  const level = useRef(active ? 1 : 0);
  const color = useMemo(() => new THREE.Color(LAYERS[index].color), [index]);
  const edgeColor = useMemo(() => new THREE.Color(C.edge), []);
  const [mats] = useState(() => ({
    plateEdge: new THREE.LineBasicMaterial({ color: C.edge, transparent: true }),
    plate: new THREE.MeshStandardMaterial({ color: "#0D1317", roughness: 0.8, metalness: 0.3, transparent: true, opacity: 0.92 }),
    lineMat: new THREE.LineBasicMaterial({ color: LAYERS[index].color, transparent: true }),
    solidMat: new THREE.MeshStandardMaterial({ color: "#121A1F", roughness: 0.6, metalness: 0.4, transparent: true }),
  }));
  const plateEdges = useMemo(() => boxEdgesGeometry([{ p: [0, 0, 0], s: [PW, 0.1, PD] }]), []);

  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  useFrame((_, dt) => {
    const target = active ? 1 : emphasis ? 0.45 : 0;
    level.current = reduced ? target : damp(level.current, target, 5, dt);
    const l = level.current;
    if (group.current) group.current.position.y = index * GAP + l * 0.28;
    mats.plateEdge.color.copy(edgeColor).lerp(color, l);
    mats.plateEdge.opacity = 0.55 + 0.45 * l;
    mats.lineMat.opacity = 0.18 + 0.82 * l;
    mats.solidMat.opacity = 0.35 + 0.6 * l;
    mats.plate.opacity = 0.75 + 0.2 * l;
  });

  return (
    <group ref={group} position={[0, index * GAP, 0]}>
      <mesh material={mats.plate}>
        <boxGeometry args={[PW, 0.1, PD]} />
      </mesh>
      <lineSegments geometry={plateEdges} material={mats.plateEdge} />
      {children({ lineMat: mats.lineMat, solidMat: mats.solidMat, level })}
      {/* Pointer hit volume (invisible) */}
      <mesh
        position={[0, GAP * 0.42, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.(index);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover?.(null);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(index);
        }}
      >
        <boxGeometry args={[PW, GAP * 0.9, PD]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {showLabel && (
        <LabelAnchor
          registry={labels}
          id={`layer-${index}`}
          position={[PW / 2 + 0.2, 0.05, -PD / 2]}
          opacity={() => 0.4 + 0.6 * level.current}
          on={() => level.current > 0.5}
        />
      )}
    </group>
  );
}

/* ------------------------------ Layer contents ------------------------------ */

function Foundation({ lineMat, solidMat }: LayerCtx) {
  const grid = useMemo(() => {
    const pairs: [V3, V3][] = [];
    for (let x = -PW / 2 + 0.4; x < PW / 2; x += 0.4) pairs.push([[x, 0.06, -PD / 2 + 0.2], [x, 0.06, PD / 2 - 0.2]]);
    for (let z = -PD / 2 + 0.4; z < PD / 2; z += 0.4) pairs.push([[-PW / 2 + 0.2, 0.06, z], [PW / 2 - 0.2, 0.06, z]]);
    return segmentsGeometry(pairs);
  }, []);
  const piles: V3[] = [-2, 0, 2].flatMap((x) => [-1.2, 1.2].map((z) => [x, -0.5, z] as V3));
  return (
    <group>
      <lineSegments geometry={grid} material={lineMat} />
      {piles.map((p, i) => (
        <mesh key={i} position={p} material={solidMat}>
          <cylinderGeometry args={[0.16, 0.16, 0.9, 16]} />
        </mesh>
      ))}
    </group>
  );
}

function Facility({ lineMat }: LayerCtx) {
  const frame = useMemo(() => {
    const cols = [-2.6, 0, 2.6].flatMap((x) => [-1.6, 1.6].map((z) => ({ p: [x, 0.52, z] as V3, s: [0.12, 0.95, 0.12] as V3 })));
    return boxEdgesGeometry([...cols, { p: [0, 1.0, 0], s: [5.3, 0.06, 3.3] }, { p: [-1.3, 0.52, -1.6], s: [2.5, 0.95, 0.02] }]);
  }, []);
  return <lineSegments geometry={frame} material={lineMat} />;
}

function Systems({ lineMat, solidMat, level }: LayerCtx) {
  const fans = useRef<THREE.Group>(null);
  const { reduced } = useMotion();
  const units = useMemo(() => boxEdgesGeometry([{ p: [-1.6, 0.3, -0.9], s: [1.1, 0.5, 0.7] }, { p: [0.1, 0.3, -0.9], s: [1.1, 0.5, 0.7] }, { p: [2.2, 0.6, 1.1], s: [0.7, 1.1, 0.7] }]), []);
  const loop: V3[] = [
    [-2.5, 0.22, 0.2],
    [1.4, 0.22, 0.2],
    [1.4, 0.22, 1.5],
    [-2.5, 0.22, 1.5],
    [-2.5, 0.22, 0.2],
  ];
  useFrame((_, dt) => {
    if (fans.current && !reduced) fans.current.children.forEach((f) => (f.rotation.y += dt * (1 + level.current * 5)));
  });
  return (
    <group>
      <lineSegments geometry={units} material={lineMat} />
      <mesh position={[-1.6, 0.3, -0.9]} material={solidMat}>
        <boxGeometry args={[1.08, 0.48, 0.68]} />
      </mesh>
      <mesh position={[0.1, 0.3, -0.9]} material={solidMat}>
        <boxGeometry args={[1.08, 0.48, 0.68]} />
      </mesh>
      <group ref={fans}>
        {[-1.6, 0.1].map((x) => (
          <group key={x} position={[x, 0.56, -0.9]}>
            {[0, 1].map((k) => (
              <mesh key={k} rotation={[0, (k * Math.PI) / 2, 0]}>
                <boxGeometry args={[0.5, 0.01, 0.06]} />
                <meshBasicMaterial color={C.green} toneMapped={false} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <FlowLine points={loop} color={C.green} lineWidth={1.6} dashed dashSize={0.2} gapSize={0.15} speed={0.8} active={() => 0.25 + 0.75 * level.current} />
    </group>
  );
}

function PowerNetwork({ lineMat, solidMat, level }: LayerCtx) {
  const ring = useMemo(() => {
    const pts: V3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push([1.4 + Math.cos(a) * 1.05, 0.12, Math.sin(a) * 1.05]);
    }
    return pts;
  }, []);
  const nodes: V3[] = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2;
    return [1.4 + Math.cos(a) * 1.05, 0.12, Math.sin(a) * 1.05];
  });
  const tx = useMemo(() => boxEdgesGeometry([{ p: [-2.1, 0.3, -1.1], s: [0.8, 0.5, 0.6] }]), []);
  const a = () => 0.25 + 0.75 * level.current;
  return (
    <group>
      {[-0.35, 0, 0.35].map((dz, i) => (
        <FlowLine
          key={i}
          points={[
            [-2.6, 0.1, 0.9 + dz],
            [0.1, 0.1, 0.9 + dz],
            [0.1, 0.1, -1.1 + dz * 0.4],
            [-1.7, 0.1, -1.1 + dz * 0.4],
          ]}
          color={C.blue}
          lineWidth={1.6}
          dashed
          dashSize={0.3}
          gapSize={0.12}
          speed={1.4}
          active={a}
        />
      ))}
      <lineSegments geometry={tx} material={lineMat} />
      <mesh position={[-2.1, 0.3, -1.1]} material={solidMat}>
        <boxGeometry args={[0.78, 0.48, 0.58]} />
      </mesh>
      <FlowLine points={ring} color={C.cyan} lineWidth={1.4} dashed dashSize={0.18} gapSize={0.1} speed={1.2} active={a} />
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshBasicMaterial color={C.cyan} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Intelligence({ lineMat, level }: LayerCtx) {
  const ico = useRef<THREE.Mesh>(null);
  const { reduced } = useMotion();
  const chips = useMemo(() => {
    const boxes = [];
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) boxes.push({ p: [-2.25 + i * 0.9, 0.12, -1.35 + j * 0.9] as V3, s: [0.42, 0.12, 0.42] as V3 });
    return boxes;
  }, []);
  const chipEdges = useMemo(() => boxEdgesGeometry(chips), [chips]);
  const traces = useMemo(() => {
    const pairs: [V3, V3][] = [];
    chips.forEach((c, k) => {
      const right = chips[k + 4];
      if (right) pairs.push([[c.p[0] + 0.21, 0.08, c.p[2]], [right.p[0] - 0.21, 0.08, right.p[2]]]);
      if (k % 4 !== 3) pairs.push([[c.p[0], 0.08, c.p[2] + 0.21], [c.p[0], 0.08, c.p[2] + 0.69]]);
    });
    return segmentsGeometry(pairs);
  }, [chips]);
  const icoMat = useMemo(() => new THREE.MeshBasicMaterial({ color: C.cyan, wireframe: true, transparent: true, toneMapped: false }), []);
  useFrame((_, dt) => {
    icoMat.opacity = 0.2 + 0.8 * level.current;
    if (ico.current && !reduced) {
      ico.current.rotation.y += dt * 0.35;
      ico.current.rotation.x += dt * 0.12;
    }
  });
  return (
    <group>
      <lineSegments geometry={chipEdges} material={lineMat} />
      <lineSegments geometry={traces} material={lineMat} />
      <mesh ref={ico} position={[0, 0.95, 0]} material={icoMat}>
        <icosahedronGeometry args={[0.5, 1]} />
      </mesh>
    </group>
  );
}

const CONTENT = [Foundation, Facility, Systems, PowerNetwork, Intelligence];

/* ---------------------------------- Scene ---------------------------------- */

export default function EcosystemScene({
  active,
  highlight = [],
  onHover,
  onSelect,
  compact = false,
  labels,
}: {
  active: number;
  highlight?: number[];
  onHover?: (i: number | null) => void;
  onSelect?: (i: number) => void;
  compact?: boolean;
  labels?: LabelRegistry;
}) {
  const stack = useRef<THREE.Group>(null);
  const { reduced } = useMotion();
  const spine = useMemo(
    () =>
      segmentsGeometry(
        [-PW / 2 - 0.15, PW / 2 + 0.15].flatMap((x) =>
          [-PD / 2 - 0.15, PD / 2 + 0.15].map((z) => [[x, -1.1, z], [x, GAP * 4 + 1.2, z]] as [V3, V3]),
        ),
      ),
    [],
  );
  const risers = useMemo(
    () => [
      new THREE.LineCurve3(new THREE.Vector3(2.75, -0.9, -1.75), new THREE.Vector3(2.75, GAP * 4 + 1.1, -1.75)),
      new THREE.LineCurve3(new THREE.Vector3(-2.75, -0.9, 1.75), new THREE.Vector3(-2.75, GAP * 4 + 1.1, 1.75)),
    ],
    [],
  );

  useFrame((state) => {
    if (stack.current && !reduced) stack.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.1;
  });

  return (
    <>
      <CameraRig position={compact ? [12.5, 10, 15] : [13.2, 9.6, 15.6]} target={compact ? [0.4, GAP * 2 + 0.1, 0] : [2.4, GAP * 2 + 0.1, 0]} yaw={0.22} pitch={0.08} drift={0.02} />
      <fog attach="fog" args={[C.ink, 19, 40]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 12, 8]} intensity={1.3} />
      <directionalLight position={[-8, 4, -6]} intensity={0.4} color={C.cyan} />
      <group ref={stack}>
        <lineSegments geometry={spine}>
          <lineBasicMaterial color={C.steel2} transparent opacity={0.6} />
        </lineSegments>
        {risers.map((r, i) => (
          <FlowLine
            key={i}
            points={[r.v1, r.v2]}
            color={i === 0 ? C.cyan : C.blue}
            lineWidth={1}
            dashed
            dashSize={0.25}
            gapSize={0.35}
            speed={-1}
            opacity={0.6}
          />
        ))}
        <Packets curves={risers} perCurve={4} speed={0.08} size={0.07} color={C.cyan} />
        {LAYERS.map((_, i) => {
          const Content = CONTENT[i];
          return (
            <Plate
              key={i}
              index={i}
              active={active === i || (active < 0 && highlight.includes(i))}
              emphasis={highlight.includes(i)}
              onHover={onHover}
              onSelect={onSelect}
              showLabel={!compact}
              labels={labels}
            >
              {(ctx) => <Content {...ctx} />}
            </Plate>
          );
        })}
      </group>
    </>
  );
}
