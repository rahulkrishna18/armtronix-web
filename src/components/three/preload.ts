import { createElement, useEffect, useState, type ComponentType, type ReactElement } from "react";

/*
 * Shared loaders for the WebGL code. Sections use these with React.lazy and
 * SceneCanvas warms them during idle time, so by the time a visitor scrolls to
 * a 3D section its code is already downloaded (no import waterfall on arrival).
 */
export const loadCanvasRoot = () => import("./CanvasRoot");
export const loadHeroScene = () => import("./HeroScene");
export const loadEcosystemScene = () => import("./EcosystemScene");
export const loadExplodedScene = () => import("./ExplodedScene");
export const loadTransmissionScene = () => import("./TransmissionScene");
export const loadNetworkScene = () => import("./NetworkScene");

const ALL = [loadCanvasRoot, loadHeroScene, loadEcosystemScene, loadExplodedScene, loadTransmissionScene, loadNetworkScene];

let started = false;

/** Fetch every scene chunk once the main thread is idle (runs once per session). */
export function preloadScenes() {
  if (started || typeof window === "undefined") return;
  started = true;
  const run = () => ALL.forEach((load) => load().catch(() => {}));
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 800);
}

/* -------------------------------------------------------------------------- */


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolved = new Map<() => Promise<{ default: ComponentType<any> }>, ComponentType<any>>();

/**
 * Resolves a scene module via ordinary state (not Suspense). Suspense retries run
 * in a low-priority lane that never expires, so continuous scroll work could
 * starve them and leave a scene on its poster until scrolling stopped.
 */
export function useSceneModule<P>(loader: () => Promise<{ default: ComponentType<P> }>): ComponentType<P> | null {
  const [Comp, setComp] = useState<ComponentType<P> | null>(() => (resolved.get(loader) as ComponentType<P>) ?? null);
  useEffect(() => {
    if (Comp) return;
    let alive = true;
    loader().then((m) => {
      resolved.set(loader, m.default);
      if (alive) setComp(() => m.default);
    });
    return () => {
      alive = false;
    };
  }, [loader, Comp]);
  return Comp;
}

/** Convenience: the resolved scene as an element (null until its module is loaded). */
export function useSceneElement<P extends object>(loader: () => Promise<{ default: ComponentType<P> }>, props: P): ReactElement | null {
  const Comp = useSceneModule(loader);
  return Comp ? createElement(Comp, props) : null;
}
