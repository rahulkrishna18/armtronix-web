"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { CanvasProps } from "@react-three/fiber";
import { useInView, useIsDesktop, useReducedMotion } from "@/lib/hooks";
import { hasWebGL } from "@/lib/webgl";
import { cn } from "@/lib/cn";

import { loadCanvasRoot, preloadScenes } from "./preload";

const CanvasRoot = dynamic(loadCanvasRoot, { ssr: false });

class GLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") console.warn("[SceneCanvas] WebGL scene failed, showing fallback.", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const noopSubscribe = () => () => {};

type Props = {
  className?: string;
  /** Static poster shown until the scene's first frame, or permanently without WebGL. */
  fallback: ReactNode;
  camera: CanvasProps["camera"];
  children: ReactNode;
  /** Mount immediately instead of waiting for the canvas to approach the viewport. */
  eager?: boolean;
  /** Accessible description of what the visualization shows. */
  label: string;
  /** False until the scene module has been resolved; the canvas mounts only after. */
  loaded?: boolean;
};

/**
 * Wrapper around R3F's Canvas that:
 *  - lazy-mounts when the canvas nears the viewport,
 *  - pauses rendering entirely while off-screen,
 *  - renders on demand only when the user prefers reduced motion,
 *  - degrades to a static poster when WebGL is unavailable or crashes.
 */
export function SceneCanvas({ className, fallback, camera, children, eager, label, loaded = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Mount ~1.5 viewports ahead so the scene is built, compiled and warmed (while
  // paused off-screen) before the visitor arrives.
  const near = useInView(ref, { rootMargin: "150% 0px", once: true });
  const visible = useInView(ref, { rootMargin: "80px 0px" });
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const supported = useSyncExternalStore(noopSubscribe, hasWebGL, () => null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    preloadScenes();
  }, []);

  const mount = (eager || near) && supported === true && loaded;

  return (
    <div ref={ref} role="img" aria-label={label} className={className ?? "relative"}>
      <div
        aria-hidden
        className={cn("absolute inset-0 transition-opacity duration-500", mount && ready ? "pointer-events-none opacity-0" : "opacity-100")}
      >
        {fallback}
      </div>
      {mount && (
        <GLBoundary fallback={fallback}>
          <CanvasRoot
            className={cn("absolute! inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}
            dpr={[1, desktop ? 1.75 : 1.5]}
            camera={camera}
            frameloop={visible ? (reduced ? "demand" : "always") : "never"}
            reduced={reduced}
            onReady={() => setReady(true)}
          >
            {children}
          </CanvasRoot>
        </GLBoundary>
      )}
    </div>
  );
}
