"use client";

import { Canvas, useThree, type CanvasProps } from "@react-three/fiber";
import { Suspense, useEffect, type ReactNode } from "react";
import { MotionCtx } from "./motion";

/** The actual WebGL canvas — loaded lazily so three.js stays out of the initial bundle. */
export default function CanvasRoot({
  camera,
  dpr,
  frameloop,
  reduced,
  className,
  onReady,
  children,
}: {
  camera: CanvasProps["camera"];
  dpr: CanvasProps["dpr"];
  frameloop: CanvasProps["frameloop"];
  reduced: boolean;
  className?: string;
  onReady: () => void;
  children: ReactNode;
}) {
  return (
    <Canvas
      className={className}
      dpr={dpr}
      camera={camera}
      frameloop={frameloop}
      // R3F measures its container with react-use-measure, whose ResizeObserver
      // shares the *scroll-debounced* callback. With scroll tracking on, every
      // scroll event (Lenis emits one per frame) postpones the first measurement,
      // so a canvas mounted mid-scroll would stay blank until scrolling stopped.
      // Pointer events use element-relative offsets, so scroll tracking isn't needed.
      resize={{ scroll: false, debounce: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <MotionCtx.Provider value={{ reduced }}>
        <Suspense fallback={null}>
          {children}
          <SceneReady onReady={onReady} />
        </Suspense>
      </MotionCtx.Provider>
    </Canvas>
  );
}

/**
 * Mounts together with the (already resolved) scene.
 * Compiles every shader program up front and renders a first frame — even while
 * the canvas is still off-screen with frameloop "never" — then signals ready, so
 * the scene appears fully formed the moment its section scrolls into view.
 */
function SceneReady({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera, advance } = useThree();
  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      try {
        gl.compile(scene, camera);
      } catch {
        // compile is an optimisation only; rendering will compile lazily instead
      }
      advance(performance.now());
      raf = requestAnimationFrame(() => onReady());
    });
    return () => cancelAnimationFrame(raf);
    // Run once per mounted scene.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
