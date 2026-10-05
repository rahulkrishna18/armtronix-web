"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/** SSR-safe media query hook. Returns `fallback` during server render. */
export function useMediaQuery(query: string, fallback = false) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)", true);
export const useIsCoarsePointer = () => useMediaQuery("(pointer: coarse)");

/**
 * Tracks whether an element intersects the viewport.
 * `once` latches to true after the first intersection (used for lazy mounting).
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px", once = false, threshold = 0 }: { rootMargin?: string; once?: boolean; threshold?: number } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once, threshold]);
  return inView;
}

/** Runs `fn` on an interval only while `active` is true. */
export function useInterval(fn: () => void, ms: number, active = true) {
  const saved = useRef(fn);
  useEffect(() => {
    saved.current = fn;
  }, [fn]);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, active]);
}
