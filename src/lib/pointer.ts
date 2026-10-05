"use client";

/**
 * A single shared window-level pointer tracker. 3D scenes sit behind text
 * overlays, so they read pointer position from here rather than canvas events.
 * Values are normalised to [-1, 1] with +y up.
 */
export const pointer = { x: 0, y: 0, active: false };

let attached = false;

export function attachPointer() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.active = true;
    },
    { passive: true },
  );
}
