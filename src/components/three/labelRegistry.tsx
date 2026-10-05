"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Screen-space labels for 3D scenes, rendered as ordinary React DOM outside the
 * WebGL canvas. Scenes place a <LabelAnchor> (see primitives) that projects its
 * world position every frame and writes the transform straight to the matching
 * DOM node registered here. No nested React roots, no three.js in this module.
 */
export type LabelRegistry = { nodes: Map<string, HTMLElement> };

export function useLabelRegistry(): LabelRegistry {
  const [registry] = useState<LabelRegistry>(() => ({ nodes: new Map() }));
  return registry;
}

export function LabelNode({
  registry,
  id,
  className,
  style,
  children,
}: {
  registry: LabelRegistry;
  id: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      ref={(el) => {
        if (!el) return;
        registry.nodes.set(id, el);
        return () => {
          registry.nodes.delete(id);
        };
      }}
      aria-hidden
      className={cn("pointer-events-none absolute left-0 top-0 will-change-transform", className)}
      style={{ opacity: 0, ...style }}
    >
      {children}
    </div>
  );
}

/** Full-bleed layer that hosts LabelNodes above a canvas. */
export function LabelLayer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>{children}</div>;
}
